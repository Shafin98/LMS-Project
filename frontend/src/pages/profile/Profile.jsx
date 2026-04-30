import { useState, useEffect } from "react"
import api from "../../api/axios"
import Navbar from "../../components/Navbar"

function Profile() {
  // stores what we get from backend
  const [profile, setProfile] = useState(null)

  // stores what user types in the form
  const [formData, setFormData] = useState({
    bio: "",
    expertise: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // get user from localStorage to show role-specific fields
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // fetch profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile/")
        setProfile(response.data)

        // pre-fill the form with existing data
        setFormData({
          bio: response.data.bio || "",
          expertise: response.data.expertise || "",
        })
      } catch (err) {
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      await api.put("/auth/profile/", formData)
      setMessage("Profile updated successfully!")
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-gray-500">Loading profile...</div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">

          <h2 className="text-2xl font-bold text-blue-600 mb-1">My Profile</h2>
          <p className="text-sm text-gray-500 mb-6">View and update your profile</p>

          {/* user info - read only */}
          <div className="bg-gray-50 rounded p-4 mb-6 space-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-600">Username: </span>
              {profile?.user?.username}
            </p>
            <p>
              <span className="font-medium text-gray-600">Email: </span>
              {profile?.user?.email}
            </p>
            <p>
              <span className="font-medium text-gray-600">Role: </span>
              <span className="capitalize">{profile?.user?.role}</span>
            </p>
          </div>

          {/* success / error messages */}
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

          {/* editable form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* only show expertise field for instructors */}
            {user.role === "instructor" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. Python, Web Development"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>

        </div>
      </div>
    </>
  )
}

export default Profile