import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => {
    // clear everything from localStorage
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      
      {/* left side - brand */}
      <Link to="/" className="text-xl font-bold tracking-wide">
        LMS App
      </Link>

      {/* middle - role based links */}
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/courses" className="hover:underline">
          Courses
        </Link>

        {user.role === "instructor" && (
          <Link to="/my-courses" className="hover:underline">
            My Courses
          </Link>
        )}

        {user.role === "admin" && (
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        )}
      </div>

      {/* right side - profile + logout */}
      <div className="flex items-center gap-4 text-sm">
        <span className="bg-blue-500 px-2 py-1 rounded text-xs capitalize">
          {user.role}
        </span>
        <Link to="/profile" className="hover:underline">
          {user.username}
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition font-medium"
        >
          Logout
        </button>
      </div>

    </nav>
  )
}

export default Navbar