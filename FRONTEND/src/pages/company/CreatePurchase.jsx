// import React, { useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import { useReactToPrint } from "react-to-print";
// import MainLayout from "../../layouts/MainLayout";
// import PurchaseInvoiceA4 from "../../components/print/PurchaseInvoiceA4";
// import api from "../../services/api";
// import toast from "react-hot-toast";
// import {
//   useFloating,
//   autoUpdate,
//   flip,
//   shift,
//   offset,
//   size,
// } from "@floating-ui/react";

// import {
//   Printer,
//   Plus,
//   Trash2,
//   Save,
//   IndianRupee,
//   RefreshCcw,
//   Package,
//   FileText,
//   Search,
//   ChevronDown,
//   UserPlus,
//   Phone,
//   Mail,
//   MapPin,
//   Building2,
//   CheckCircle2,
//   X,
// } from "lucide-react";

// // --- PREMIUM SEARCHABLE SELECT COMPONENT ---
// const SearchableSelect = ({
//   options,
//   value,
//   onChange,
//   placeholder,
//   className,
//   isItem = false,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");

//   const selectedOption = options.find((opt) => opt.value === value);

//   const filteredOptions = options.filter((opt) => {
//     const search = searchTerm.toLowerCase();

//     if (isItem) {
//       return (
//         (opt.label || "").toLowerCase().includes(search) ||
//         (opt.barcode || "").toLowerCase().includes(search) ||
//         (opt.sku || "").toLowerCase().includes(search) ||
//         (opt.category || "").toLowerCase().includes(search) ||
//         (opt.brand || "").toLowerCase().includes(search)
//       );
//     }

//     return (
//       (opt.label || "").toLowerCase().includes(search) ||
//       (opt.phone || "").toLowerCase().includes(search)
//     );
//   });

//   const { refs, floatingStyles, placement } = useFloating({
//     open: isOpen,

//     middleware: [
//       offset(10),

//       flip({
//         padding: 20,
//       }),

//       shift({
//         padding: 20,
//       }),

//       size({
//         apply({ availableHeight, elements }) {
//           Object.assign(elements.floating.style, {
//             maxHeight: `${Math.max(250, Math.min(availableHeight, 320))}px`,
//           });
//         },
//       }),
//     ],

//     whileElementsMounted: autoUpdate,
//   });

//   useEffect(() => {
//     if (isOpen) {
//       refs.reference.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//       });
//     }
//   }, [isOpen]);

//   return (
//     <>
//       {/* TRIGGER */}
//       <div
//         ref={refs.setReference}
//         onClick={() => setIsOpen(!isOpen)}
//         className={`flex items-center justify-between cursor-pointer transition-all bg-slate-50 border border-slate-100 rounded-2xl h-14 px-5 ${className} ${
//           isOpen ? "ring-4 ring-indigo-500/10 border-indigo-200" : ""
//         }`}
//       >
//         <span
//           className={
//             selectedOption
//               ? "text-slate-700 font-bold text-sm"
//               : "text-slate-400 text-sm font-medium"
//           }
//         >
//           {selectedOption ? selectedOption.label : placeholder}
//         </span>

//         <ChevronDown
//           size={16}
//           className={`text-slate-400 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </div>

//       {/* PORTAL DROPDOWN */}
//       {isOpen &&
//         createPortal(
//           <>
//             {/* BACKDROP */}
//             <div
//               className="fixed inset-0 z-[9998]"
//               onClick={() => setIsOpen(false)}
//             />

//             {/* DROPDOWN */}
//             <div
//               ref={refs.setFloating}
//               style={floatingStyles}
//               className="w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-[9999]"
//             >
//               {/* SEARCH */}
//               <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4">
//                 <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 h-12">
//                   <Search size={16} className="text-slate-400" />

//                   <input
//                     autoFocus
//                     type="text"
//                     placeholder="Type to search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full bg-transparent outline-none text-sm font-semibold"
//                   />
//                 </div>
//               </div>

//               {/* OPTIONS */}
//               <div
//                 className="overflow-y-auto min-h-[250px] max-h-[320px]"
//                 style={{
//                   scrollbarWidth: "thin",
//                 }}
//               >
//                 {filteredOptions.length > 0 ? (
//                   filteredOptions.map((opt) => (
//                     <div
//                       key={opt.value}
//                       onClick={() => {
//                         onChange(opt.value);

//                         setIsOpen(false);

//                         setSearchTerm("");
//                       }}
//                       className="px-4 py-4 cursor-pointer hover:bg-indigo-50 transition-all border-b border-slate-100"
//                     >
//                       <div className="flex justify-between gap-4">
//                         <div className="min-w-0 flex-1">
//                           <h3 className="font-black text-sm text-slate-800 truncate">
//                             {opt.label}
//                           </h3>

//                           {isItem && (
//                             <div className="mt-2 flex flex-wrap gap-2">
//                               {opt.sku && (
//                                 <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black">
//                                   SKU: {opt.sku}
//                                 </span>
//                               )}

