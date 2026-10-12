import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COURSE_CATALOG, ARCHIVE_COURSE, ADD_PREREQUISITE } from '../../graphql/courses';
import { useAuth } from '../../contexts/AuthContext';
import EditCourseForm from './EditCourseForm';

interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
}

export default function ManageCourses() {
    const { user } = useAuth();
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
    const [prereqData, setPrereqData] = useState({ courseId: '', prereqId: '' });

    // On récupère uniquement les cours de l'instructeur connecté
    const { loading, data, refetch } = useQuery(GET_COURSE_CATALOG, {
        variables: { instructorId: user?.id },
        fetchPolicy: 'network-only'
    });

    const [archiveCourse] = useMutation(ARCHIVE_COURSE, {
        onCompleted: () => refetch()
    });

    const [addPrerequisite] = useMutation(ADD_PREREQUISITE, {
        onCompleted: () => {
            alert("Prérequis ajouté avec succès dans le graphe !");
            setPrereqData({ courseId: '', prereqId: '' });
        }
    });

    const handleArchive = (id: string) => {
        if (window.confirm("Voulez-vous vraiment archiver ce cours ?")) {
            archiveCourse({ variables: { id } });
        }
    };

    const handleAddPrereq = (e: React.FormEvent) => {
        e.preventDefault();
        addPrerequisite({ variables: { courseId: prereqData.courseId, prerequisiteId: prereqData.prereqId } });
    };

    if (loading) return <p>Chargement de vos cours...</p>;

    const courses: Course[] = data?.getCourseCatalog || [];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestion de mes cours</h1>

            {/* Formulaire rapide pour ajouter un prérequis (Lien entre deux nœuds Neo4j) */}
            <form onSubmit={handleAddPrereq} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Cours cible (ID)</label>
                    <input type="text" required className="w-full p-2 border rounded"
                           value={prereqData.courseId} onChange={e => setPrereqData({...prereqData, courseId: e.target.value})} />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">ID du cours Prérequis</label>
                    <input type="text" required className="w-full p-2 border rounded"
                           value={prereqData.prereqId} onChange={e => setPrereqData({...prereqData, prereqId: e.target.value})} />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Lier (Prérequis)
                </button>
            </form>

            {/* Liste des cours pour modification / archivage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold">{course.title} <span className="text-sm text-gray-500">(ID: {course.id})</span></h3>
                        <p className="text-gray-600 my-2">{course.level}</p>

                        <div className="flex gap-2 mt-4">
                            <button onClick={() => setEditingCourseId(course.id)} className="text-blue-600 hover:underline text-sm font-medium">
                                Modifier
                            </button>
                            {/* Seul l'Admin peut archiver selon votre controleur, mais on l'affiche ici pour l'exemple.
                  Vous pouvez conditionner l'affichage : {user?.role === 'ADMIN' && ...} */}
                            {user?.role === 'ADMIN' && (
                                <button onClick={() => handleArchive(course.id)} className="text-red-600 hover:underline text-sm font-medium">
                                    Archiver
                                </button>
                            )}
                        </div>

                        {editingCourseId === course.id && (
                            <EditCourseForm course={course} onSuccess={() => { setEditingCourseId(null); refetch(); }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}