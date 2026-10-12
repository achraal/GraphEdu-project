import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_MY_ENROLLMENTS, GET_STUDENT_PATHWAY } from '../../graphql/enrollments';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentDashboard() {
    const { user } = useAuth();
    // Pour l'exemple, on fixe l'ID du département à 1 (à rendre dynamique selon le cas d'usage)
    const [departmentId] = useState("1");

    const { loading: enrollmentsLoading, data: enrollmentsData } = useQuery(GET_MY_ENROLLMENTS, {
        fetchPolicy: 'cache-and-network',
    });

    const { loading: pathwayLoading, data: pathwayData } = useQuery(GET_STUDENT_PATHWAY, {
        variables: { studentId: user?.id, departmentId },
        skip: !user?.id,
    });

    if (enrollmentsLoading || pathwayLoading) return <p className="p-6">Chargement de votre espace...</p>;

    const enrollments = enrollmentsData?.me?.enrollments || [];
    const pathway = pathwayData?.getStudentPathway;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {user?.name}</h1>

            {/* Section Inscriptions actuelles */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Mes Inscriptions</h2>
                {enrollments.length === 0 ? (
                    <p className="text-gray-500">Vous n'êtes inscrit à aucun cours pour le moment.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {enrollments.map((enrollment: any) => (
                            <li key={enrollment.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-medium text-gray-900">{enrollment.course.title}</p>
                                    <p className="text-sm text-gray-500">Statut: {enrollment.status} | Niveau: {enrollment.course.level}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  Inscrit
                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Section Parcours Académique (Logique Graphe) */}
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Mon Parcours (Département {departmentId})</h2>
                <p className="text-gray-600 mb-6">Visualisation de votre avancement basée sur les prérequis.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cours complétés */}
                    <div>
                        <h3 className="text-lg font-medium text-green-600 mb-3 flex items-center gap-2">
                            ✓ Cours Validés
                        </h3>
                        <ul className="space-y-2">
                            {pathway?.completedCourses?.map((course: any) => (
                                <li key={course.id} className="p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                                    {course.title}
                                </li>
                            ))}
                            {!pathway?.completedCourses?.length && <p className="text-sm text-gray-500">Aucun cours validé.</p>}
                        </ul>
                    </div>

                    {/* Cours restants */}
                    <div>
                        <h3 className="text-lg font-medium text-orange-600 mb-3 flex items-center gap-2">
                            ⏳ Cours Restants
                        </h3>
                        <ul className="space-y-2">
                            {pathway?.remainingCourses?.map((course: any) => (
                                <li key={course.id} className="p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                                    {course.title}
                                </li>
                            ))}
                            {!pathway?.remainingCourses?.length && <p className="text-sm text-gray-500">Parcours terminé !</p>}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}