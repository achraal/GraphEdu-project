import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import CourseCatalog from './pages/CourseCatalog';
import CreateCourseForm from './pages/instructor/CreateCourseForm';
import ManageCourses from './pages/instructor/ManageCourses';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ShortestPathSimulator from './pages/ShortestPathSimulator';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/catalog" element={<CourseCatalog />} />
                        <Route path="/simulator" element={<ShortestPathSimulator />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                        <Route path="/student-dashboard" element={<StudentDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']} />}>
                        <Route path="/instructor-dashboard" element={<ManageCourses />} />
                        <Route path="/courses/create" element={<CreateCourseForm />} />
                        <Route path="/courses/manage" element={<ManageCourses />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;