import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../api/axios"

// useParams reads the token from the URL
// URL will be: /reset-password/:token

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      await api.post("/auth/reset-password/", {
        token: token,
        new_password: newPassword,
      })

      setMessage("Password reset successful! Redirecting to login...")

      // wait 2 seconds then go to login
      setTimeout(() => navigate("/login"), 2000)

    } catch (err) {
      setError("Invalid or expired token. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Reset Password
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your new password below
        </p>

        {message && (
          <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default ResetPassword