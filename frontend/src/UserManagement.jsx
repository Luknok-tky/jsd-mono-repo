import { useState, useEffect } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  // 1. Fetch Users (Read)
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/v2/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Add User (Create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3001/api/v2/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // 3. Delete User (Delete)
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/v2/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management (Supabase)</h1>

      {/* Form Create */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 font-medium">
          Add
        </button>
      </form>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Username</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user._id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-500">{user.id || user._id || "-"}</td>
                <td className="p-3 text-sm font-medium text-gray-800">{user.username}</td>
                <td className="p-3 text-sm text-gray-600">{user.email}</td>
                <td className="p-3 text-sm text-right">
                  <button
                    onClick={() => handleDelete(user.id || user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}