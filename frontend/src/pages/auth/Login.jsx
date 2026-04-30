import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../api/axios"

function Login() {
  const navigate = useNavigate()

  // form data state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  // for showing errors and loading
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // updates formData when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/auth/login/", formData)

      // save tokens and user info to localStorage
      localStorage.setItem("access", response.data.access)
      localStorage.setItem("refresh", response.data.refresh)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // redirect based on role
      const role = response.data.user.role
      if (role === "admin") navigate("/dashboard")
      else if (role === "instructor") navigate("/my-courses")
      else navigate("/courses")

    } catch (err) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login to LMS
        </h2>

        {/* error message */}
        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
          <p>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login