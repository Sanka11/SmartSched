import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/api/users")  // Calls: http://localhost:8080/api/users
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
