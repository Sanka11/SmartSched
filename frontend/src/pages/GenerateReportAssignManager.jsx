import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AcademicCapIcon, UserGroupIcon, UserIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import SideNav from "./SideNav";

function GenerateReportAssignManager() {
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  const fetchInstructorAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/instructors");
      if (!response.ok) throw new Error("Failed to fetch instructor assignments");
      const data = await response.json();
      setInstructors(data);
      setActiveReport('instructors');
    } catch (error) {
      console.error("Error fetching instructor assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentEnrollments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/student-enrollments");
      if (!response.ok) throw new Error("Failed to fetch student enrollments");
      const data = await response.json();
      setStudents(data);
      setActiveReport('students');
    } catch (error) {
      console.error("Error fetching student enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (fileName, title) => {
    if (!tableRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFillColor(99, 102, 241);
    pdf.rect(0, 0, 210, 40, "F");
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.text(title, 15, 25);

    pdf.addImage(imgData, "PNG", 10, 45, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
  };

  return (
    <div className=" flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SideNav />
      <div className="p-8 w-full">
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <AcademicCapIcon className="h-12 w-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Academic Reporting System
          </h1>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={fetchInstructorAssignments}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-all"
              disabled={loading}
            >
              <UserIcon className="h-5 w-5" />
              {loading && activeReport === 'instructors' ? (
                <span>Loading Assignments...</span>
              ) : (
                <span>Show Instructor Assignments</span>
              )}
            </button>

            <button
              onClick={fetchStudentEnrollments}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all"
              disabled={loading}
            >
              <UserGroupIcon className="h-5 w-5" />
              {loading && activeReport === 'students' ? (
                <span>Loading Enrollments...</span>
              ) : (
                <span>Show Student Enrollments</span>
              )}
            </button>
          </div>
        </div>

        {/* Report Display Area */}
        {activeReport === 'instructors' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-t-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <UserIcon className="h-6 w-6 text-blue-600" />
                Instructor Assignments
              </h2>
              <button
                onClick={() => downloadPDF("instructor_assignments", "Instructor Assignments")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export PDF
              </button>
            </div>

            <div ref={tableRef} className="bg-white rounded-b-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-gray-700">Instructor</th>
                    <th className="px-6 py-4 text-left font-medium text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left font-medium text-gray-700">Modules</th>
                    <th className="px-6 py-4 text-left font-medium text-gray-700">Assigned Classes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {instructors.map((instructor) => (
                    <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {instructor.firstName} {instructor.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{instructor.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {instructor.modules?.map((module, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {module}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {instructor.modules?.map((module, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {instructor.classes[module] || 'Not assigned'}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'students' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-t-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
                Student Enrollments
              </h2>
              <button
                onClick={() => downloadPDF("student_enrollments", "Student Enrollments")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export PDF
              </button>
            </div>

            <div ref={tableRef} className="bg-white rounded-b-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-gray-700">Student</th>
                    <th className="px-6 py-4 text-left font-medium text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left font-medium text-gray-700">Enrolled Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{student.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {student.courses?.map((course, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default GenerateReportAssignManager;