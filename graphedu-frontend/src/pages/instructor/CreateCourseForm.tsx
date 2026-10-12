import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_COURSE } from '../../graphql/courses';
import { useAuth } from '../../contexts/AuthContext';

export default function CreateCourseForm() {
    const { user } = useAuth(); // Pour récupérer l'ID de l'instructeur connecté
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'Licence',
        departmentId: '',
    });

    const [createCourse, { loading, error }] = useMutation(CREATE_COURSE, {
        onCompleted: () => {
            alert("Cours créé avec succès !");
            setFormData({ title: '', description: '', level: 'Licence', departmentId: '' });
        },
        // Mise à jour du cache Apollo optionnelle ici pour refléter l'ajout immédiat
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCourse({
            variables: {
                ...formData,
                instructorId: user?.id,
                departmentId: parseInt(formData.departmentId, 10),
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Créer un nouveau cours</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Titre du cours</label>
                    <input
                        type="text" required
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        required rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Niveau</label>
                        <select
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={formData.level}
                            onChange={(e) => setFormData({...formData, level: e.target.value})}
                        >
                            <option value="Licence">Licence</option>
                            <option value="Master">Master</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID Département</label>
                        <input
                            type="number" required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                            value={formData.departmentId}
                            onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error.message}</p>}

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Création en cours...' : 'Enregistrer le cours'}
                </button>
            </div>
        </form>
    );
}