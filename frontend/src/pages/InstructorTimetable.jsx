import { useState, useEffect } from "react";
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "./SideNav";
import api from "../services/api";

const InstructorTimetable = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Days including weekends
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Time slots from 7 AM to 7 PM with 1-hour gaps
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 7 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Please login again.");
        toast.error("Unauthorized access. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const [instructorsRes, assignmentsRes] = await Promise.all([
          api.get("/api/instructors", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get("/api/allClassAssignments", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setInstructors(instructorsRes.data);
        setAssignments(assignmentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter assignments when instructor is selected
  useEffect(() => {
    if (selectedInstructorId) {
      const filtered = assignments.filter(
        (assignment) => assignment.instructorId === selectedInstructorId
      );
      setFilteredAssignments(filtered);
    } else {
      setFilteredAssignments([]);
    }
  }, [selectedInstructorId, assignments]);

  // Group assignments by day for easier display
  const groupByDay = (assignments) => {
    return assignments.reduce((acc, assignment) => {
      const day = assignment.date;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(assignment);
      return acc;
    }, {});
  };

  // Get classes for a specific time slot
  const getClassesForSlot = (day, time) => {
    return filteredAssignments.filter((assignment) => {
      return (
        assignment.date === day &&
        assignment.startTime <= time &&
        assignment.endTime > time
      );
    });
  };

  const assignmentsByDay = groupByDay(filteredAssignments);
  const selectedInstructor = instructors.find(
    (i) => i.id === selectedInstructorId
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNav
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
          toggleMobileSidebar={setMobileSidebarOpen}
        />
        <div
          className={`flex-1 p-8 flex items-center justify-center ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading timetable data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNav
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        mobileSidebarOpen={mobileSidebarOpen}
        toggleMobileSidebar={setMobileSidebarOpen}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="p-4 lg:p-8">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Mobile header with toggle button */}
          <div className="lg:hidden flex items-center mb-6">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="mr-4 p-2 rounded-lg bg-blue-100 text-blue-600"
            >
              {mobileSidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Instructor Timetable
              </h1>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <CalendarIcon className="w-8 h-8 text-blue-600" />
              Instructor Timetable Viewer
            </h1>
            <p className="text-gray-600">
              View teaching schedules and class timetables for instructors
            </p>
          </div>

          {/* Instructor Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label
                  htmlFor="instructor-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Instructor
                </label>
                <select
                  id="instructor-select"
                  value={selectedInstructorId}
                  onChange={(e) => setSelectedInstructorId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select an instructor --</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.firstName} {instructor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedInstructor && (
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {selectedInstructor.firstName}{" "}
                      {selectedInstructor.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedInstructor.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          {selectedInstructorId ? (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <AcademicCapIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Courses Teaching</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {
                          [
                            ...new Set(
                              filteredAssignments.map((a) => a.courseName)
                            ),
                          ].length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <ClockIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weekly Classes</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {filteredAssignments.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <BuildingOffice2Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Teaching Locations
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {
                          [
                            ...new Set(
                              filteredAssignments.map((a) => a.location)
                            ),
                          ].length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timetable View */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  Weekly Timetable (7 AM - 7 PM)
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3 border bg-gray-50 text-left text-sm font-medium text-gray-500">
                          Time
                        </th>
                        {days.map((day) => (
                          <th
                            key={day}
                            className="p-3 border bg-gray-50 text-center text-sm font-medium text-gray-500"
                          >
                            {day.substring(0, 3)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((time) => (
                        <tr key={time}>
                          <td className="p-3 border text-sm text-gray-600 font-medium">
                            {time}
                          </td>
                          {days.map((day) => {
                            const slotClasses = getClassesForSlot(day, time);

                            return (
                              <td key={`${day}-${time}`} className="p-1 border">
                                {slotClasses.map((assignment) => (
                                  <div
                                    key={assignment.id}
                                    className="bg-blue-50 border border-blue-100 rounded p-2 mb-1 text-xs"
                                  >
                                    <p className="font-medium text-blue-800 truncate">
                                      {assignment.courseName}
                                    </p>
                                    <p className="text-blue-600 truncate">
                                      {assignment.moduleName}
                                    </p>
                                    <p className="text-blue-500">
                                      {assignment.groupName}
                                    </p>
                                    <p className="text-blue-700">
                                      {assignment.location}
                                    </p>
                                  </div>
                                ))}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* List View */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Class Schedule Details
                </h2>

                {filteredAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {days.map(
                      (day) =>
                        assignmentsByDay[day]?.length > 0 && (
                          <div key={day}>
                            <h3 className="font-medium text-gray-700 mb-2">
                              {day}
                            </h3>
                            <div className="space-y-2">
                              {assignmentsByDay[day]
                                .sort((a, b) =>
                                  a.startTime.localeCompare(b.startTime)
                                )
                                .map((assignment) => (
                                  <div
                                    key={assignment.id}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                  >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                      <div>
                                        <p className="font-medium text-gray-800">
                                          {assignment.courseName} -{" "}
                                          {assignment.moduleName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Group: {assignment.groupName}
                                        </p>
                                      </div>
                                      <div className="mt-2 md:mt-0">
                                        <p className="text-sm text-gray-700">
                                          <span className="font-medium">
                                            Time:
                                          </span>{" "}
                                          {assignment.startTime} -{" "}
                                          {assignment.endTime}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                          <span className="font-medium">
                                            Location:
                                          </span>{" "}
                                          {assignment.location}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No classes scheduled for this instructor</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
              <UserIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Select an instructor to view timetable
              </h3>
              <p className="text-gray-500">
                Choose an instructor from the dropdown above to see their
                teaching schedule
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorTimetable;
