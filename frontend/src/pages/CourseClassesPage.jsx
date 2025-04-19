import { useState, useEffect } from "react";
import { AcademicCapIcon, TrashIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "./SideNav";

const CourseClassesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [groupDetails, setGroupDetails] = useState({});
  const [allAssignments, setAllAssignments] = useState([]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, instructorsRes, assignmentsRes, locationsRes] = await Promise.all([
          fetch("http://localhost:8080/api/allcourses"),
          fetch("http://localhost:8080/api/instructors"),
          fetch("http://localhost:8080/api/allClassAssignments"),
          fetch("http://localhost:8080/api/locations")
        ]);
        
        setCourses(await coursesRes.json());
        setInstructors(await instructorsRes.json());
        setAllAssignments(await assignmentsRes.json());
        const locationsData = await locationsRes.json();
        setLocations(locationsData.map(loc => loc.hallName));
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      const course = courses.find((c) => c.id === selectedCourseId);
      setSelectedCourse(course);
      if (course) {
        fetchExistingGroupDetails(course);
      }
    } else {
      setSelectedCourse(null);
    }
  }, [selectedCourseId, courses]);

  const fetchExistingGroupDetails = async (course) => {
    try {
      const response = await fetch(`http://localhost:8080/api/allClassAssignments?courseId=${course.id}`);
      const data = await response.json();

      const details = {};
      data.forEach((assignment) => {
        const key = `${assignment.groupId}-${assignment.moduleName}`;
        details[key] = {
          id: assignment.id,
          location: assignment.location,
          day: assignment.date,
          startTime: assignment.startTime,
          endTime: assignment.endTime,
        };
      });
      setGroupDetails(details);
    } catch (err) {
      console.error("Error fetching group details:", err);
      toast.error("Failed to fetch group details");
    }
  };

  const getAssignedInstructors = (moduleName, groupId) => {
    return instructors.filter(instructor => {
      return instructor.classes && instructor.classes[moduleName] === groupId;
    });
  };

  const handleGroupDetailsChange = (groupId, moduleName, field, value) => {
    setGroupDetails((prevDetails) => ({
      ...prevDetails,
      [`${groupId}-${moduleName}`]: {
        ...prevDetails[`${groupId}-${moduleName}`],
        [field]: value,
      },
    }));
  };

  const isLocationBooked = (location, day, startTime, endTime, excludeId = null) => {
    return allAssignments.some((assignment) => {
      if (assignment.id === excludeId) return false;
      return (
        assignment.location === location &&
        assignment.date === day &&
        ((startTime >= assignment.startTime && startTime < assignment.endTime) ||
          (endTime > assignment.startTime && endTime <= assignment.endTime) ||
          (startTime <= assignment.startTime && endTime >= assignment.endTime))
      );
    });
  };

  const isInstructorBooked = (instructorId, day, startTime, endTime, excludeId = null) => {
    return allAssignments.some((assignment) => {
      if (assignment.id === excludeId) return false;
      return (
        assignment.instructorId === instructorId &&
        assignment.date === day &&
        ((startTime >= assignment.startTime && startTime < assignment.endTime) ||
          (endTime > assignment.startTime && endTime <= assignment.endTime) ||
          (startTime <= assignment.startTime && endTime >= assignment.endTime))
      );
    });
  };

  const saveGroupDetails = async (groupId, moduleName) => {
    const details = groupDetails[`${groupId}-${moduleName}`];
    if (!details?.location || !details?.day || !details?.startTime || !details?.endTime) {
      toast.warning("Please fill in all fields for the group and module.");
      return;
    }

    if (details.startTime >= details.endTime) {
      toast.error("Invalid Time: End time must be after start time.");
      return;
    }

    const course = courses.find((c) => c.groups?.some((g) => g.groupId === groupId));
    const group = course?.groups?.find((g) => g.groupId === groupId);
    const module = course?.modules?.find((m) => m.title === moduleName);
    const assignedInstructors = getAssignedInstructors(moduleName, groupId);

    if (!course || !group || !module || assignedInstructors.length === 0) {
      toast.error("Invalid data. Please check the course, group, module, or instructor assignments.");
      return;
    }

    if (isLocationBooked(details.location, details.day, details.startTime, details.endTime, details.id)) {
      toast.error("This location is already booked during the selected time period.");
      return;
    }

    for (const instructor of assignedInstructors) {
      if (isInstructorBooked(instructor.id, details.day, details.startTime, details.endTime, details.id)) {
        toast.error(`Instructor ${instructor.firstName} ${instructor.lastName} is already booked during the selected time period.`);
        return;
      }
    }

    try {
      if (details.id) {
        await fetch(`http://localhost:8080/api/allClassAssignments/${details.id}`, {
          method: "DELETE",
        });
      }

      const savePromises = assignedInstructors.map(async (instructor) => {
        const data = {
          courseId: course.id,
          courseName: course.name,
          groupId: group.groupId,
          groupName: group.groupName,
          moduleId: module.moduleId,
          moduleName: module.title,
          instructorId: instructor.id,
          instructorName: `${instructor.firstName} ${instructor.lastName}`,
          location: details.location,
          date: details.day,
          startTime: details.startTime,
          endTime: details.endTime,
        };

        const response = await fetch("http://localhost:8080/api/allClassAssignments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Failed to save data for instructor ${instructor.id}`);
        return response.json();
      });

      await Promise.all(savePromises);
      toast.success(`Details ${details.id ? "updated" : "saved"} for Group ID: ${groupId}, Module: ${moduleName}`);

      fetchExistingGroupDetails(course);
      const assignmentsResponse = await fetch("http://localhost:8080/api/allClassAssignments");
      setAllAssignments(await assignmentsResponse.json());
    } catch (err) {
      console.error("Error saving/updating data:", err);
      toast.error("Failed to save/update data for one or more instructors");
    }
  };

  const deleteGroupDetails = async (groupId, moduleName) => {
    const details = groupDetails[`${groupId}-${moduleName}`];
    if (!details?.id) {
      toast.warning("No assignment exists to delete.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/allClassAssignments/${details.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete assignment");

      toast.success(`Deleted assignment for Group ID: ${groupId}, Module: ${moduleName}`);
      
      if (selectedCourse) fetchExistingGroupDetails(selectedCourse);
      
      const assignmentsResponse = await fetch("http://localhost:8080/api/allClassAssignments");
      setAllAssignments(await assignmentsResponse.json());
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast.error("Failed to delete assignment");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <SideNav 
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
          toggleMobileSidebar={setMobileSidebarOpen}
        />
        <div className={`flex-1 flex items-center justify-center ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SideNav 
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        mobileSidebarOpen={mobileSidebarOpen}
        toggleMobileSidebar={setMobileSidebarOpen}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <div className="p-4 lg:p-8 w-full">
          <ToastContainer position="top-right" autoClose={3000} />
          
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
            <h1 className="text-2xl font-bold text-gray-800">
              Resource and Class Time Management
            </h1>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="hidden lg:block mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Resource and Class Time Management
              </h1>
              <p className="text-gray-600 text-lg">
                View all courses, groups, modules, and assigned instructors
              </p>
            </div>

            <div className="mb-8">
              <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                id="course-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <AcademicCapIcon className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
                </div>

                <div className="space-y-4">
                  {selectedCourse.groups?.map((group) => (
                    <div key={group.groupId} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-gray-700 font-medium">{group.groupName}</p>
                          <p className="text-sm text-gray-500">Group ID: {group.groupId}</p>
                        </div>
                      </div>

                      <div className="ml-8">
                        {selectedCourse.modules?.map((module) => {
                          const key = `${group.groupId}-${module.title}`;
                          const details = groupDetails[key] || {};
                          const hasAssignment = !!details.id;
                          const assignedInstructors = getAssignedInstructors(module.title, group.groupId);

                          return (
                            <div key={module.moduleId} className="p-3 bg-white rounded-lg shadow-sm mb-2">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="text-gray-700 font-medium">{module.title}</p>
                                  <div className="text-sm text-gray-500">
                                    <p>Assigned Instructors:</p>
                                    <ul className="list-disc list-inside">
                                      {assignedInstructors.length > 0 ? (
                                        assignedInstructors.map(instructor => (
                                          <li key={instructor.id}>
                                            {instructor.firstName} {instructor.lastName}
                                          </li>
                                        ))
                                      ) : (
                                        <li>No instructors assigned</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                                {hasAssignment && (
                                  <button
                                    onClick={() => deleteGroupDetails(group.groupId, module.title)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                    title="Delete assignment"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select
                                  value={details.location || ""}
                                  onChange={(e) =>
                                    handleGroupDetailsChange(group.groupId, module.title, "location", e.target.value)
                                  }
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                  required
                                >
                                  <option value="">Select Location</option>
                                  {locations.map((location) => (
                                    <option key={location} value={location}>
                                      {location}
                                    </option>
                                  ))}
                                </select>

                                <select
                                  value={details.day || ""}
                                  onChange={(e) =>
                                    handleGroupDetailsChange(group.groupId, module.title, "day", e.target.value)
                                  }
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                  required
                                >
                                  <option value="">Select Day</option>
                                  {days.map((day) => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  ))}
                                </select>

                                <input
                                  type="time"
                                  value={details.startTime || ""}
                                  onChange={(e) =>
                                    handleGroupDetailsChange(group.groupId, module.title, "startTime", e.target.value)
                                  }
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                  required
                                />

                                <input
                                  type="time"
                                  value={details.endTime || ""}
                                  onChange={(e) =>
                                    handleGroupDetailsChange(group.groupId, module.title, "endTime", e.target.value)
                                  }
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                  required
                                />
                              </div>

                              <div className="mt-3 flex justify-between items-center">
                                <button
                                  onClick={() => saveGroupDetails(group.groupId, module.title)}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                                  disabled={assignedInstructors.length === 0}
                                >
                                  {details.id ? "Update Details" : "Save Details"}
                                </button>
                                {assignedInstructors.length === 0 && (
                                  <span className="text-sm text-red-500">No instructors assigned to this module</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseClassesPage;