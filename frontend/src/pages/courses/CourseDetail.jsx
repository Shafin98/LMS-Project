import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../../api/axios"
import Navbar from "../../components/Navbar"

function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get("/lms/courses/" + id + "/")
        const lessonRes = await api.get("/lms/courses/" + id + "/lessons/")
        setCourse(courseRes.data)
        setLessons(lessonRes.data)
      } catch (err) {
        setError("Failed to load course details")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleEnroll = async () => {
    setEnrolling(true)
    setMessage("")
    setError("")
    try {
      await api.post("/lms/enroll/", { course: id })
      setMessage("Successfully enrolled in this course!")
    } catch (err) {
      const msg = err.response?.data
      if (typeof msg === "object") {
        const first = Object.values(msg)[0]
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError("Enrollment failed. Please try again.")
      }
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "80px", color: "gray" }}>
          Loading course details...
        </p>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {course && course.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {course && course.description}
            </p>
            <p className="text-xs text-gray-400">
              Instructor: {course && course.instructor}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Category: {course && course.category && course.category.name}
            </p>

            {user.role === "student" && (
              <div className="mt-6">
                {message && (
                  <p className="bg-green-100 text-green-700 p-3 rounded mb-3 text-sm">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="bg-red-100 text-red-600 p-3 rounded mb-3 text-sm">
                    {error}
                  </p>
                )}
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "Enroll in Course"}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Course Lessons
            </h3>

            {lessons.length === 0 && (
              <p className="text-gray-400 text-sm">No lessons added yet.</p>
            )}

            {lessons.length > 0 && (
              <div className="space-y-3">
                {lessons.map(function(lesson, index) {
                  return (
                    <div key={lesson.id} className="border border-gray-200 rounded p-4">
                      <p className="text-sm font-medium text-gray-700">
                        {index + 1}. {lesson.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {lesson.content}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail