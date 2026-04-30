import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import Navbar from "../../components/Navbar"

function CreateCourse() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    is_published: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // fetch categories when page loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/lms/categories/")
        setCategories(response.data)
      } catch (err) {
        setError("Failed to load categories")
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await api.post("/lms/courses/create/", formData)
      navigate("/my-courses")
    } catch (err) {
      const data = err.response?.data
      const first = Object.values(data || {})[0]
      setError(Array.isArray(first) ? first[0] : "Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">

          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Create New Course
          </h2>

          {error && (
            <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a category</option>
                {categories.map(function(cat) {
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                id="is_published"
                className="w-4 h-4"
              />
              <label htmlFor="is_published" className="text-sm text-gray-700">
                Publish this course
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Course"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/my-courses")}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default CreateCourse