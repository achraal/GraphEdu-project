import { useQuery } from '@apollo/client/react';
import { GET_STUDENTS_IN_COURSE } from '../../graphql/users';

interface CourseStudentsProps {
    courseId: string;
}

export default function CourseStudents({ courseId }: CourseStudentsProps) {
    const { loading, error, data } = useQuery(GET_STUDENTS_IN_COURSE, {
        variables: { courseId },
    });

    if (loading) return <p className="text-sm text-gray-500 mt-4">Chargement des étudiants...</p>;
    if (error) return <p className="text-sm text-red-500 mt-4">Erreur : {error.message}</p>;

    const students = data?.getStudentsInCourse || [];

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Étudiants inscrits ({students.length})</h4>
            {students.length === 0 ? (
                <p className="text-xs text-gray-500">Aucun étudiant inscrit pour le moment.</p>
            ) : (
                <ul className="space-y-1">
                    {students.map((student: any) => (
                        <li key={student.id} className="text-sm text-gray-600 flex justify-between">
                            <span>{student.name}</span>
                            <span className="text-xs text-gray-400">{student.email}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}