//                               {opt.brand && (
//                                 <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black">
//                                   {opt.brand}
//                                 </span>
//                               )}

//                               {opt.category && (
//                                 <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black">
//                                   {opt.category}
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                         </div>

//                         {opt.price > 0 && (
//                           <div className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-black">
//                             ₹{opt.price}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-6 text-center text-slate-400 text-sm">
//                     No matches found
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>,
//           document.body
//         )}
//     </>
//   );
// };
// const CreatePurchase = () => {
//   const [loading, setLoading] = useState(false);

//   const [syncing, setSyncing] = useState(false);

//   const [parties, setParties] = useState([]);

//   const [availableItems, setAvailableItems] = useState([]);

//   const [generatedPurchaseNo, setGeneratedPurchaseNo] = useState("");

//   const [createdPurchase, setCreatedPurchase] = useState(null);

//   const printRef = useRef(null);
//   const [formData, setFormData] = useState({
//     partyId: "",

//     supplierBillNo: "",

//     supplierBillDate: new Date().toISOString().split("T")[0],

//     purchaseDate: new Date().toISOString().split("T")[0],

//     items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],

//     totalAmount: 0,

//     paymentMode: "credit",

//     paidAmount: 0,

//     notes: "",
//   });
//   const [showAddSupplierPanel, setShowAddSupplierPanel] = useState(false);

//   const [supplierForm, setSupplierForm] = useState({
//     name: "",
//     type: "supplier",
//     phone: "",
//     email: "",
//     address: "",
//   });

//   const handleSupplierSubmit = async () => {
//     try {
//       const res = await api.post("/party", supplierForm);

//       toast.success("Supplier Added");

//       await fetchData();

//       const newSupplierId = res?.data?.data?._id || res?.data?._id;

//       if (newSupplierId) {
//         setFormData((prev) => ({
//           ...prev,
//           partyId: newSupplierId.toString(),
//         }));
//       }

//       setSupplierForm({
//         name: "",
//         type: "supplier",
//         phone: "",
//         email: "",
//         address: "",
//       });

//       setShowAddSupplierPanel(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add supplier");
//     }
//   };

//   /* FETCH */

//   const fetchData = async () => {
//     setSyncing(true);

//     try {
//       const [itemRes, partyRes] = await Promise.all([
//         api.get("/item"),
//         api.get("/party/filter?type=supplier"),
//       ]);

//       setAvailableItems(
//         itemRes.data.success ? itemRes.data.data : itemRes.data || []
//       );

//       setParties(
//         partyRes.data.success ? partyRes.data.data : partyRes.data || []
//       );
//     } catch (err) {
//       toast.error("Cloud synchronization failed");
//     } finally {
//       setSyncing(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const selectedParty = parties.find((p) => p._id === formData.partyId);

//   const supplierOptions = parties.map((p) => ({
//     label: p.name,
//     value: p._id,
//     phone: p.phone || "",
//   }));

//   const itemOptions = availableItems
//     .filter((i) => i.maintainStock)
//     .map((i) => ({
//       label: i.name,
//       value: i._id,

//       price: i.costPrice,
//       stock: i.stock,

//       barcode: i.barcode,
//       sku: i.sku,
//       category: i.category,
//       brand: i.brand,
//     }));

//   /* ITEMS */

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...formData.items];

//     if (field === "itemId") {
//       const selected = availableItems.find(
//         (i) => i._id === value && i.maintainStock
//       );

//       newItems[index].itemId = value;

//       newItems[index].price = selected ? selected.costPrice || 0 : 0;
//     } else {
//       newItems[index][field] = value;
//     }

//     newItems[index].total =
//       (parseFloat(newItems[index].quantity) || 0) *
//       (parseFloat(newItems[index].price) || 0);

//     const grandTotal = newItems
//       .filter((i) => i.itemId)
//       .reduce((acc, curr) => acc + (curr.total || 0), 0);

//     setFormData({
//       ...formData,
//       items: newItems,
//       totalAmount: grandTotal,
//       paidAmount: formData.paymentMode === "cash" ? grandTotal : 0,
//     });
//   };
//  const handlePrint = useReactToPrint({
//   contentRef: printRef,

//   documentTitle: "Purchase Invoice",

//   removeAfterPrint: true,
// });

//   /* SUBMIT */

//   /* ========================================================= */
//   /* SUBMIT */
//   /* ========================================================= */

//   const handleSubmit = async (
//   e,
//   printAfterSave = false
// ) => {

//   e.preventDefault();

//   /* ====================================== */
//   /* VALIDATION */
//   /* ====================================== */

//   if (!formData.partyId) {
//     return toast.error(
//       "Please select supplier"
//     );
//   }

//   if (!formData.supplierBillNo) {
//     return toast.error(
//       "Supplier bill no required"
//     );
//   }

//   /* ====================================== */
//   /* CLEAN EMPTY AUTO ROWS */
//   /* ====================================== */

//   const cleanedItems = formData.items
//     .filter(
//       (item) =>
//         item.itemId &&
//         String(item.itemId).trim() !== ""
//     )
//     .map((item) => ({
//       itemId: item.itemId,

