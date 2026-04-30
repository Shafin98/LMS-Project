import { Navigate } from "react-router-dom"

// role is optional — pass it to restrict by role too
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("access")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // no token = not logged in = go to login
  if (!token) {
    return <Navigate to="/login" />
  }

  // if role is required and doesn't match = go back to login
  if (role && user.role !== role) {
    return <Navigate to="/login" />
  }

  // all good = show the page
  return children
}

export default ProtectedRoute