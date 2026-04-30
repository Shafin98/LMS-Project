import { useState, useEffect } from "react"
import api from "../../api/axios"
import Navbar from "../../components/Navbar"

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/lms/dashboard/")
        setStats(response.data)
      } catch (err) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-20 text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <p className="text-center mt-20 text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-2xl font-bold text-blue-600 mb-8">
            Admin Dashboard
          </h2>

          {/* ── summary cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stats.total_courses}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Courses</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-green-600">
                {stats.total_enrollments}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Enrollments</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {stats.total_students}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Students</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-3xl font-bold text-yellow-500">
                {stats.total_instructors}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Instructors</p>
            </div>

          </div>

          {/* ── two column tables ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* top courses table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Top Courses by Enrollment
              </h3>

              {stats.top_courses.length === 0 && (
                <p className="text-gray-400 text-sm">No enrollment data yet.</p>
              )}

              {stats.top_courses.length > 0 && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-gray-600 font-medium">
                        Course
                      </th>
                      <th className="text-right py-2 text-gray-600 font-medium">
                        Enrollments
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_courses.map(function(item, index) {
                      return (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 text-gray-700">{item.course}</td>
                          <td className="py-2 text-right text-blue-600 font-semibold">
                            {item.enrollments}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* instructor stats table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Courses per Instructor
              </h3>

              {stats.instructor_stats.length === 0 && (
                <p className="text-gray-400 text-sm">No instructors yet.</p>
              )}

              {stats.instructor_stats.length > 0 && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-gray-600 font-medium">
                        Instructor
                      </th>
                      <th className="text-right py-2 text-gray-600 font-medium">
                        Courses
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.instructor_stats.map(function(item, index) {
                      return (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 text-gray-700">{item.instructor}</td>
                          <td className="py-2 text-right text-green-600 font-semibold">
                            {item.courses}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard