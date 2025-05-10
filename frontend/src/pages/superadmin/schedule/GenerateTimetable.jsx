import { useEffect, useState, useMemo } from "react";
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
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter(
    (user) => user.role === selectedRole || bulkType === "all"
  );

  const searchedUsers = useMemo(() => {
    if (!searchTerm) return filteredUsers;
    const term = searchTerm.toLowerCase();
    return filteredUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.groupName && user.groupName.toLowerCase().includes(term))
    );
  }, [filteredUsers, searchTerm]);

  const handleSelectChange = (e) => {
    setSelectedEmails(Array.from(e.target.selectedOptions, (opt) => opt.value));
  };

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress >= 90) {
        currentProgress = 90; // Hold at 90% until actual completion
      }
      setProgress(currentProgress);
      setProgressMessage(
        `Processing ${Math.floor(
          (currentProgress / 90) * selectedEmails.length
        )} of ${selectedEmails.length} timetables...`
      );
    }, 800);
    return interval;
  };

  const handleGenerate = async () => {
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);
      setProgressMessage("Initializing generation...");
      const progressInterval = simulateProgress();

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

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage("Finalizing timetables...");

      setTimeout(() => {
        toast.success("✅ All timetables generated!");
        setLoading(false);
        setProgress(0);
        setProgressMessage("");
      }, 500);

      console.log("✅ Response:", res.data);
    } catch (err) {
      console.error("❌ Bulk generation error:", err);
      toast.error(err.response?.data?.message || "❌ Generation failed.");
      setLoading(false);
      setProgress(0);
      setProgressMessage("");
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

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Generate Timetables
            </h1>
            <p className="text-gray-600">
              Create optimized schedules for multiple users at once
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Bulk Selection Card */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 mb-3">
                Bulk Options
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quick Selection
                  </label>
                  <select
                    value={bulkType}
                    onChange={(e) => setBulkType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select bulk option --</option>
                    <option value="all-students">All Students</option>
                    <option value="all-lecturers">All Lecturers</option>
                    <option value="all">All Users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setBulkType("");
                    }}
                    className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="student">Students</option>
                    <option value="lecturer">Lecturers</option>
                  </select>
                </div>
              </div>
            </div>

            {/* User Selection Card with Search */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                User Selection
              </h2>
              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email, or group..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedEmails.length} user(s) selected
                </label>
                <select
                  multiple
                  value={selectedEmails}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border rounded-md bg-white text-gray-700 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {searchedUsers.length > 0 ? (
                    searchedUsers.map((user) => (
                      <option
                        key={user._id}
                        value={user.email}
                        className="text-gray-700 hover:bg-blue-50"
                      >
                        {user.fullName} ({user.email})
                        {user.groupName && ` - ${user.groupName}`}
                      </option>
                    ))
                  ) : (
                    <option disabled className="text-gray-500">
                      No users found matching "{searchTerm}"
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          {loading && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between text-sm font-medium text-blue-800 mb-2">
                <span>{progressMessage}</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Please wait while we generate your timetables...
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={handleCheckConflicts}
              disabled={loading}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {loading ? "Checking..." : "Preview Conflicts"}
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md ${
                loading
                  ? "bg-[#1a5f5f] cursor-wait"
                  : "bg-[#2c7a7b] hover:bg-[#256c6c]"
              } text-white`}
            >
              {loading ? (
                <>
                  <TailSpin height={20} width={20} color="#fff" />
                  <span className="flex items-center">
                    Generating
                    <span className="loading-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Generate Timetable(s)</span>
                </>
              )}
            </button>
          </div>

          {/* Conflicts Section */}
          {conflicts.length > 0 && (
            <div className="mt-8 bg-red-50 p-6 rounded-xl border border-red-200">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-700">
                  Detected Conflicts
                </h2>
              </div>
              <div className="bg-white p-4 rounded-lg border border-red-100">
                <ul className="divide-y divide-red-100">
                  {conflicts.map((c) => (
                    <li key={`${c.userEmail}-${c.issue}`} className="py-3">
                      <div className="font-medium text-red-700">
                        {c.userEmail}
                      </div>
                      <div className="text-sm text-red-600 mt-1">{c.issue}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500 border-t pt-4">
            <p>
              💡 Tip: Use bulk options for quick selection, or manually select
              specific users from the list.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .loading-dots span {
          animation: blink 1.4s infinite both;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
