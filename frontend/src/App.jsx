import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import Profile from "./pages/profile/Profile"
import CourseList from "./pages/courses/CourseList"
import CourseDetail from "./pages/courses/CourseDetail"
import MyCourses from "./pages/courses/MyCourses"
import CreateCourse from "./pages/courses/CreateCourse"
import EditCourse from "./pages/courses/EditCourse"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* any logged in user */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute>
          <CourseList />
        </ProtectedRoute>
      } />
      <Route path="/courses/:id" element={
        <ProtectedRoute>
          <CourseDetail />
        </ProtectedRoute>
      } />

      {/* instructor only */}
      <Route path="/my-courses" element={
        <ProtectedRoute role="instructor">
          <MyCourses />
        </ProtectedRoute>
      } />
      <Route path="/courses/create" element={
        <ProtectedRoute role="instructor">
          <CreateCourse />
        </ProtectedRoute>
      } />
      <Route path="/courses/:id/edit" element={
        <ProtectedRoute role="instructor">
          <EditCourse />
        </ProtectedRoute>
      } />

      {/* placeholder - replaced in next step */}
      <Route path="/dashboard" element={
        <ProtectedRoute role="admin">
          <div className="text-center mt-20 text-2xl text-blue-600 font-bold">
            Dashboard coming soon...
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App