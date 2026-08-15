import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import { productApi, categoryApi } from "../../api/productApi";
import { adminApi } from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const emptyForm = {
  name: "",
  category: "",
  tagline: "",
  description: "",
  howToUse: "",
  ingredients: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  sku: "",
  badge: "",
  isFeatured: false,
  isActive: true,
  concerns: [],
  skinType: [],
};

const CONCERN_OPTIONS = ["Acne", "Dark Spots", "Anti-Aging", "Brightening", "Hydration"];
const SKIN_TYPE_OPTIONS = ["All", "Dry", "Oily", "Sensitive", "Combination"];

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    // There's no admin "get by id" product route in this scaffold, so reuse
    // the public products list to locate the product for editing.
    productApi.getAll({ limit: 200 }).then((res) => {
      const product = res.products.find((p) => p._id === id);
      if (product) {
        setForm({
          name: product.name,
          category: product.category?._id || "",
          tagline: product.tagline || "",
          description: product.description,
          howToUse: product.howToUse || "",
          ingredients: product.ingredients || "",
          price: product.price,
          compareAtPrice: product.compareAtPrice || "",
          stock: product.stock,
          sku: product.sku || "",
          badge: product.badge || "",
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          concerns: product.concerns || [],
          skinType: product.skinType || [],
        });
        setExistingImages(product.images || []);
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const toggleMulti = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && imageFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) fd.append(key, JSON.stringify(value));
      else fd.append(key, value);
    });
    imageFiles.forEach((file) => fd.append("images", file));

    setSaving(true);
    try {
      if (isEdit) {
        await adminApi.updateProduct(id, fd);
        toast.success("Product updated");
      } else {
        await adminApi.createProduct(fd);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-charcoal mb-6">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-brown">Product Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-brown">Category</label>
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold bg-white">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.group} — {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-brown">Tagline</label>
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. Brightening & Anti-Aging" className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
        </div>

        <div>
          <label className="text-sm text-brown">Description</label>
          <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-brown">How to Use</label>
            <textarea rows={2} value={form.howToUse} onChange={(e) => setForm({ ...form, howToUse: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-brown">Ingredients</label>
            <textarea rows={2} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-brown">Price (PKR)</label>
            <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-brown">Compare-at Price</label>
            <input type="number" min="0" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-brown">Stock</label>
            <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="text-sm text-brown">SKU</label>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
          </div>
        </div>

        <div>
          <label className="text-sm text-brown">Badge</label>
          <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold bg-white sm:w-56">
            <option value="">None</option>
            <option value="BEST SELLER">Best Seller</option>
            <option value="SALE">Sale</option>
            <option value="NEW">New</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-brown mb-2 block">Concerns</label>
          <div className="flex flex-wrap gap-2">
            {CONCERN_OPTIONS.map((c) => (
              <button type="button" key={c} onClick={() => toggleMulti("concerns", c)} className={`text-xs px-3 py-1.5 rounded-full border ${form.concerns.includes(c) ? "bg-gold text-white border-gold" : "border-beige text-brown"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-brown mb-2 block">Skin Type</label>
          <div className="flex flex-wrap gap-2">
            {SKIN_TYPE_OPTIONS.map((s) => (
              <button type="button" key={s} onClick={() => toggleMulti("skinType", s)} className={`text-xs px-3 py-1.5 rounded-full border ${form.skinType.includes(s) ? "bg-gold text-white border-gold" : "border-beige text-brown"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-brown mb-2 block">Product Images {isEdit && "(uploading new ones replaces all existing images)"}</label>
          {existingImages.length > 0 && imageFiles.length === 0 && (
            <div className="flex gap-2 mb-3">
              {existingImages.map((img, i) => (
                <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover bg-cream-dark" />
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 border border-dashed border-beige rounded-lg px-4 py-3 text-sm text-brown cursor-pointer hover:border-gold w-fit">
            <FiUpload /> {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : "Choose images"}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              className="hidden"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
            />
          </label>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-brown">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            Featured / Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm text-brown">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active (visible in store)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark disabled:opacity-50">
            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} className="border border-beige text-brown px-6 py-2.5 rounded-full text-sm font-medium hover:bg-cream">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
