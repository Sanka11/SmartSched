import { useState, useEffect } from "react";
import { AcademicCapIcon, UserGroupIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "./SideNav";

const CourseGroupTimetable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  // Days including weekends
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Time slots (1-hour periods)
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour !== 18) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, assignmentsRes] = await Promise.all([
          fetch("http://localhost:8080/api/allcourses"),
          fetch("http://localhost:8080/api/allClassAssignments")
        ]);
        
        if (!coursesRes.ok || !assignmentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [coursesData, assignmentsData] = await Promise.all([
          coursesRes.json(),
          assignmentsRes.json()
        ]);

        setCourses(coursesData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter assignments when course or group is selected
  useEffect(() => {
    if (selectedCourseId && selectedGroupId) {
      const filtered = assignments.filter(
        (assignment) => 
          assignment.courseId === selectedCourseId && 
          assignment.groupId === selectedGroupId
      );
      setFilteredAssignments(filtered);
    } else {
      setFilteredAssignments([]);
    }
  }, [selectedCourseId, selectedGroupId, assignments]);

  // Get groups for selected course
  const getGroupsForCourse = () => {
    const course = courses.find(c => c.id === selectedCourseId);
    return course?.groups || [];
  };

  // Get course name by ID
  const getCourseName = () => {
    const course = courses.find(c => c.id === selectedCourseId);
    return course?.name || "";
  };

  // Get group name by ID
  const getGroupName = () => {
    const course = courses.find(c => c.id === selectedCourseId);
    const group = course?.groups?.find(g => g.groupId === selectedGroupId);
    return group?.groupName || "";
  };

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
    return filteredAssignments.filter(assignment => {
      return assignment.date === day && 
             assignment.startTime <= time && 
             assignment.endTime > time;
    });
  };

  const assignmentsByDay = groupByDay(filteredAssignments);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNav />
        <div className="flex-1 p-8 flex items-center justify-center">
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
      <SideNav />
      <div className="flex-1 p-8">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            Course Group Timetable Viewer
          </h1>
          <p className="text-gray-600">
            View class schedules for specific course groups
          </p>
        </div>

        {/* Course and Group Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Selection */}
            <div>
              <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <select
                id="course-select"
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedGroupId(""); // Reset group when course changes
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select a course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Group Selection */}
            <div>
              <label htmlFor="group-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Group
              </label>
              <select
                id="group-select"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                disabled={!selectedCourseId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">-- Select a group --</option>
                {getGroupsForCourse().map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Selected Course/Group Info */}
          {selectedCourseId && selectedGroupId && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{getCourseName()}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>{getGroupName()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        {selectedCourseId && selectedGroupId ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <ClockIcon className="w-5 h-5 text-green-600" />
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
                  <div className="bg-purple-100 p-2 rounded-full">
                    <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Modules</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {[...new Set(filteredAssignments.map(a => a.moduleName))].length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <UserGroupIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Instructors</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {[...new Set(filteredAssignments.map(a => a.instructorName))].length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable View */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Weekly Timetable for {getGroupName()}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 border bg-gray-50 text-left text-sm font-medium text-gray-500">Time</th>
                      {days.map(day => (
                        <th key={day} className="p-3 border bg-gray-50 text-center text-sm font-medium text-gray-500">
                          {day.substring(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time}>
                        <td className="p-3 border text-sm text-gray-600 font-medium">
                          {time}
                        </td>
                        {days.map(day => {
                          const slotClasses = getClassesForSlot(day, time);
                          
                          return (
                            <td key={`${day}-${time}`} className="p-1 border">
                              {slotClasses.map(assignment => (
                                <div 
                                  key={assignment.id}
                                  className="bg-blue-50 border border-blue-100 rounded p-2 mb-1 text-xs"
                                >
                                  <p className="font-medium text-blue-800 truncate">
                                    {assignment.moduleName}
                                  </p>
                                  <p className="text-blue-600 truncate">
                                    {assignment.instructorName}
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
                  {days.map(day => (
                    assignmentsByDay[day]?.length > 0 && (
                      <div key={day}>
                        <h3 className="font-medium text-gray-700 mb-2">{day}</h3>
                        <div className="space-y-2">
                          {assignmentsByDay[day]
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map(assignment => (
                              <div 
                                key={assignment.id}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {assignment.moduleName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Instructor: {assignment.instructorName}
                                    </p>
                                  </div>
                                  <div className="mt-2 md:mt-0">
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Time:</span> {assignment.startTime} - {assignment.endTime}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Location:</span> {assignment.location}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p>No classes scheduled for this group</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Select a course and group to view timetable
            </h3>
            <p className="text-gray-500">
              Choose a course and group from the dropdowns above to see the schedule
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseGroupTimetable;