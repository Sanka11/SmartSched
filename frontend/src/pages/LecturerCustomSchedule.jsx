import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import DynamicSidebar from "../components/DynamicSidebar";
import { toast } from "react-toastify";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hours = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

const LecturerCustomSchedule = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const [academicSessions, setAcademicSessions] = useState([]);
  const [personalSlots, setPersonalSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [timetableTimestamp, setTimetableTimestamp] = useState(null);

  const getSlotId = (day, time) => `${day}_${time}`;

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/timetable/instructor/${email}`
      );
      setAcademicSessions(response.data.timetable || []);
      setTimetableTimestamp(response.data.generatedAt);

      const lastCheck = localStorage.getItem("lastCheckLecturerTimetable");
      if (lastCheck && lastCheck !== response.data.generatedAt) {
        setShowPrompt(true);
      }
      localStorage.setItem("lastCheckLecturerTimetable", response.data.generatedAt);
    } catch (err) {
      console.error("Failed to fetch academic timetable", err);
    }
  };

  const fetchPersonalSlots = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule/${email}`
      );
      const result = {};
      res.data.forEach((item) => {
        const key = getSlotId(item.day, item.time);
        result[key] = item;
      });
      setPersonalSlots(result);
    } catch (err) {
      console.error("Failed to fetch personal slots", err);
    }
  };

  const deleteAllPersonalTasks = async () => {
    const promises = Object.values(personalSlots).map((task) =>
      axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule/delete/${task.id}`)
    );
    await Promise.all(promises);
    await fetchPersonalSlots();
    toast.success("🗑 All personal tasks removed.");
  };

  const handlePromptChoice = async (choice) => {
    setShowPrompt(false);
    if (choice === "remove") {
      await deleteAllPersonalTasks();
    } else {
      const conflicts = Object.entries(personalSlots).filter(([slotId, task]) => {
        return academicSessions.some(
          (s) => s.day === task.day && s.start_time === task.time
        );
      });

      for (let [slotId, task] of conflicts) {
        const res = confirm(
          `Your task "${task.title}" at ${task.day} ${task.time} overlaps with a class. Remove it?`
        );
        if (res) {
          await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule/delete/${task.id}`
          );
        } else {
          const freeSlot = findFirstFreeSlot();
          if (freeSlot) {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule`, {
              ...task,
              day: freeSlot.day,
              time: freeSlot.time,
            });
          }
        }
      }
      await fetchPersonalSlots();
    }
  };

  const handleAddTask = (day, time) => {
    setSelectedSlot({ day, time });
    setModalOpen(true);
  };

  const saveSlot = async (slotId, data) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule`, {
        ...data,
      });
      await fetchPersonalSlots();
      toast.success("✅ Task saved");
    } catch (err) {
      console.error("Failed to save task", err);
      toast.error("❌ Failed to save task");
    }
  };

  const deleteSlot = async (slotId) => {
    const task = personalSlots[slotId];
    if (!task?.id) {
      toast.error("Cannot delete: Task ID not found.");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-schedule/delete/${task.id}`
      );
      await fetchPersonalSlots();
      toast.success("✅ Task deleted");
    } catch (err) {
      console.error("❌ Failed to delete task", err);
      toast.error("❌ Failed to delete task");
    }
  };

  const findFirstFreeSlot = () => {
    for (let d of days) {
      for (let t of hours) {
        const slotId = getSlotId(d, t);
        const occupied = academicSessions.find((s) => s.day === d && s.start_time === t) || personalSlots[slotId];
        if (!occupied) return { day: d, time: t };
      }
    }
    return null;
  };

  useEffect(() => {
    fetchTimetable();
    fetchPersonalSlots();
  }, []);

  const getSessionInSlot = (day, time) =>
    academicSessions.find((s) => s.day === day && s.start_time === time);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <DynamicSidebar user={user} />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            🛠 Lecturer Custom Schedule
          </h1>
        </div>

        {showPrompt && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
            <p className="text-gray-800 mb-3">
              Your academic timetable has changed. Do you want to keep your custom tasks?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handlePromptChoice("keep")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Keep
              </button>
              <button
                onClick={() => handlePromptChoice("remove")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove All
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[800px] md:w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="border-b border-gray-200 p-3 text-left text-sm font-medium text-gray-700 sticky left-0 bg-indigo-50 z-10">
                      Time
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border-b border-gray-200 p-3 text-left text-sm font-medium text-gray-700 min-w-[150px]"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hours.map((hour) => (
                    <tr key={hour} className="hover:bg-gray-50">
                      <td className="border-b border-gray-200 p-3 text-sm font-medium text-gray-700 sticky left-0 bg-white z-10">
                        {hour}
                      </td>
                      {days.map((day) => {
                        const slotId = getSlotId(day, hour);
                        const session = getSessionInSlot(day, hour);
                        const personal = personalSlots[slotId];

                        return (
                          <td
                            key={day + hour}
                            className="border-b border-gray-200 p-2 align-top"
                          >
                            {session ? (
                              <div className="bg-blue-50 text-blue-800 p-2 rounded-lg border border-blue-100 text-xs md:text-sm">
                                <div className="flex items-center gap-1 font-medium">
                                  <span>🎓</span>
                                  <span className="truncate">{session.module_name}</span>
                                </div>
                                <div className="mt-1 text-gray-600 truncate">{session.group_name}</div>
                                <div className="mt-1 flex items-center gap-1 text-gray-600">
                                  <span>🕒</span>
                                  <span>{session.start_time}–{session.end_time}</span>
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-gray-600 truncate">
                                  <span>🏫</span>
                                  <span>{session.location}</span>
                                </div>
                              </div>
                            ) : personal ? (
                              <div
                                className="p-2 rounded-lg border shadow-sm cursor-pointer text-xs md:text-sm"
                                style={{
                                  backgroundColor: `${personal.color}20`,
                                  borderColor: personal.color,
                                  color: personal.color,
                                }}
                                onClick={() => handleAddTask(day, hour)}
                              >
                                <div className="flex items-center gap-1 font-medium">
                                  <span>{personal.icon || "📌"}</span>
                                  <span className="truncate">{personal.title}</span>
                                </div>
                                {personal.description && (
                                  <div className="mt-1 truncate">{personal.description}</div>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddTask(day, hour)}
                                className="w-full h-full min-h-[80px] flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors border-2 border-dashed border-gray-200 rounded-lg hover:border-indigo-300"
                              >
                                <span className="text-xs md:text-sm">+ Add Task</span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          slot={selectedSlot}
          onSave={(data) => saveSlot(getSlotId(selectedSlot.day, selectedSlot.time), data)}
          onDelete={(slotId) => deleteSlot(slotId)}
          initialData={
            selectedSlot ? personalSlots[getSlotId(selectedSlot.day, selectedSlot.time)] : null
          }
        />
      </main>
    </div>
  );
};

export default LecturerCustomSchedule;
