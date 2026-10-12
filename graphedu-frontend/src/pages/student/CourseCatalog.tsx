import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COURSE_CATALOG } from '../graphql/courses';
import { ENROLL_STUDENT } from '../graphql/enrollments';
import { useAuth } from '../contexts/AuthContext';
import { Search, PlusCircle } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
}

export default function CourseCatalog() {
    const { user } = useAuth();
    const [levelFilter, setLevelFilter] = useState('');

    const { loading, error, data } = useQuery(GET_COURSE_CATALOG, {
        variables: { level: levelFilter || null },
        fetchPolicy: 'cache-and-network',
    });

    const [enrollStudent] = useMutation(ENROLL_STUDENT, {
        onCompleted: (data) => {
            if (data.enrollStudentInCourse) {
                alert("Inscription réussie !");
            } else {
                alert("Inscription refusée. Avez-vous validé les prérequis ?");
            }
        },
        onError: (err) => {
            alert(`Erreur d'inscription : ${err.message}`);
        }
    });

    const handleEnroll = (courseId: string) => {
        if (!user?.id) return;
        enrollStudent({ variables: { studentId: user.id, courseId } });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Catalogue des Cours</h1>
                <select
                    className="border border-gray-300 rounded-md p-2"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                >
                    <option value="">Tous les niveaux</option>
                    <option value="Licence">Licence</option>
                    <option value="Master">Master</option>
                </select>
            </div>

            {loading && <p className="text-gray-500">Chargement...</p>}
            {error && <p className="text-red-500">Erreur : {error.message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.getCourseCatalog.map((course: Course) => (
                    <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-indigo-600 mb-2">{course.title}</h3>
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-3">
              {course.level}
            </span>
                        <p className="text-gray-600 line-clamp-3 mb-4">{course.description}</p>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <button className="text-sm font-medium text-gray-600 hover:text-indigo-800 flex items-center gap-1">
                                Détails <Search size={16} />
                            </button>

                            {/* Le bouton d'inscription n'est visible que pour les étudiants */}
                            {user?.role === 'STUDENT' && (
                                <button
                                    onClick={() => handleEnroll(course.id)}
                                    className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded hover:bg-indigo-100 text-sm font-medium transition-colors"
                                >
                                    <PlusCircle size={16} /> S'inscrire
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}