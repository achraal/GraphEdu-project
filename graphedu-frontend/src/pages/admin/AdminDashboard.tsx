import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USERS_BY_ROLE, DELETE_USER, GET_TEACHING_LOAD_REPORT } from '../../graphql/users';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
    const [roleFilter, setRoleFilter] = useState('STUDENT');

    const { data: usersData, refetch: refetchUsers } = useQuery(GET_USERS_BY_ROLE, {
        variables: { role: roleFilter },
        fetchPolicy: 'network-only'
    });

    const { data: reportData } = useQuery(GET_TEACHING_LOAD_REPORT, {
        skip: activeTab !== 'reports'
    });

    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: () => refetchUsers()
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Supprimer cet utilisateur définitivement ?")) {
            deleteUser({ variables: { id } });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Administration GraphEdu</h1>

            {/* Navigation des onglets */}
            <div className="flex border-b border-gray-200">
                <button onClick={() => setActiveTab('users')} className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
                    Gestion des Utilisateurs
                </button>
                <button onClick={() => setActiveTab('reports')} className={`py-2 px-4 font-medium ${activeTab === 'reports' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
                    Rapports (Charge Horaire)
                </button>
            </div>

            {/* Onglet : Gestion des Utilisateurs */}
            {activeTab === 'users' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex gap-4 mb-4">
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border border-gray-300 rounded p-2">
                            <option value="STUDENT">Étudiants</option>
                            <option value="INSTRUCTOR">Instructeurs</option>
                            <option value="ADMIN">Administrateurs</option>
                        </select>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {usersData?.getUsersByRole.map((user: any) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Onglet : Rapports */}
            {activeTab === 'reports' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Charge Horaire des Professeurs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {reportData?.getTeachingLoadReport.map((report: any) => (
                            <div key={report.professorId} className="p-4 border rounded-md bg-blue-50 border-blue-100">
                                <h3 className="font-semibold text-blue-800">{report.professorName}</h3>
                                <p className="text-sm text-blue-600 mt-2">Cours enseignés : <span className="font-bold text-lg">{report.courseCount}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}