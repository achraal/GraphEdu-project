import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_COURSE_CATALOG } from '../graphql/courses';
import { Search } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
}

export default function CourseCatalog() {
    const [levelFilter, setLevelFilter] = useState('');

    // Exécution de la requête avec les variables de filtre
    const { loading, error, data } = useQuery(GET_COURSE_CATALOG, {
        variables: {
            level: levelFilter || null,
            // departmentId et instructorId peuvent être ajoutés de la même manière
        },
        fetchPolicy: 'cache-and-network',
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Catalogue des Cours</h1>

                <div className="flex gap-4">
                    <select
                        className="border border-gray-300 rounded-md p-2"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                    >
                        <option value="">Tous les niveaux</option>
                        <option value="Licence">Licence</option>
                        <option value="Master">Master</option>
                        <option value="Doctorat">Doctorat</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-gray-500">Chargement du catalogue...</p>}
            {error && <p className="text-red-500">Erreur lors du chargement : {error.message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.getCourseCatalog.map((course: Course) => (
                    <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-indigo-600 mb-2">{course.title}</h3>
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-3">
              {course.level}
            </span>
                        <p className="text-gray-600 line-clamp-3 mb-4">{course.description}</p>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                            Voir les détails <Search size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}