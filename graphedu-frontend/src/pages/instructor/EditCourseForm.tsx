import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_COURSE } from '../../graphql/courses';

interface EditCourseProps {
    course: { id: string; title: string; description: string; level: string };
    onSuccess: () => void;
}

export default function EditCourseForm({ course, onSuccess }: EditCourseProps) {
    const [formData, setFormData] = useState({
        title: course.title,
        description: course.description,
        level: course.level,
    });

    const [updateCourse, { loading, error }] = useMutation(UPDATE_COURSE, {
        onCompleted: () => {
            alert("Cours mis à jour avec succès !");
            onSuccess();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCourse({ variables: { id: course.id, ...formData } });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow border border-gray-200 mt-4">
            <h3 className="text-lg font-bold mb-4">Modifier le cours</h3>

            <div className="space-y-4">
                <input
                    type="text" required placeholder="Titre"
                    className="block w-full rounded-md border border-gray-300 p-2"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <textarea
                    required rows={3} placeholder="Description"
                    className="block w-full rounded-md border border-gray-300 p-2"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <select
                    className="block w-full rounded-md border border-gray-300 p-2"
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                >
                    <option value="Licence">Licence</option>
                    <option value="Master">Master</option>
                    <option value="Doctorat">Doctorat</option>
                </select>

                {error && <p className="text-red-500 text-sm">{error.message}</p>}

                <button
                    type="submit" disabled={loading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-full"
                >
                    {loading ? 'Modification...' : 'Enregistrer les modifications'}
                </button>
            </div>
        </form>
    );
}