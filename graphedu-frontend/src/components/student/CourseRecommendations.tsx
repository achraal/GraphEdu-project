import { useQuery } from '@apollo/client/react';
import { GET_COURSE_RECOMMENDATIONS } from '../../graphql/recommendations';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export default function CourseRecommendations() {
    const { user } = useAuth();

    const { loading, error, data } = useQuery(GET_COURSE_RECOMMENDATIONS, {
        variables: { studentId: user?.id },
        skip: !user?.id,
    });

    if (loading) return <p className="text-indigo-500 text-sm">Génération de vos recommandations...</p>;
    if (error) return <p className="text-red-500 text-sm">Erreur : {error.message}</p>;

    const recommendations = data?.getCourseRecommendations || [];

    if (recommendations.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg shadow-sm border border-indigo-100 mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-800 flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={24} />
                Recommandés pour vous
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((course: any) => (
                    <div key={course.id} className="bg-white p-4 rounded-md shadow-sm border border-indigo-50">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{course.level}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}