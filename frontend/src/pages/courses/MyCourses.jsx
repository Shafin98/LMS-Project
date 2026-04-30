import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import Navbar from "../../components/Navbar"

function MyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchMyCourses = async () => {
    try {
      const response = await api.get("/lms/my-courses/")
      setCourses(response.data)
    } catch (err) {
      setError("Failed to load your courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyCourses()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return

    try {
      await api.delete("/lms/courses/" + id + "/delete/")
      // remove deleted course from list without refetching
      setCourses(courses.filter(function(c) { return c.id !== id }))
    } catch (err) {
      alert("Failed to delete course")
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-20 text-gray-500">Loading your courses...</p>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto">

          {/* header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-600">My Courses</h2>
            <button
              onClick={() => navigate("/courses/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
            >
              + Create New Course
            </button>
          </div>

          {error && (
            <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          {courses.length === 0 && !error && (
            <p className="text-center text-gray-500 mt-20">
              You have not created any courses yet.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(function(course) {
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
                >
                  {/* course info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {course.category && course.category.name}
                      </span>
                      {course.is_published ? (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {course.description}
                    </p>
                  </div>

                  {/* action buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate("/courses/" + course.id + "/edit")}
                      className="flex-1 bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}

export default MyCourses