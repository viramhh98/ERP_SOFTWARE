import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  Box,
  Search,
  RefreshCcw,
  Filter,
  AlertTriangle,
  ArrowUpRight,
  Package,
  TrendingDown,
  Warehouse,
  ChevronRight,
  BarChart2,
  MoreVertical,
  Plus,
  X,
  Save,
} from "lucide-react";

const Inventory = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- ADD ITEM MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    barcode: "",
    unit: "pcs",
    costPrice: 0,
    sellingPrice: 0,
    isActive: true,
    maintainStock: true,
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem("activeCompanyId"),
          activebranchid: localStorage.getItem("activeBranchId"),
        },
      };
      const res = await api.get("/stock", config);
      console.log("Inventory fetched:", res.data); // Debug log
      setStock(res.data.data || []);
    } catch (err) {
      toast.error("Cloud Inventory Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // --- FORM HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem("activeCompanyId"),
          activebranchid: localStorage.getItem("activeBranchId"),
        },
      };

      const payload = {
        ...formData,
        sku: formData.sku.toUpperCase(),
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
      };

      // Ensure your backend endpoint matches this. Sometimes it's "/items" or "/item"
      await api.post("/item", payload, config);

      toast.success("Item Added to Catalog!");
      setIsModalOpen(false);
      setFormData({
        name: "",
        sku: "",
        category: "",
        brand: "",
        barcode: "",
        unit: "pcs",
        costPrice: 0,
        sellingPrice: 0,
        isActive: true,
        maintainStock: true,
      });

      // Refresh the table
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create item");
    } finally {
      setSubmitting(false);
    }
  };

  // --- SUMMARY CALCULATIONS ---
  const totalStockValue = stock.reduce(
    (acc, curr) => acc + curr.quantity * (curr.itemId?.costPrice || 0),
    0
  );
  const lowStockCount = stock.filter((s) => s.quantity < 5).length;
  const totalItems = stock.length;

  const filteredStock = stock.filter((s) => {
    const search = searchTerm.toLowerCase();

    return (
      (s.itemId?.name || "").toLowerCase().includes(search) ||
      (s.itemId?.sku || "").toLowerCase().includes(search) ||
      (s.itemId?.category || "").toLowerCase().includes(search) ||
      (s.itemId?.brand || "").toLowerCase().includes(search) ||
      (s.itemId?.barcode || "").toLowerCase().includes(search)
    );
  });
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700 relative">
        {/* --- 1. HEADER & SEARCH --- */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
              Warehouse <ChevronRight size={12} /> Live Inventory
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Stock Management
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search
                className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search SKU or Item..."
                className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchInventory}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm h-12 w-12 flex items-center justify-center"
            >
              <RefreshCcw
                size={18}
                className={
                  loading ? "animate-spin text-indigo-500" : "text-slate-500"
                }
              />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-12 px-6 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* --- 2. SUMMARY BENTO CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-all">
                <Warehouse size={100} />
              </div>
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
                Total Warehouse Value
              </p>
              <h2 className="text-5xl font-black tracking-tighter mb-4 flex items-baseline gap-1">
                <span className="text-indigo-500 text-2xl font-light">₹</span>
                {totalStockValue.toLocaleString()}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Live Valuation
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                  Total Unique SKUs
                </p>
                <h3 className="text-3xl font-black text-slate-800">
                  {totalItems}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 italic font-bold">
                  In this branch
                </p>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl">
                <Box size={28} />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-1">
                  Critical Alerts
                </p>
                <h3 className="text-3xl font-black text-rose-600">
                  {lowStockCount} Items
                </h3>
                <p className="text-[10px] text-rose-400 mt-1 font-bold">
                  Needs Re-order
                </p>
              </div>
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl">
                <AlertTriangle size={28} />
              </div>
            </div>
          </div>

          {/* --- 3. STOCK TABLE --- */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart2 size={16} className="text-indigo-500" /> Current
                Inventory Status
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
                    <th className="px-8 py-5">Product Details</th>
                    <th className="px-8 py-5 text-center">Unit</th>
                    <th className="px-8 py-5 text-center">On Hand</th>
                    <th className="px-8 py-5 text-right">Avg. Cost</th>
                    <th className="px-8 py-5 text-right">Selling Price</th>
                    <th className="px-8 py-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-24 text-center font-black text-slate-300 animate-pulse uppercase tracking-widest"
                      >
                        Scanning Warehouse...
                      </td>
                    </tr>
                  ) : filteredStock.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-24 text-center font-bold text-slate-400 italic text-sm"
                      >
                        No items found in inventory.
                      </td>
                    </tr>
                  ) : (
                    filteredStock.map((s) => (
                      <tr
                        key={s._id}
                        className="group hover:bg-slate-50 transition-all cursor-default"
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 leading-none mb-1">
                              {s.itemId?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {s.itemId?.sku}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center text-xs font-bold text-slate-400 uppercase">
                          {s.itemId?.unit || "pcs"}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span
                            className={`text-base font-black ${
                              s.quantity < 5
                                ? "text-rose-600"
                                : "text-slate-800"
                            }`}
                          >
                            {s.quantity}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right font-bold text-slate-500 text-sm">
                          ₹{s.itemId?.costPrice?.toLocaleString()}
                        </td>
                        <td className="px-8 py-6 text-right font-black text-indigo-600 text-sm">
                          ₹{s.itemId?.sellingPrice?.toLocaleString()}
                        </td>
                        <td className="px-8 py-6 text-center">
                          {s.quantity < 5 ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase ring-1 ring-rose-100">
                              <TrendingDown size={12} /> Low Stock
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase ring-1 ring-emerald-100">
                              Healthy
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. CREATE ITEM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Package size={20} />
                </div>
                <h3 className="font-black text-slate-800 text-lg">
                  Add New Item
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-8 space-y-6">
              {/* ITEM NAME */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Item Name *
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Premium Arabica Beans"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              {/* SKU + UNIT */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    SKU Code *
                  </label>

                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="COF-ARB-01"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm uppercase outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Unit *
                  </label>

                  <select
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 cursor-pointer"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="liter">Liters (liter)</option>
                    <option value="box">Boxes (box)</option>
                  </select>
                </div>
              </div>

              {/* CATEGORY + BRAND */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Beverages"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Nestle"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
                  />
                </div>
              </div>

              {/* BARCODE */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Barcode
                </label>

                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  placeholder="8901234567890"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
                />
              </div>

              {/* COST PRICE + SELLING PRICE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Cost Price (₹)
                  </label>

                  <input
                    type="number"
                    name="costPrice"
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Selling Price (₹)
                  </label>

                  <input
                    type="number"
                    name="sellingPrice"
                    min="0"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>
              {/* MAINTAIN STOCK TOGGLE */}
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintainStock"
                    checked={formData.maintainStock}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>

                  <span className="ml-3 text-xs font-black text-slate-500 uppercase tracking-widest">
                    {formData.maintainStock
                      ? "Maintain Inventory"
                      : "Service / Non Stock Item"}
                  </span>
                </label>
              </div>
              {/* ACTIVE TOGGLE */}
              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>

                  <span className="ml-3 text-xs font-black text-slate-500 uppercase tracking-widest">
                    {formData.isActive ? "Active in Catalog" : "Hidden"}
                  </span>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-6 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  <Save size={16} />
                  {submitting ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Inventory;



















// import React, { useState, useEffect } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import api from "../../services/api";
// import toast from "react-hot-toast";

// import {
//   Box,
//   Search,
//   RefreshCcw,
//   Filter,
//   AlertTriangle,
//   Package,
//   TrendingDown,
//   Warehouse,
//   ChevronRight,
//   BarChart2,
//   Plus,
//   X,
//   Save,
// } from "lucide-react";

// const Inventory = () => {
//   const [stock, setStock] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // SEARCH
//   const [searchTerm, setSearchTerm] = useState("");

//   // FILTERS
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [stockStatus, setStockStatus] = useState("ALL");
//   const [sortBy, setSortBy] = useState("NAME");

//   // SALES REPORT
//   const [salesReport, setSalesReport] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selectedItem, setSelectedItem] = useState("");
//   const [reportLoading, setReportLoading] = useState(false);

//   // MODAL
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // FORM
//   const [formData, setFormData] = useState({
//     name: "",
//     sku: "",
//     category: "",
//     brand: "",
//     barcode: "",
//     unit: "pcs",
//     costPrice: 0,
//     sellingPrice: 0,
//     isActive: true,
//     maintainStock: true,
//   });

//   // FETCH INVENTORY
//   const fetchInventory = async () => {
//     setLoading(true);

//     try {
//       const config = {
//         headers: {
//           activecompanyid: localStorage.getItem("activeCompanyId"),
//           activebranchid: localStorage.getItem("activeBranchId"),
//         },
//       };

//       const res = await api.get("/stock", config);

//       setStock(res.data.data || []);
//     } catch (err) {
//       toast.error("Cloud Inventory Sync Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // SALES REPORT
//   const fetchSalesReport = async () => {
//     if (!fromDate || !toDate) {
//       return toast.error("Select date range");
//     }

//     setReportLoading(true);

//     try {
//       const config = {
//         headers: {
//           activecompanyid: localStorage.getItem("activeCompanyId"),
//           activebranchid: localStorage.getItem("activeBranchId"),
//         },
//       };

//       const query = new URLSearchParams({
//         fromDate: `${fromDate}T00:00:00.000Z`,
//         toDate: `${toDate}T23:59:59.999Z`,
//       });

//       if (selectedItem) {
//         query.append("itemId", selectedItem);
//       }

//       const res = await api.get(
//         `/stock/sales-report?${query.toString()}`,
//         config
//       );

//       setSalesReport(res.data.data || []);

//       toast.success("Sales report generated");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to fetch sales report"
//       );
//     } finally {
//       setReportLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   // FORM INPUT
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // CREATE ITEM
//   const handleCreateItem = async (e) => {
//     e.preventDefault();

//     setSubmitting(true);

//     try {
//       const config = {
//         headers: {
//           activecompanyid: localStorage.getItem("activeCompanyId"),
//           activebranchid: localStorage.getItem("activeBranchId"),
//         },
//       };

//       const payload = {
//         ...formData,
//         sku: formData.sku.toUpperCase(),
//         costPrice: Number(formData.costPrice),
//         sellingPrice: Number(formData.sellingPrice),
//       };

//       await api.post("/item", payload, config);

//       toast.success("Item Added Successfully");

//       setIsModalOpen(false);

//       setFormData({
//         name: "",
//         sku: "",
//         category: "",
//         brand: "",
//         barcode: "",
//         unit: "pcs",
//         costPrice: 0,
//         sellingPrice: 0,
//         isActive: true,
//         maintainStock: true,
//       });

//       fetchInventory();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create item");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // SUMMARY
//   const totalStockValue = stock.reduce(
//     (acc, curr) => acc + curr.quantity * (curr.itemId?.costPrice || 0),
//     0
//   );

//   const lowStockCount = stock.filter((s) => s.quantity < 5).length;

//   const totalItems = stock.length;

//   // UNIQUE CATEGORIES
//   const uniqueCategories = [
//     ...new Set(stock.map((s) => s.itemId?.category).filter(Boolean)),
//   ];

//   // FILTER STOCK
//   const filteredStock = stock
//     .filter((s) => {
//       const search = searchTerm.toLowerCase();

//       const matchesSearch =
//         (s.itemId?.name || "").toLowerCase().includes(search) ||
//         (s.itemId?.sku || "").toLowerCase().includes(search) ||
//         (s.itemId?.category || "").toLowerCase().includes(search) ||
//         (s.itemId?.brand || "").toLowerCase().includes(search) ||
//         (s.itemId?.barcode || "").toLowerCase().includes(search);

//       const matchesCategory =
//         !selectedCategory || s.itemId?.category === selectedCategory;

//       const matchesStockStatus =
//         stockStatus === "ALL" ||
//         (stockStatus === "LOW" && s.quantity < 5) ||
//         (stockStatus === "HEALTHY" && s.quantity >= 5);

//       return matchesSearch && matchesCategory && matchesStockStatus;
//     })
//     .sort((a, b) => {
//       if (sortBy === "QTY_HIGH") {
//         return b.quantity - a.quantity;
//       }

//       if (sortBy === "QTY_LOW") {
//         return a.quantity - b.quantity;
//       }

//       if (sortBy === "NAME") {
//         return (a.itemId?.name || "").localeCompare(b.itemId?.name || "");
//       }

//       return 0;
//     });

//   return (
//     <MainLayout>
//       <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700 relative">
//         {/* HEADER */}
//         <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
//               Warehouse <ChevronRight size={12} /> Live Inventory
//             </div>

//             <h1 className="text-4xl font-black text-slate-900 tracking-tight">
//               Stock Management
//             </h1>
//           </div>

//           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//             {/* SEARCH */}
//             <div className="relative flex-1 md:w-80 group">
//               <Search
//                 className="absolute left-4 top-3.5 text-slate-400"
//                 size={18}
//               />

//               <input
//                 type="text"
//                 placeholder="Search SKU or Item..."
//                 className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             {/* REFRESH */}
//             <button
//               onClick={fetchInventory}
//               className="p-3 bg-white border border-slate-200 rounded-2xl h-12 w-12 flex items-center justify-center"
//             >
//               <RefreshCcw
//                 size={18}
//                 className={
//                   loading ? "animate-spin text-indigo-500" : "text-slate-500"
//                 }
//               />
//             </button>

//             {/* ADD ITEM */}
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="h-12 px-6 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-2"
//             >
//               <Plus size={18} />
//               Add Item
//             </button>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto space-y-8">
//           {/* SUMMARY */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
//               <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">
//                 Total Warehouse Value
//               </p>

//               <h2 className="text-5xl font-black">
//                 ₹ {totalStockValue.toLocaleString()}
//               </h2>
//             </div>

//             <div className="bg-white rounded-[2.5rem] p-8 border">
//               <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
//                 Total Unique SKUs
//               </p>

//               <h3 className="text-3xl font-black text-slate-800">
//                 {totalItems}
//               </h3>
//             </div>

//             <div className="bg-white rounded-[2.5rem] p-8 border">
//               <p className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-1">
//                 Critical Alerts
//               </p>

//               <h3 className="text-3xl font-black text-rose-600">
//                 {lowStockCount} Items
//               </h3>
//             </div>
//           </div>

//           {/* INVENTORY TABLE */}
//           <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
//             {/* FILTER TOOLBAR */}
//             <div className="p-8 border-b border-slate-50 bg-slate-50/50">
//               <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
//                 <div>
//                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
//                     <BarChart2 size={16} className="text-indigo-500" />
//                     Current Inventory Status
//                   </h3>
//                 </div>

//                 {/* FILTERS */}
//                 <div className="flex flex-wrap gap-3">
//                   {/* CATEGORY */}
//                   <div className="relative">
//                     <Filter
//                       size={14}
//                       className="absolute left-3 top-4 text-slate-400"
//                     />

//                     <select
//                       value={selectedCategory}
//                       onChange={(e) => setSelectedCategory(e.target.value)}
//                       className="h-11 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-bold"
//                     >
//                       <option value="">All Categories</option>

//                       {uniqueCategories.map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* STOCK STATUS */}
//                   <select
//                     value={stockStatus}
//                     onChange={(e) => setStockStatus(e.target.value)}
//                     className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold"
//                   >
//                     <option value="ALL">All Status</option>
//                     <option value="LOW">Low Stock</option>
//                     <option value="HEALTHY">Healthy Stock</option>
//                   </select>

//                   {/* SORT */}
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold"
//                   >
//                     <option value="NAME">Sort: Name</option>
//                     <option value="QTY_HIGH">Highest Quantity</option>
//                     <option value="QTY_LOW">Lowest Quantity</option>
//                   </select>

//                   {/* RESET */}
//                   <button
//                     onClick={() => {
//                       setSelectedCategory("");
//                       setStockStatus("ALL");
//                       setSortBy("NAME");
//                       setSearchTerm("");
//                     }}
//                     className="h-11 px-5 rounded-xl bg-white border border-slate-200 text-sm font-black"
//                   >
//                     Reset Filters
//                   </button>
//                 </div>
//               </div>
//             </div>
//             {/* TABLE */}
//             <div className="overflow-x-auto">
//               <table className="w-full border-separate border-spacing-0">
//                 <thead>
//                   <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
//                     <th className="px-8 py-5">Product Details</th>

//                     <th className="px-8 py-5 text-center">Unit</th>

//                     <th className="px-8 py-5 text-center">On Hand</th>

//                     <th className="px-8 py-5 text-right">Avg. Cost</th>

//                     <th className="px-8 py-5 text-right">Selling Price</th>

//                     <th className="px-8 py-5 text-center">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100 bg-white">
//                   {loading ? (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="p-24 text-center font-black text-slate-300"
//                       >
//                         Loading Inventory...
//                       </td>
//                     </tr>
//                   ) : filteredStock.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="p-24 text-center font-bold text-slate-400"
//                       >
//                         No items found.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredStock.map((s) => (
//                       <tr
//                         key={s._id}
//                         className="hover:bg-slate-50 transition-all"
//                       >
//                         <td className="px-8 py-6">
//                           <div className="flex flex-col">
//                             <span className="text-sm font-black text-slate-800">
//                               {s.itemId?.name}
//                             </span>

//                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                               {s.itemId?.sku}
//                             </span>
//                           </div>
//                         </td>

//                         <td className="px-8 py-6 text-center text-xs font-bold text-slate-400 uppercase">
//                           {s.itemId?.unit || "pcs"}
//                         </td>

//                         <td className="px-8 py-6 text-center">
//                           <span
//                             className={`text-base font-black ${
//                               s.quantity < 5
//                                 ? "text-rose-600"
//                                 : "text-slate-800"
//                             }`}
//                           >
//                             {s.quantity}
//                           </span>
//                         </td>

//                         <td className="px-8 py-6 text-right font-bold text-slate-500 text-sm">
//                           ₹{s.itemId?.costPrice?.toLocaleString()}
//                         </td>

//                         <td className="px-8 py-6 text-right font-black text-indigo-600 text-sm">
//                           ₹{s.itemId?.sellingPrice?.toLocaleString()}
//                         </td>

//                         <td className="px-8 py-6 text-center">
//                           {s.quantity < 5 ? (
//                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase">
//                               <TrendingDown size={12} />
//                               Low Stock
//                             </div>
//                           ) : (
//                             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">
//                               Healthy
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* SALES REPORT */}
//           <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
//             {/* HEADER */}
//             <div className="p-8 border-b border-slate-50 bg-slate-50/50">
//               <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
//                 <div>
//                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
//                     <BarChart2 size={16} className="text-indigo-500" />
//                     Sales Analytics Report
//                   </h3>

//                   <p className="text-sm text-slate-400 mt-2">
//                     Analyze sold inventory between selected dates
//                   </p>
//                 </div>

//                 {/* REPORT FILTERS */}
//                 <div className="flex flex-wrap gap-3">
//                   {/* FROM DATE */}
//                   <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 outline-none"
//                   />

//                   {/* TO DATE */}
//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 outline-none"
//                   />

//                   {/* ITEM FILTER */}
//                   <select
//                     value={selectedItem}
//                     onChange={(e) => setSelectedItem(e.target.value)}
//                     className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 outline-none min-w-[220px]"
//                   >
//                     <option value="">All Items</option>

//                     {stock.map((s) => (
//                       <option key={s.itemId?._id} value={s.itemId?._id}>
//                         {s.itemId?.name}
//                       </option>
//                     ))}
//                   </select>

//                   {/* GENERATE */}
//                   <button
//                     onClick={fetchSalesReport}
//                     className="h-11 px-6 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
//                   >
//                     {reportLoading ? "Generating..." : "Generate Report"}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* REPORT TABLE */}
//             <div className="overflow-x-auto">
//               <table className="w-full border-separate border-spacing-0">
//                 <thead>
//                   <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
//                     <th className="px-8 py-5">#</th>

//                     <th className="px-8 py-5">Item Name</th>

//                     <th className="px-8 py-5 text-center">
//                       Total Quantity Sold
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100 bg-white">
//                   {reportLoading ? (
//                     <tr>
//                       <td
//                         colSpan="3"
//                         className="p-24 text-center font-black text-slate-300"
//                       >
//                         Generating Sales Analytics...
//                       </td>
//                     </tr>
//                   ) : salesReport.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan="3"
//                         className="p-24 text-center font-bold text-slate-400"
//                       >
//                         No report data available.
//                       </td>
//                     </tr>
//                   ) : (
//                     salesReport.map((item, index) => (
//                       <tr
//                         key={index}
//                         className="hover:bg-slate-50 transition-all"
//                       >
//                         <td className="px-8 py-6 font-black text-slate-500">
//                           {index + 1}
//                         </td>

//                         <td className="px-8 py-6">
//                           <div className="flex flex-col">
//                             <span className="text-sm font-black text-slate-800">
//                               {item.itemName}
//                             </span>

//                             <span className="text-[10px] text-slate-400 uppercase tracking-widest">
//                               Sales Analytics
//                             </span>
//                           </div>
//                         </td>

//                         <td className="px-8 py-6 text-center">
//                           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-sm">
//                             {item.totalSold}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* MODAL */}
//         {isModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//             <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
//               {/* MODAL HEADER */}
//               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
//                     <Package size={20} />
//                   </div>

//                   <h3 className="font-black text-slate-800 text-lg">
//                     Add New Item
//                   </h3>
//                 </div>

//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="p-2 text-slate-400 hover:text-rose-500"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* FORM */}
//               <form onSubmit={handleCreateItem} className="p-8 space-y-6">
//                 {/* ITEM NAME */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Item Name
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Premium Coffee"
//                     className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* SKU + UNIT */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       SKU
//                     </label>

//                     <input
//                       type="text"
//                       name="sku"
//                       required
//                       value={formData.sku}
//                       onChange={handleInputChange}
//                       placeholder="SKU-001"
//                       className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Unit
//                     </label>

//                     <select
//                       name="unit"
//                       value={formData.unit}
//                       onChange={handleInputChange}
//                       className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="pcs">Pieces</option>

//                       <option value="kg">KG</option>

//                       <option value="box">Box</option>

//                       <option value="liter">Liter</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* CATEGORY + BRAND */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Category
//                     </label>

//                     <input
//                       type="text"
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       placeholder="Beverages"
//                       className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Brand
//                     </label>

//                     <input
//                       type="text"
//                       name="brand"
//                       value={formData.brand}
//                       onChange={handleInputChange}
//                       placeholder="Nestle"
//                       className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                 </div>

//                 {/* BARCODE */}
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     Barcode
//                   </label>

//                   <input
//                     type="text"
//                     name="barcode"
//                     value={formData.barcode}
//                     onChange={handleInputChange}
//                     placeholder="8901234567890"
//                     className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* COST + SELLING */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Cost Price
//                     </label>

//                     <input
//                       type="number"
//                       name="costPrice"
//                       value={formData.costPrice}
//                       onChange={handleInputChange}
//                       className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Selling Price
//                     </label>

//                     <input
//                       type="number"
//                       name="sellingPrice"
//                       value={formData.sellingPrice}
//                       onChange={handleInputChange}
//                       className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                 </div>
//                 {/* MAINTAIN STOCK TOGGLE */}
//                 <div className="flex items-center gap-3 pt-2">
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="maintainStock"
//                       checked={formData.maintainStock}
//                       onChange={handleInputChange}
//                       className="sr-only peer"
//                     />

//                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>

//                     <span className="ml-3 text-xs font-black text-slate-500 uppercase tracking-widest">
//                       {formData.maintainStock
//                         ? "Strict Inventory Tracking"
//                         : "Allow Negative Stock"}
//                     </span>
//                   </label>
//                 </div>

//                 {/* ACTIVE TOGGLE */}
//                 <div className="flex items-center gap-3 pt-2">
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="isActive"
//                       checked={formData.isActive}
//                       onChange={handleInputChange}
//                       className="sr-only peer"
//                     />

//                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>

//                     <span className="ml-3 text-xs font-black text-slate-500 uppercase tracking-widest">
//                       {formData.isActive ? "Active in Catalog" : "Hidden"}
//                     </span>
//                   </label>
//                 </div>
//                 {/* BUTTONS */}
//                 <div className="pt-6 border-t border-slate-100 flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={submitting}
//                     className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
//                   >
//                     <Save size={16} />

//                     {submitting ? "Saving..." : "Save Item"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// };

// export default Inventory;
