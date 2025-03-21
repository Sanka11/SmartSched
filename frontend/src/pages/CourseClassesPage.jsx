import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, AcademicCapIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "./SideNav";

const CourseClassesPage = () => {
  // State variables
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(""); // Selected course ID
  const [selectedCourse, setSelectedCourse] = useState(null); // Selected course details
  const [groupDetails, setGroupDetails] = useState({}); // State for group details
  const [allAssignments, setAllAssignments] = useState([]); // All existing assignments

  // Sample locations for the dropdown
  const locations = [
    "Room 101",
    "Room 202",
    "Room 303",
    "Online (Zoom)",
    "Lab A",
    "Lab B",
  ];

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch courses, instructors, and all assignments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesResponse = await fetch("http://localhost:8080/api/allcourses");
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        // Fetch instructors
        const instructorsResponse = await fetch("http://localhost:8080/api/instructors");
        const instructorsData = await instructorsResponse.json();
        setInstructors(instructorsData);

        // Fetch all assignments
        const assignmentsResponse = await fetch("http://localhost:8080/api/allClassAssignments");
        const assignmentsData = await assignmentsResponse.json();
        setAllAssignments(assignmentsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update selected course when selectedCourseId changes
  useEffect(() => {
    if (selectedCourseId) {
      const course = courses.find((c) => c.id === selectedCourseId);
      setSelectedCourse(course);
      fetchExistingGroupDetails(course); // Fetch existing group details for the selected course
    } else {
      setSelectedCourse(null);
    }
  }, [selectedCourseId, courses]);

  // Fetch existing group details for the selected course
  const fetchExistingGroupDetails = async (course) => {
    try {
      const response = await fetch(`http://localhost:8080/api/allClassAssignments?courseId=${course.id}`);
      const data = await response.json();

      // Populate groupDetails state with fetched data
      const details = {};
      data.forEach((assignment) => {
        const key = `${assignment.groupId}-${assignment.moduleName}`;
        details[key] = {
          id: assignment.id, // Include the assignment ID for updates
          location: assignment.location,
          day: assignment.date, // Store day in the date field
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

  // Get assigned instructor for a module and group
  const getAssignedInstructor = (moduleName, groupId) => {
    const instructor = instructors.find((instructor) =>
      instructor.classes?.[moduleName] === groupId
    );
    return instructor ? instructor : null;
  };

  // Handle location, day, start time, and end time changes
  const handleGroupDetailsChange = (groupId, moduleName, field, value) => {
    setGroupDetails((prevDetails) => ({
      ...prevDetails,
      [`${groupId}-${moduleName}`]: {
        ...prevDetails[`${groupId}-${moduleName}`],
        [field]: value,
      },
    }));
  };

  // Check if a location is already booked during the same time period
  const isLocationBooked = (location, day, startTime, endTime, excludeId = null) => {
    return allAssignments.some((assignment) => {
      if (assignment.id === excludeId) return false; // Exclude the current assignment during update
      return (
        assignment.location === location &&
        assignment.date === day &&
        ((startTime >= assignment.startTime && startTime < assignment.endTime) ||
          (endTime > assignment.startTime && endTime <= assignment.endTime) ||
          (startTime <= assignment.startTime && endTime >= assignment.endTime))
      );
    });
  };

  // Check if an instructor is already booked during the same time period
  const isInstructorBooked = (instructorId, day, startTime, endTime, excludeId = null) => {
    return allAssignments.some((assignment) => {
      if (assignment.id === excludeId) return false; // Exclude the current assignment during update
      return (
        assignment.instructorId === instructorId &&
        assignment.date === day &&
        ((startTime >= assignment.startTime && startTime < assignment.endTime) ||
          (endTime > assignment.startTime && endTime <= assignment.endTime) ||
          (startTime <= assignment.startTime && endTime >= assignment.endTime))
      );
    });
  };

  // Save or update group details (location, day, start time, end time)
  const saveGroupDetails = async (groupId, moduleName) => {
    const details = groupDetails[`${groupId}-${moduleName}`];
    if (!details?.location || !details?.day || !details?.startTime || !details?.endTime) {
      toast.warning("Please fill in all fields for the group and module.");
      return;
    }

    // Validate time
    if (details.startTime >= details.endTime) {
      toast.error("Invalid Time: End time must be after start time.");
      return;
    }

    // Find the course, group, and module
    const course = courses.find((c) => c.groups?.some((g) => g.groupId === groupId));
    const group = course?.groups?.find((g) => g.groupId === groupId);
    const module = course?.modules?.find((m) => m.title === moduleName);

    // Find the assigned instructor
    const instructor = getAssignedInstructor(moduleName, groupId);

    if (!course || !group || !module || !instructor) {
      toast.error("Invalid data. Please check the course, group, module, or instructor.");
      return;
    }

    // Check for location conflict
    if (isLocationBooked(details.location, details.day, details.startTime, details.endTime, details.id)) {
      toast.error("This location is already booked during the selected time period.");
      return;
    }

    // Check for instructor conflict
    if (isInstructorBooked(instructor.id, details.day, details.startTime, details.endTime, details.id)) {
      toast.error("This instructor is already booked during the selected time period.");
      return;
    }

    // Prepare the data to send to the backend
    const data = {
      id: details.id, // Include the assignment ID for updates
      courseId: course.id,
      courseName: course.name,
      groupId: group.groupId,
      groupName: group.groupName,
      moduleId: module.moduleId,
      moduleName: module.title,
      instructorId: instructor.id,
      instructorName: `${instructor.firstName} ${instructor.lastName}`,
      location: details.location,
      date: details.day, // Store day in the date field
      startTime: details.startTime,
      endTime: details.endTime,
    };

    try {
      // Determine if this is an update or a new entry
      const method = details.id ? "PUT" : "POST";
      const url = details.id
        ? `http://localhost:8080/api/allClassAssignments/${details.id}`
        : "http://localhost:8080/api/allClassAssignments";

      // Send the data to the backend
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      const result = await response.json();
      console.log("Data saved/updated successfully:", result);
      toast.success(`Details ${details.id ? "updated" : "saved"} for Group ID: ${groupId}, Module: ${moduleName}`);

      // Refresh the group details after saving/updating
      fetchExistingGroupDetails(course);
    } catch (err) {
      console.error("Error saving/updating data:", err);
      toast.error("Failed to save/update data");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ">
      <SideNav />
      <div className="p-8 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Resource and Class Time Management
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            View all courses, groups, modules, and assigned instructors and assign rosource and class time for each module.
          </p>
        </div>

        {/* Course Selection Dropdown */}
        <div className="mb-8">
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            id="course-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display Selected Course Details */}
        {selectedCourse && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <AcademicCapIcon className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.name}</h2>
            </div>

            {/* Groups List */}
            <div className="space-y-4">
              {selectedCourse.groups?.map((group) => (
                <div key={group.groupId} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-gray-700 font-medium">{group.groupName}</p>
                      <p className="text-sm text-gray-500">Group ID: {group.groupId}</p>
                    </div>
                  </div>

                  {/* Modules List */}
                  <div className="ml-8">
                    {selectedCourse.modules?.map((module) => {
                      const key = `${group.groupId}-${module.title}`;
                      const details = groupDetails[key] || {};

                      return (
                        <div key={module.moduleId} className="p-3 bg-white rounded-lg shadow-sm mb-2">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-gray-700 font-medium">{module.title}</p>
                              <p className="text-sm text-gray-500">
                                Instructor:{" "}
                                {getAssignedInstructor(module.title, group.groupId)
                                  ? `${getAssignedInstructor(module.title, group.groupId).firstName} ${getAssignedInstructor(module.title, group.groupId).lastName}`
                                  : "Not Assigned"}
                              </p>
                            </div>
                          </div>

                          {/* Location, Day, Start Time, and End Time Inputs */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Location Dropdown */}
                            <select
                              value={details.location || ""}
                              onChange={(e) =>
                                handleGroupDetailsChange(group.groupId, module.title, "location", e.target.value)
                              }
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              required
                            >
                              <option value="">Select Location</option>
                              {locations.map((location) => (
                                <option key={location} value={location}>
                                  {location}
                                </option>
                              ))}
                            </select>

                            {/* Day Dropdown */}
                            <select
                              value={details.day || ""}
                              onChange={(e) =>
                                handleGroupDetailsChange(group.groupId, module.title, "day", e.target.value)
                              }
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              required
                            >
                              <option value="">Select Day</option>
                              {days.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>

                            {/* Start Time Input */}
                            <input
                              type="time"
                              value={details.startTime || ""}
                              onChange={(e) =>
                                handleGroupDetailsChange(group.groupId, module.title, "startTime", e.target.value)
                              }
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              required
                            />

                            {/* End Time Input */}
                            <input
                              type="time"
                              value={details.endTime || ""}
                              onChange={(e) =>
                                handleGroupDetailsChange(group.groupId, module.title, "endTime", e.target.value)
                              }
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              required
                            />
                          </div>

                          {/* Save Button */}
                          <div className="mt-3">
                            <button
                              onClick={() => saveGroupDetails(group.groupId, module.title)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                            >
                              {details.id ? "Update Details" : "Save Details"}
                            </button>
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

  );
};

export default CourseClassesPage;