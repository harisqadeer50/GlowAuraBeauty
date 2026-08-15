import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import { adminApi } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.getUsers().then((res) => setUsers(res.users)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "customer" : "admin";
    if (!window.confirm(`Change ${u.name}'s role to ${newRole}?`)) return;
    try {
      await adminApi.updateUser(u._id, { role: newRole });
      toast.success("Role updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleActive = async (u) => {
    try {
      await adminApi.updateUser(u._id, { isActive: !u.isActive });
      toast.success(u.isActive ? "User disabled" : "User enabled");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(u._id);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-6">Users</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream text-brown text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-beige">
                  <td className="px-5 py-3 font-medium text-charcoal">{u.name}</td>
                  <td className="px-5 py-3 text-brown">{u.email}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={u._id === currentUser?._id}
                      className={`text-xs px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-gold/20 text-gold-dark" : "bg-cream text-brown"} disabled:opacity-50`}
                    >
                      {u.role}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(u)}
                      disabled={u._id === currentUser?._id}
                      className={`text-xs px-2.5 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"} disabled:opacity-50`}
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={u._id === currentUser?._id}
                      className="p-2 text-brown/50 hover:text-red-500 disabled:opacity-30"
                      aria-label="Delete user"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
