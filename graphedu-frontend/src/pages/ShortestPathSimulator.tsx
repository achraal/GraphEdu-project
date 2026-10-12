import { useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_SHORTEST_PATH } from '../graphql/recommendations';
import { ArrowRight, Map } from 'lucide-react';

export default function ShortestPathSimulator() {
    const [startCourseId, setStartCourseId] = useState('');
    const [targetCourseId, setTargetCourseId] = useState('');

    const [getShortestPath, { loading, error, data }] = useLazyQuery(GET_SHORTEST_PATH);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        if (startCourseId && targetCourseId) {
            getShortestPath({ variables: { startCourseId, targetCourseId } });
        }
    };

    const pathResult = data?.getShortestCertificationPath;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Map className="text-indigo-600" size={32} />
                <h1 className="text-3xl font-bold text-gray-900">Simulateur de Parcours</h1>
            </div>

            <form onSubmit={handleSimulate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID du Cours de Départ</label>
                    <input
                        type="text" required
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={startCourseId} onChange={e => setStartCourseId(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID de la Certification (Cible)</label>
                    <input
                        type="text" required
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={targetCourseId} onChange={e => setTargetCourseId(e.target.value)}
                    />
                </div>
                <button
                    type="submit" disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 h-[42px] disabled:opacity-50"
                >
                    {loading ? 'Calcul...' : 'Trouver le chemin'}
                </button>
            </form>

            {error && <p className="text-red-500 bg-red-50 p-4 rounded-md">Erreur : {error.message}</p>}

            {pathResult && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">
                        Chemin Optimal Trouvé ({pathResult.totalCourses} étapes)
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                        {pathResult.path.map((course: any, index: number) => (
                            <div key={course.id} className="flex items-center">
                                <div className="bg-white px-4 py-2 rounded-full border border-green-300 shadow-sm font-medium text-gray-800">
                                    {course.title}
                                </div>
                                {index < pathResult.path.length - 1 && (
                                    <ArrowRight className="text-green-500 mx-2" size={20} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}