//       quantity:
//         Number(item.quantity) || 1,

//       price:
//         Number(item.price) || 0,

//       total:
//         (Number(item.quantity) || 0) *
//         (Number(item.price) || 0),
//     }));

//   /* ====================================== */
//   /* NO ITEMS */
//   /* ====================================== */

//   if (cleanedItems.length === 0) {
//     return toast.error(
//       "Please add at least one item"
//     );
//   }

//   /* ====================================== */
//   /* FINAL TOTAL */
//   /* ====================================== */

//   const finalTotal = cleanedItems.reduce(
//     (acc, curr) => acc + curr.total,
//     0
//   );

//   /* ====================================== */
//   /* FINAL PAYLOAD */
//   /* ====================================== */

//   const payload = {
//     ...formData,

//     items: cleanedItems,

//     totalAmount: finalTotal,

//     paidAmount:
//       formData.paymentMode === "cash"
//         ? finalTotal
//         : Number(formData.paidAmount) || 0,
//   };

//   try {

//     setLoading(true);

//     /* ====================================== */
//     /* SAVE PURCHASE */
//     /* ====================================== */

//     const res = await api.post(
//       "/purchase",
//       payload
//     );

//     toast.success(
//       "Purchase saved successfully"
//     );

//     /* ====================================== */
//     /* GENERATED NUMBER */
//     /* ====================================== */

//     setGeneratedPurchaseNo(
//       res?.data?.data?.purchaseNumber || ""
//     );

//     const purchaseId =
//       res?.data?.data?._id;

//     /* ====================================== */
//     /* SAVE & PRINT FLOW */
//     /* ====================================== */

//     if (printAfterSave && purchaseId) {

//   try {

//     const detailRes = await api.get(
//       `/purchase/${purchaseId}`
//     );

//     const purchaseData =
//       detailRes?.data?.data;

//     setCreatedPurchase(purchaseData);

//     setTimeout(() => {

//       handlePrint();

//     }, 1000);

//   } catch (printErr) {

//     console.error(printErr);

//     toast.error(
//       "Print preparation failed"
//     );
//   }
// }

//     /* ====================================== */
//     /* RESET FORM */
//     /* ====================================== */

//     setTimeout(
//       () => {

//         setFormData({
//           partyId: "",

//           supplierBillNo: "",

//           supplierBillDate:
//             new Date()
//               .toISOString()
//               .split("T")[0],

//           purchaseDate:
//             new Date()
//               .toISOString()
//               .split("T")[0],

//           items: [
//             {
//               itemId: "",
//               quantity: 1,
//               price: 0,
//               total: 0,
//             },
//           ],

//           totalAmount: 0,

//           paymentMode: "credit",

//           paidAmount: 0,

//           notes: "",
//         });

//       },
//       printAfterSave ? 1600 : 100
//     );

//     /* ====================================== */
//     /* REFRESH */
//     /* ====================================== */

//     fetchData();

//   } catch (err) {

//     console.error(err);

//     toast.error(
//       err?.response?.data?.message ||
//       "Failed to save purchase"
//     );

//   } finally {

//     setLoading(false);

//   }
// };

//   {
//     /* ========================================================= */
//   }
//   {
//     /* ENTERPRISE PURCHASE ENTRY LAYOUT - REWRITTEN ARCHITECTURE */
//   }
//   {
//     /* ========================================================= */
//   }

//   return (
//     <MainLayout>
//       {/* ========================================================= */}
//       {/* PAGE ROOT */}
//       {/* ========================================================= */}
//       <div className="min-h-screen bg-[#F6F8FC]">
//         {/* ========================================================= */}
//         {/* FIXED ERP HEADER */}
//         {/* ========================================================= */}
//         <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
//           <div className="px-4 md:px-6 xl:px-8 h-[92px] flex items-center justify-between gap-6">
//             {/* LEFT */}
//             <div className="min-w-0">
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />

//                 <span className="uppercase tracking-[0.35em] text-[10px] font-black text-indigo-600">
//                   Purchase / Entry
//                 </span>
//               </div>

//               <h1 className="text-[30px] xl:text-[34px] leading-none font-black tracking-tight text-slate-900">
//                 Create Purchase Entry
//               </h1>
//             </div>

//             {/* ACTIONS */}
//             <div className="flex items-center gap-3 shrink-0">
//               {/* REFRESH */}
//               <button
//                 onClick={fetchData}
//                 className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all"
//               >
//                 <RefreshCcw
//                   size={17}
//                   className={`text-slate-500 ${syncing ? "animate-spin" : ""}`}
//                 />
//               </button>

//               {/* PRINT */}
//               <button
//                 type="button"
//                 onClick={(e) => handleSubmit(e, true)}
//                 className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center gap-2 shadow-sm transition-all"
//               >
//                 <Printer size={16} />
//                 Save & Print
//               </button>

