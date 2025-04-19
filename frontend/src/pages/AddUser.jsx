import { useState, useEffect } from "react";
import axios from "axios";

const AddUser = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    role: "user",
    permissions: ["read"],
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const validate = () => {
    let tempErrors = {};
    if (!user.fullName) tempErrors.fullName = "Full Name is required";
    if (!user.email) tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) tempErrors.email = "Invalid email format";
    if (!user.contact) tempErrors.contact = "Contact is required";
    else if (!/^\d{10}$/.test(user.contact)) tempErrors.contact = "Contact must be a 10-digit number";
    if (!user.password) tempErrors.password = "Password is required";
    else if (user.password.length < 6) tempErrors.password = "Password must be at least 6 characters long";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:8080/api/users/add", user, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage({ text: "User added successfully!", type: "success" });
      setUser({
        fullName: "",
        email: "",
        contact: "",
        password: "",
        role: "user",
        permissions: ["read"],
      });
      setErrors({});
    } catch (error) {
      setMessage({ text: error.response?.data || "Error adding user", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center">
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Add New User
          </h2>
          <button onClick={toggleDarkMode} className={`mt-6 p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Fill in the details below to create a new user account
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`py-8 px-4 shadow sm:rounded-lg sm:px-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {message && (
            <div className={`mb-4 p-4 rounded-md ${message.type === "success" ? (darkMode ? "bg-green-900 text-green-100" : "bg-green-50 text-green-800") : (darkMode ? "bg-red-900 text-red-100" : "bg-red-50 text-red-800")}`}>
              {message.text}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {Object.keys(errors).map((key) => (
              <p key={key} className="text-red-500 text-sm">{errors[key]}</p>
            ))}
            <div>
              <label htmlFor="fullName" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
              <input id="fullName" name="fullName" type="text" value={user.fullName} onChange={handleChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
            </div>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input id="email" name="email" type="email" value={user.email} onChange={handleChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
            </div>
            <div>
              <label htmlFor="contact" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contact</label>
              <input id="contact" name="contact" type="text" value={user.contact} onChange={handleChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <input id="password" name="password" type="password" value={user.password} onChange={handleChange} className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">{isSubmitting ? "Processing..." : "Add User"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
