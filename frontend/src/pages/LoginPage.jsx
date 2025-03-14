import React from "react";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold text-blue-600">Login to SmartSched</h1>
      <p className="mt-2 text-gray-700">Enter your credentials to continue.</p>
      <form className="mt-6">
        <input type="email" placeholder="Email" className="border p-2 rounded-md mb-2 w-full" />
        <input type="password" placeholder="Password" className="border p-2 rounded-md mb-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