//               {/* SAVE */}
//               <button
//                 type="button"
//                 onClick={(e) => handleSubmit(e, false)}
//                 className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-2 shadow-sm transition-all"
//               >
//                 <Save size={16} />
//                 Save Purchase
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ========================================================= */}
//         {/* MAIN CONTENT */}
//         {/* ========================================================= */}
//         <div className="px-4 md:px-6 xl:px-8 pt-[190px] pb-10">
//           {/* ========================================================= */}
//           {/* CONTENT GRID */}
//           {/* ========================================================= */}
//           <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
//             {/* ========================================================= */}
//             {/* LEFT SECTION */}
//             {/* ========================================================= */}
//             <div className="min-w-0 space-y-6">
//               {/* ========================================================= */}
//               {/* SUPPLIER CARD */}
//               {/* ========================================================= */}
//               <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-visible">
//                 {/* HEADER */}
//                 <div className="h-[78px] px-6 border-b border-slate-100 flex items-center justify-between">
//                   <div>
//                     <h2 className="text-[24px] font-black text-slate-900">
//                       Supplier Details
//                     </h2>

//                     <p className="text-sm text-slate-400 font-semibold mt-1">
//                       Supplier invoice & billing information
//                     </p>
//                   </div>

//                   <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center">
//                     <Building2 size={18} className="text-indigo-600" />
//                   </div>
//                 </div>

//                 {/* BODY */}
//                 <div className="p-6 space-y-5">
//                   {/* ROW 1 */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     {/* SUPPLIER */}
//                     <div>
//                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                         Supplier Name
//                       </label>

//                       <div className="flex gap-3">
//                         <div className="flex-1">
//                           <SearchableSelect
//                             options={supplierOptions}
//                             value={formData.partyId}
//                             onChange={(val) =>
//                               setFormData({
//                                 ...formData,
//                                 partyId: val,
//                               })
//                             }
//                             placeholder="Search supplier..."
//                           />
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => setShowAddSupplierPanel(true)}
//                           className="h-14 w-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-all shrink-0"
//                         >
//                           <UserPlus size={18} />
//                         </button>
//                       </div>

//                       {/* CONTACT */}
//                       {selectedParty && (
//                         <div className="mt-4 flex flex-wrap gap-3">
//                           {selectedParty.phone && (
//                             <div className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
//                               <Phone size={14} className="text-indigo-600" />

//                               <span className="text-sm font-bold text-slate-700">
//                                 {selectedParty.phone}
//                               </span>
//                             </div>
//                           )}

//                           {selectedParty.email && (
//                             <div className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
//                               <Mail size={14} className="text-violet-600" />

//                               <span className="text-sm font-bold text-slate-700">
//                                 {selectedParty.email}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* BILL NO */}
//                     <div>
//                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                         Supplier Bill No
//                       </label>

//                       <input
//                         type="text"
//                         value={formData.supplierBillNo}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             supplierBillNo: e.target.value,
//                           })
//                         }
//                         placeholder="INV-10293"
//                         className="w-full h-14 rounded-xl border border-slate-200 bg-white px-5 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
//                       />
//                     </div>
//                   </div>

//                   {/* ROW 2 */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     {/* PURCHASE DATE */}
//                     <div>
//                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                         Purchase Date
//                       </label>

//                       <input
//                         type="date"
//                         value={formData.purchaseDate}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             purchaseDate: e.target.value,
//                           })
//                         }
//                         className="w-full h-14 rounded-xl border border-slate-200 bg-white px-5 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
//                       />
//                     </div>

//                     {/* BILL DATE */}
//                     <div>
//                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                         Supplier Bill Date
//                       </label>

//                       <input
//                         type="date"
//                         value={formData.supplierBillDate}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             supplierBillDate: e.target.value,
//                           })
//                         }
//                         className="w-full h-14 rounded-xl border border-slate-200 bg-white px-5 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ========================================================= */}
//               {/* PURCHASE ITEMS */}
//               {/* ========================================================= */}
//               <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-visible">
//                 {/* HEADER */}
//                 <div className="h-[78px] px-6 border-b border-slate-100 flex items-center justify-between">
//                   <div>
//                     <h2 className="text-[24px] font-black text-slate-900">
//                       Purchase Items
//                     </h2>

//                     <p className="text-sm text-slate-400 font-semibold mt-1">
//                       Add inventory products into invoice
//                     </p>
//                   </div>

//                   <div className="h-11 px-4 rounded-xl bg-indigo-50 flex items-center gap-2">
//                     <Package size={16} className="text-indigo-600" />

//                     <span className="font-black text-sm text-indigo-700">
//                       {formData.items.filter((i) => i.itemId).length} Items
//                     </span>
//                   </div>
//                 </div>

//                 {/* BODY */}
//                 <div className="p-5 space-y-4">
//                   {formData.items.map((item, index) => (
//                     <div
//                       key={index}
//                       className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-indigo-200 hover:bg-white"
//                     >
//                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
//                         {/* PRODUCT */}
//                         <div className="lg:col-span-6">
//                           <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                             Product
//                           </label>

//                           <SearchableSelect
//                             options={itemOptions}
//                             value={item.itemId}
//                             isItem={true}
//                             onChange={(val) => {
//                               handleItemChange(index, "itemId", val);

