import { useEffect, useState } from "react";
import api from "../../../services/api";
import { toast } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import DynamicSidebar from "../../../components/DynamicSidebar";

export default function GenerateTimetable() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("student");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [bulkType, setBulkType] = useState("");
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);

        const allGroupNames = [
          ...new Set(response.data.map((u) => u.groupName).filter(Boolean)),
        ];
        setGroupNames(allGroupNames);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (bulkType === "all-students") {
      setSelectedEmails(
        users.filter((u) => u.role === "student").map((u) => u.email)
      );
      setSelectedRole("student");
    } else if (bulkType === "all-lecturers") {
      setSelectedEmails(
        users.filter((u) => u.role === "lecturer").map((u) => u.email)
      );
      setSelectedRole("lecturer");
    } else if (bulkType === "all") {
      setSelectedEmails(users.map((u) => u.email));
      setSelectedRole("");
    } else {
      setSelectedEmails([]);
    }
  }, [bulkType, users]);

  const handleSelectChange = (e) => {
    setSelectedEmails(Array.from(e.target.selectedOptions, (opt) => opt.value));
  };

  const handleGenerate = async () => {
    if (selectedEmails.length === 0)
      return toast.error("Please select at least one user.");
    try {
      setLoading(true);
      const res = await api.post(
        "/api/schedule/generate/bulk",
        {
          emails: selectedEmails,
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Timetables generated successfully!");
      console.log("✅ Response:", res.data);
    } catch (err) {
      console.error("❌ Bulk generation error:", err);
      toast.error(err.response?.data?.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckConflicts = async () => {
    if (selectedEmails.length === 0)
      return toast.error("Select users to check conflicts.");
    try {
      setLoading(true);
      const res = await api.post(
        "/api/schedule/conflicts",
        {
          emails: selectedEmails,
          role: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setConflicts(res.data.conflicts || []);
      if (!res.data.conflicts || res.data.conflicts.length === 0) {
        toast.success("✅ No conflicts found.");
      }
    } catch (err) {
      console.error("Conflict check error:", err);
      toast.error("Failed to fetch conflict report.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) => user.role === selectedRole || bulkType === "all"
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Generate Timetables (Bulk Options)
          </h1>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">
              Bulk Type
            </label>
            <select
              value={bulkType}
              onChange={(e) => setBulkType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700"
            >
              <option value="">-- No Bulk Selection --</option>
              <option value="all-students">All Students</option>
              <option value="all-lecturers">All Lecturers</option>
              <option value="all">All Users</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">
              Select Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => {
                const group = e.target.value;
                setSelectedGroup(group);
                setBulkType(""); // Reset bulk type
                if (group) {
                  const emails = users
                    .filter((u) => u.groupName === group)
                    .map((u) => u.email);
                  setSelectedEmails(emails);
                  setSelectedRole("student"); // assuming group is for students
                } else {
                  setSelectedEmails([]);
                }
              }}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700"
            >
              <option value="">-- Select Group --</option>
              {groupNames.map((group, idx) => (
                <option key={idx} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">
              Manual Role Filter
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setBulkType("");
              }}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-1">
              Select Users (Multi-select)
            </label>
            <select
              multiple
              value={selectedEmails}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-700 h-40"
            >
              {filteredUsers.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCheckConflicts}
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
            >
              {loading ? "Checking..." : "Preview Conflicts"}
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-[#2c7a7b] text-white px-6 py-2 rounded hover:bg-[#256c6c] transition"
            >
              {loading ? (
                <span className="flex items-center">
                  <TailSpin height={20} width={20} color="#fff" />
                  <span className="ml-2">Generating...</span>
                </span>
              ) : (
                "Generate Timetable(s)"
              )}
            </button>
          </div>

          {conflicts.length > 0 && (
            <div className="mt-8 bg-red-50 p-4 rounded-md border border-red-200">
              <h2 className="text-lg font-semibold text-red-700 mb-3">
                Detected Conflicts
              </h2>
              <ul className="list-disc list-inside text-sm text-red-600">
                {conflicts.map((c) => (
                  <li key={`${c.userEmail}-${c.issue}`}>
                    {c.userEmail} → {c.issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
