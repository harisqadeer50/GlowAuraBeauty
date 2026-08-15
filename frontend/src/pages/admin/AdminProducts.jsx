import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { productApi } from "../../api/productApi";
import { adminApi } from "../../api/adminApi";
import { formatPKR } from "../../components/common/PriceTag";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ProductImage from "../../components/common/ProductImage";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const load = () => {
    setLoading(true);
    productApi
      .getAll({ keyword, limit: 50 })
      .then((res) => setProducts(res.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-charcoal">Products</h1>
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark">
          <FiPlus /> Add Product
        </Link>
      </div>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="w-full max-w-sm mb-6 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold bg-white"
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream text-brown text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-beige">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-cream-dark" />
                      <span className="font-medium text-charcoal">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-brown">{p.category?.name}</td>
                  <td className="px-5 py-3 text-charcoal">PKR {formatPKR(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={p.stock <= 10 ? "text-red-500 font-medium" : "text-brown"}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/${p._id}/edit`} className="p-2 hover:text-gold-dark" aria-label="Edit">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="p-2 text-brown/50 hover:text-red-500" aria-label="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-brown/60 py-8">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