//                               const isLastRow =
//                                 index === formData.items.length - 1;

//                               if (isLastRow && val) {
//                                 setTimeout(() => {
//                                   setFormData((prev) => ({
//                                     ...prev,

//                                     items: [
//                                       ...prev.items,

//                                       {
//                                         itemId: "",
//                                         quantity: 1,
//                                         price: 0,
//                                         total: 0,
//                                       },
//                                     ],
//                                   }));
//                                 }, 100);
//                               }
//                             }}
//                             placeholder="Search product..."
//                           />
//                         </div>

//                         {/* QTY */}
//                         <div className="lg:col-span-2">
//                           <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                             Qty
//                           </label>

//                           <input
//                             type="number"
//                             min="1"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 index,
//                                 "quantity",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full h-14 rounded-xl border border-slate-200 bg-white px-4 text-center font-black outline-none"
//                           />
//                         </div>

//                         {/* PRICE */}
//                         <div className="lg:col-span-2">
//                           <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                             Price
//                           </label>

//                           <div className="relative">
//                             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
//                               ₹
//                             </span>

//                             <input
//                               type="number"
//                               value={item.price}
//                               onChange={(e) =>
//                                 handleItemChange(index, "price", e.target.value)
//                               }
//                               className="w-full h-14 rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-black outline-none"
//                             />
//                           </div>
//                         </div>

//                         {/* TOTAL */}
//                         <div className="lg:col-span-1">
//                           <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                             Total
//                           </label>

//                           <div className="h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
//                             ₹{item.total || 0}
//                           </div>
//                         </div>

//                         {/* DELETE */}
//                         <div className="lg:col-span-1">
//                           <button
//                             type="button"
//                             className="w-full h-14 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-all"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ========================================================= */}
//             {/* SUMMARY RAIL */}
//             {/* ========================================================= */}
//             <div className="hidden xl:block">
//               <div className="sticky top-[180px]">
//                 <div className="rounded-[28px] overflow-hidden border border-indigo-100 bg-white shadow-[0_20px_60px_rgba(99,102,241,0.10)]">
//                   {/* TOP */}
//                   <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-6 text-white">
//                     <div className="flex items-center justify-between mb-5">
//                       <div>
//                         <p className="uppercase tracking-[0.3em] text-[10px] font-black text-indigo-200 mb-2">
//                           Purchase Summary
//                         </p>

//                         <h2 className="text-[28px] font-black">Total Amount</h2>
//                       </div>

//                       <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
//                         <IndianRupee size={24} />
//                       </div>
//                     </div>

//                     <h1 className="text-5xl font-black tracking-tight leading-none">
//                       ₹{formData.totalAmount || 0}
//                     </h1>

//                     <p className="mt-3 text-sm text-indigo-100 font-medium">
//                       Live purchase invoice total
//                     </p>
//                   </div>

//                   {/* BODY */}
//                   <div className="p-5 space-y-5">
//                     {/* PAYMENT */}
//                     <div>
//                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                         Payment Mode
//                       </label>

//                       <div className="grid grid-cols-2 gap-3">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setFormData({
//                               ...formData,
//                               paymentMode: "credit",
//                               paidAmount: 0,
//                             })
//                           }
//                           className={`h-13 rounded-xl font-black transition-all ${
//                             formData.paymentMode === "credit"
//                               ? "bg-indigo-600 text-white shadow-lg"
//                               : "bg-slate-100 text-slate-500"
//                           }`}
//                         >
//                           Credit
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             setFormData({
//                               ...formData,
//                               paymentMode: "cash",
//                               paidAmount: formData.totalAmount,
//                             })
//                           }
//                           className={`h-13 rounded-xl font-black transition-all ${
//                             formData.paymentMode === "cash"
//                               ? "bg-emerald-600 text-white shadow-lg"
//                               : "bg-slate-100 text-slate-500"
//                           }`}
//                         >
//                           Cash
//                         </button>
//                       </div>
//                     </div>

//                     {/* PAID */}
//                     <div>
//                       <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
//                         Paid Amount
//                       </label>

//                       <div className="relative">
//                         <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
//                           ₹
//                         </span>

//                         <input
//                           type="number"
//                           disabled={formData.paymentMode === "cash"}
//                           value={formData.paidAmount}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               paidAmount: e.target.value,
//                             })
//                           }
//                           className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 font-black outline-none"
//                         />
//                       </div>
//                     </div>

//                     {/* SUMMARY */}
//                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-slate-500 font-semibold">
//                           Items
//                         </span>

//                         <span className="font-black">
//                           {formData.items.length}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <span className="text-slate-500 font-semibold">
//                           Payment
//                         </span>

//                         <span className="font-black capitalize">
//                           {formData.paymentMode}
//                         </span>
//                       </div>

//                       <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
//                         <span className="text-slate-500 font-semibold">
//                           Grand Total
//                         </span>

//                         <span className="text-2xl font-black text-indigo-700">
//                           ₹{formData.totalAmount || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* PRINT AREA */}
//       <div className="hidden">
//         <div ref={printRef}>
//           {createdPurchase && <PurchaseInvoiceA4 purchase={createdPurchase} />}
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default CreatePurchase;

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useReactToPrint } from "react-to-print";
import MainLayout from "../../layouts/MainLayout";
import PurchaseInvoiceA4 from "../../components/print/PurchaseInvoiceA4";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
  size,
} from "@floating-ui/react";

