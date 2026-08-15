import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";
import { categoryApi } from "../../api/productApi";
import { adminApi } from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const emptyForm = { name: "", group: "Salon Care", description: "", displayOrder: 0 };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [iconFile, setIconFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    categoryApi.getAll().then((res) => setCategories(res.categories)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, group: cat.group, description: cat.description || "", displayOrder: cat.displayOrder });
    setIconFile(null);
    setShowForm(true);
  };

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIconFile(null);
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (iconFile) fd.append("icon", iconFile);

    setSaving(true);
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, fd);
        toast.success("Category updated");
      } else {
        await adminApi.createCategory(fd);
        toast.success("Category created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-charcoal">Categories</h1>
        <button onClick={startNew} className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark">
          <FiPlus /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-card p-6 mb-6 space-y-4 max-w-lg">
          <h3 className="font-medium text-charcoal">{editingId ? "Edit Category" : "New Category"}</h3>
          <div>
            <label className="text-sm text-brown">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-brown">Group</label>
            <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold bg-white">
              <option value="Salon Care">Salon Care</option>
              <option value="Daily Care">Daily Care</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-brown">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <label className="flex items-center gap-2 border border-dashed border-beige rounded-lg px-4 py-3 text-sm text-brown cursor-pointer hover:border-gold w-fit">
            <FiUpload /> {iconFile ? iconFile.name : "Choose icon image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setIconFile(e.target.files[0])} />
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-beige text-brown px-6 py-2.5 rounded-full text-sm font-medium hover:bg-cream">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {["Salon Care", "Daily Care"].map((group) => (
            <div key={group} className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-medium text-charcoal mb-3">{group}</h3>
              <ul className="space-y-2">
                {categories.filter((c) => c.group === group).map((c) => (
                  <li key={c._id} className="flex items-center justify-between text-sm py-1.5 border-b border-beige last:border-0">
                    <span className="text-brown">{c.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(c)} className="p-1.5 hover:text-gold-dark"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(c._id, c.name)} className="p-1.5 text-brown/50 hover:text-red-500"><FiTrash2 size={14} /></button>
                    </div>
                  </li>
                ))}
                {categories.filter((c) => c.group === group).length === 0 && (
                  <p className="text-sm text-brown/50 py-2">No categories yet.</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
