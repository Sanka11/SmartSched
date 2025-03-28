import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userid}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
      } catch (err) {
        setError("User not found or unauthorized");
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading user profile...</p>;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p><strong>First Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Permissions:</strong> {user.permissions.join(", ")}</p>
      </div>
    </div>
  );
};

export default UserProfile;