import {
  Printer,
  Plus,
  Trash2,
  Save,
  IndianRupee,
  RefreshCcw,
  Package,
  FileText,
  Search,
  ChevronDown,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  X,
} from "lucide-react";

// --- PREMIUM SEARCHABLE SELECT COMPONENT ---
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  className,
  isItem = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) => {
    const search = searchTerm.toLowerCase();

    if (isItem) {
      return (
        (opt.label || "").toLowerCase().includes(search) ||
        (opt.barcode || "").toLowerCase().includes(search) ||
        (opt.sku || "").toLowerCase().includes(search) ||
        (opt.category || "").toLowerCase().includes(search) ||
        (opt.brand || "").toLowerCase().includes(search)
      );
    }

    return (
      (opt.label || "").toLowerCase().includes(search) ||
      (opt.phone || "").toLowerCase().includes(search)
    );
  });

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      flip({ padding: 20 }),
      shift({ padding: 20 }),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(250, Math.min(availableHeight, 320))}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (isOpen) {
      refs.reference.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isOpen, refs.reference]);

  return (
    <>
      {/* TRIGGER */}
      <div
        ref={refs.setReference}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer transition-all bg-slate-50 border border-slate-100 rounded-2xl h-14 px-5 ${className} ${
          isOpen ? "ring-4 ring-indigo-500/10 border-indigo-200" : ""
        }`}
      >
        <span
          className={
            selectedOption
              ? "text-slate-700 font-bold text-sm"
              : "text-slate-400 text-sm font-medium"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* PORTAL DROPDOWN */}
      {isOpen &&
        createPortal(
          <>
            {/* BACKDROP */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* DROPDOWN */}
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-[9999]"
            >
              {/* SEARCH */}
              <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4">
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 h-12">
                  <Search size={16} className="text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-semibold"
                  />
                </div>
              </div>

              {/* OPTIONS */}
              <div
                className="overflow-y-auto min-h-[250px] max-h-[320px]"
                style={{ scrollbarWidth: "thin" }}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="px-4 py-4 cursor-pointer hover:bg-indigo-50 transition-all border-b border-slate-100"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-sm text-slate-800 truncate">
                            {opt.label}
                          </h3>

                          {isItem && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {opt.sku && (
                                <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-black">
                                  SKU: {opt.sku}
                                </span>
                              )}
                              {opt.brand && (
                                <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black">
                                  {opt.brand}
                                </span>
                              )}
                              {opt.category && (
                                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black">
                                  {opt.category}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {opt.price > 0 && (
                          <div className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-black">
                            ₹{opt.price}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No matches found
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};

const CreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [parties, setParties] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [generatedPurchaseNo, setGeneratedPurchaseNo] = useState("");
  const [createdPurchase, setCreatedPurchase] = useState(null);

  const printRef = useRef(null);

  const [formData, setFormData] = useState({
    partyId: "",
    supplierBillNo: "",
    supplierBillDate: new Date().toISOString().split("T")[0],
    purchaseDate: new Date().toISOString().split("T")[0],
    items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
    totalAmount: 0,
    paymentMode: "credit",
    paidAmount: 0,
    notes: "",
  });

  const [showAddSupplierPanel, setShowAddSupplierPanel] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    type: "supplier",
    phone: "",
    email: "",
    address: "",
  });

  const handleSupplierSubmit = async () => {
    try {
      const res = await api.post("/party", supplierForm);
      toast.success("Supplier Added");
      await fetchData();
      const newSupplierId = res?.data?.data?._id || res?.data?._id;
      if (newSupplierId) {
        setFormData((prev) => ({ ...prev, partyId: newSupplierId.toString() }));
      }
      setSupplierForm({
        name: "",
        type: "supplier",
        phone: "",
        email: "",
        address: "",
      });
      setShowAddSupplierPanel(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add supplier");
    }
  };

  const fetchData = async () => {
    setSyncing(true);
    try {
      const [itemRes, partyRes] = await Promise.all([
        api.get("/item"),
        api.get("/party/filter?type=supplier"),
      ]);
      console.log("Fetched Items:", itemRes.data);
      setAvailableItems(
        itemRes.data.success ? itemRes.data.data : itemRes.data || []
      );
      setParties(
        partyRes.data.success ? partyRes.data.data : partyRes.data || []
      );
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedParty = parties.find((p) => p._id === formData.partyId);

  const supplierOptions = parties.map((p) => ({
    label: p.name,
    value: p._id,
    phone: p.phone || "",
  }));

  const itemOptions = availableItems
    .filter((i) => i.isActive)
    .map((i) => ({
      label: i.name,

      value: i._id,

      price: i.costPrice,

      stock: i.stock,

      barcode: i.barcode,

      sku: i.sku,

      category: i.category,

      brand: i.brand,

      maintainStock: i.maintainStock,
    }));

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];

    if (field === "itemId") {
      const selected = availableItems.find((i) => i._id === value);
      newItems[index].itemId = value;
      newItems[index].price = selected ? selected.costPrice || 0 : 0;
    } else {
      newItems[index][field] = value;
    }

    newItems[index].total =
      (parseFloat(newItems[index].quantity) || 0) *
      (parseFloat(newItems[index].price) || 0);

    const grandTotal = newItems
      .filter((i) => i.itemId)
      .reduce((acc, curr) => acc + (curr.total || 0), 0);

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: grandTotal,
      paidAmount:
        formData.paymentMode === "cash" ? grandTotal : formData.paidAmount,
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    if (newItems.length === 0) {
      newItems.push({ itemId: "", quantity: 1, price: 0, total: 0 });
    }
    const grandTotal = newItems
      .filter((i) => i.itemId)
      .reduce((acc, curr) => acc + (curr.total || 0), 0);

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: grandTotal,
      paidAmount:
        formData.paymentMode === "cash" ? grandTotal : formData.paidAmount,
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Purchase Invoice",
  });

  const handleSubmit = async (e, printAfterSave = false) => {
    e.preventDefault();

    if (!formData.partyId) return toast.error("Please select supplier");
    if (!formData.supplierBillNo)
      return toast.error("Supplier bill no required");

    const cleanedItems = formData.items
      .filter((item) => item.itemId && String(item.itemId).trim() !== "")
      .map((item) => ({
        itemId: item.itemId,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        total: (Number(item.quantity) || 0) * (Number(item.price) || 0),
      }));

    if (cleanedItems.length === 0)
      return toast.error("Please add at least one item");

    const finalTotal = cleanedItems.reduce((acc, curr) => acc + curr.total, 0);

    const payload = {
      ...formData,
      items: cleanedItems,
      totalAmount: finalTotal,
      paidAmount:
        formData.paymentMode === "cash"
          ? finalTotal
          : Number(formData.paidAmount) || 0,
    };

    try {
      setLoading(true);
      const res = await api.post("/purchase", payload);
      toast.success("Purchase saved successfully");

      setGeneratedPurchaseNo(res?.data?.data?.purchaseNumber || "");
      const purchaseId = res?.data?.data?._id;

      if (printAfterSave && purchaseId) {
        try {
          const detailRes = await api.get(`/purchase/${purchaseId}`);
          setCreatedPurchase(detailRes?.data?.data);
          setTimeout(() => {
            handlePrint();
          }, 1000);
        } catch (printErr) {
          toast.error("Print preparation failed");
        }
      }

      setTimeout(
        () => {
          setFormData({
            partyId: "",
            supplierBillNo: "",
            supplierBillDate: new Date().toISOString().split("T")[0],
            purchaseDate: new Date().toISOString().split("T")[0],
            items: [{ itemId: "", quantity: 1, price: 0, total: 0 }],
            totalAmount: 0,
            paymentMode: "credit",
            paidAmount: 0,
            notes: "",
          });
          setCreatedPurchase(null);
          fetchData();
        },
        printAfterSave ? 1600 : 100
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F6F8FC]">
        {/* FIXED ERP HEADER */}
        <div className="fixed top-[72px] left-0 lg:left-[280px] right-0 z-40 bg-[#F6F8FC]/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-4 md:px-6 xl:px-8 h-[92px] flex items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                <span className="uppercase tracking-[0.35em] text-[10px] font-black text-indigo-600">
                  Purchase / Entry
                </span>
              </div>
              <h1 className="text-[30px] xl:text-[34px] leading-none font-black tracking-tight text-slate-900">
                Create Purchase Entry
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={fetchData}
                className="h-11 w-11 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all"
              >
                <RefreshCcw
                  size={17}
                  className={`text-slate-500 ${syncing ? "animate-spin" : ""}`}
                />
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e, true)}
                className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Printer size={16} /> Save & Print
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e, false)}
                className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Save size={16} /> {loading ? "Saving..." : "Save Purchase"}
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-4 md:px-6 xl:px-8 pt-30 pb-10">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
            <div className="min-w-0 space-y-6">
              {/* SUPPLIER CARD */}
              <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-visible">
                <div className="h-[78px] px-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-[24px] font-black text-slate-900">
                      Supplier Details
                    </h2>
                    <p className="text-sm text-slate-400 font-semibold mt-1">
                      Supplier invoice & billing information
                    </p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Building2 size={18} className="text-indigo-600" />
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Supplier Name
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <SearchableSelect
                            options={supplierOptions}
                            value={formData.partyId}
                            onChange={(val) =>
                              setFormData({ ...formData, partyId: val })
                            }
                            placeholder="Search supplier..."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddSupplierPanel(true)}
                          className="h-14 w-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm shrink-0"
                        >
                          <UserPlus size={18} />
                        </button>
                      </div>
                      {selectedParty && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {selectedParty.phone && (
                            <div className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                              <Phone size={14} className="text-indigo-600" />
                              <span className="text-sm font-bold text-slate-700">
                                {selectedParty.phone}
                              </span>
                            </div>
                          )}
                          {selectedParty.email && (
                            <div className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                              <Mail size={14} className="text-violet-600" />
                              <span className="text-sm font-bold text-slate-700">
                                {selectedParty.email}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Supplier Bill No
                      </label>
                      <input
                        type="text"
                        value={formData.supplierBillNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            supplierBillNo: e.target.value,
                          })
                        }
                        placeholder="INV-10293"
                        className="w-full h-14 rounded-xl border border-slate-200 bg-white px-5 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            purchaseDate: e.target.value,
                          })
                        }
                        className="w-full h-14 rounded-xl border border-slate-200 bg-white px-5 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Supplier Bill Date
                      </label>
                      <input
                        type="date"
                        value={formData.supplierBillDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            supplierBillDate: e.target.value,
                          })
                        }
                        className="w-full h-14 rounded-xl border border-slate-200 bg-white px-5 font-black outline-none focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PURCHASE ITEMS */}
              <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-visible">
                <div className="h-[78px] px-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-[24px] font-black text-slate-900">
                      Purchase Items
                    </h2>
                    <p className="text-sm text-slate-400 font-semibold mt-1">
                      Add inventory products into invoice
                    </p>
                  </div>
                  <div className="h-11 px-4 rounded-xl bg-indigo-50 flex items-center gap-2">
                    <Package size={16} className="text-indigo-600" />
                    <span className="font-black text-sm text-indigo-700">
                      {formData.items.filter((i) => i.itemId).length} Items
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-indigo-200 hover:bg-white"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                        <div className="lg:col-span-6">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                            Product
                          </label>
                          <SearchableSelect
                            options={itemOptions}
                            value={item.itemId}
                            isItem={true}
                            onChange={(val) => {
                              handleItemChange(index, "itemId", val);
                              const isLastRow =
                                index === formData.items.length - 1;
                              if (isLastRow && val) {
                                setTimeout(() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    items: [
                                      ...prev.items,
                                      {
                                        itemId: "",
                                        quantity: 1,
                                        price: 0,
                                        total: 0,
                                      },
                                    ],
                                  }));
                                }, 100);
                              }
                            }}
                            placeholder="Search product..."
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-full h-14 rounded-xl border border-slate-200 bg-white px-4 text-center font-black outline-none"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                              ₹
                            </span>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(index, "price", e.target.value)
                              }
                              className="w-full h-14 rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-black outline-none"
                            />
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                            Total
                          </label>
                          <div className="h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                            ₹{item.total || 0}
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-full h-14 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        items: [
                          ...prev.items,
                          { itemId: "", quantity: 1, price: 0, total: 0 },
                        ],
                      }))
                    }
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add New Row
                  </button>
                </div>
              </div>
            </div>

            {/* SUMMARY RAIL */}
            <div className="hidden xl:block">
              <div className="sticky top-[180px]">
                <div className="rounded-[28px] overflow-hidden border border-indigo-100 bg-white shadow-2xl">
                  <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="uppercase tracking-[0.3em] text-[10px] font-black text-indigo-200 mb-2">
                          Purchase Summary
                        </p>
                        <h2 className="text-[28px] font-black">Total Amount</h2>
                      </div>
                      <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                        <IndianRupee size={24} />
                      </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight leading-none">
                      ₹{formData.totalAmount || 0}
                    </h1>
                  </div>

                  <div className="p-5 space-y-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Payment Mode
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paymentMode: "credit",
                              paidAmount: 0,
                            })
                          }
                          className={`h-13 py-3 rounded-xl font-black transition-all ${
                            formData.paymentMode === "credit"
                              ? "bg-indigo-600 text-white shadow-lg"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          Credit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paymentMode: "cash",
                              paidAmount: formData.totalAmount,
                            })
                          }
                          className={`h-13 py-3 rounded-xl font-black transition-all ${
                            formData.paymentMode === "cash"
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          Cash
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-3 block">
                        Paid Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          disabled={formData.paymentMode === "cash"}
                          value={formData.paidAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paidAmount: e.target.value,
                            })
                          }
                          className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 font-black outline-none"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-semibold">
                          Total Items
                        </span>
                        <span className="font-black">
                          {formData.items.filter((i) => i.itemId).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-semibold">
                          Balance Due
                        </span>
                        <span className="font-black text-rose-600">
                          ₹
                          {Math.max(
                            0,
                            formData.totalAmount - formData.paidAmount
                          )}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">
                          Grand Total
                        </span>
                        <span className="text-2xl font-black text-indigo-700">
                          ₹{formData.totalAmount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT AREA */}
      <div className="hidden">
        <div ref={printRef}>
          {createdPurchase && <PurchaseInvoiceA4 purchase={createdPurchase} />}
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatePurchase;
