import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import Navbar from "../../components/Navbar"

function CourseList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/lms/courses/")
        setCourses(response.data)
      } catch (err) {
        setError("Failed to load courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-gray-500">Loading courses...</div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6">

        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            All Courses
          </h2>

          {error && (
            <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          {/* no courses found */}
          {courses.length === 0 && !error && (
            <p className="text-gray-500 text-center mt-20">
              No courses available yet.
            </p>
          )}

          {/* course cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                {/* course info */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {course.category?.name || "Uncategorized"}
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
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Instructor: {course.instructor}
                  </p>
                </div>

                {/* view details button */}
                <button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

export default CourseList