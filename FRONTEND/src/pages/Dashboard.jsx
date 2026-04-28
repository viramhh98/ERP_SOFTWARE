// import React from 'react';
// import MainLayout from '../layouts/MainLayout';
// import { TrendingUp, Users, Package, AlertCircle, MoreVertical } from 'lucide-react';

// const Dashboard = () => {
//   const stats = [
//     { label: 'Total Revenue', value: '$54,230', trend: '+12.5%', icon: <TrendingUp size={20}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//     { label: 'Active Orders', value: '124', trend: '+3.2%', icon: <Users size={20}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
//     { label: 'Total Products', value: '1,432', trend: '-2.1%', icon: <Package size={20}/>, color: 'text-purple-600', bg: 'bg-purple-50' },
//     { label: 'Pending Issues', value: '12', trend: 'Critical', icon: <AlertCircle size={20}/>, color: 'text-rose-600', bg: 'bg-rose-50' },
//   ];

//   return (
//     <MainLayout title="Dashboard Overview">
//       {/* 1. Stats Grid - High Visual Impact */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, i) => (
//           <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
//             <div className="flex justify-between items-start">
//               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
//                 {stat.icon}
//               </div>
//               <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
//                 {stat.trend}
//               </span>
//             </div>
//             <div className="mt-4">
//               <p className="text-sm font-medium text-slate-500">{stat.label}</p>
//               <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 2. Recent Transactions Table UI */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
//           <h3 className="font-bold text-slate-800">Recent Transactions</h3>
//           <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20}/></button>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
//               <tr>
//                 <th className="px-6 py-4 font-semibold">Customer</th>
//                 <th className="px-6 py-4 font-semibold">Status</th>
//                 <th className="px-6 py-4 font-semibold">Date</th>
//                 <th className="px-6 py-4 font-semibold text-right">Amount</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 text-sm">
//               {[1, 2, 3].map((_, i) => (
//                 <tr key={i} className="hover:bg-slate-50/50 transition-colors">
//                   <td className="px-6 py-4 font-medium text-slate-700">Client Name #{i+1}</td>
//                   <td className="px-6 py-4">
//                     <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Completed</span>
//                   </td>
//                   <td className="px-6 py-4 text-slate-500">Oct 24, 2023</td>
//                   <td className="px-6 py-4 text-right font-bold text-slate-700">$1,200.00</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="p-4 bg-slate-50/50 text-center border-t border-slate-100">
//           <button className="text-blue-600 text-sm font-semibold hover:underline">View All Transactions</button>
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import toast from "react-hot-toast";
import { 
  TrendingUp, Wallet, Package, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, IndianRupee, ShoppingCart, 
  ChevronRight, Clock, Box
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalStockValue: 0,
    receivables: 0,
    payables: 0,
    lowStock: [],
    recentSales: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          activecompanyid: localStorage.getItem('activeCompanyId'),
          activebranchid: localStorage.getItem('activeBranchId'),
        }
      };

      // 🔥 EXISITING LINKS SE DATA FETCH KARNA
      const [salesRes, stockRes, partiesRes] = await Promise.all([
        api.get("/sales", config),
        api.get("/stock", config),
        api.get("/party/filter?type=all", config)
      ]);

      // 1. Total Revenue from Sales History
      const salesData = salesRes.data.data || [];
      const totalRevenue = salesData.reduce((acc, curr) => acc + curr.totalAmount, 0);

      // 2. Inventory Value & Low Stock from Stock API
      const stockData = stockRes.data.data || [];
      const inventoryVal = stockData.reduce((acc, curr) => acc + (curr.quantity * (curr.itemId?.costPrice || 0)), 0);
      const criticalStock = stockData.filter(s => s.quantity < 5);

      // 3. Receivables & Payables (Conceptual - iske liye ledger aggregate best hota hai, 
      // par abhi hum party list se concept le rahe hain)
      // NOTE: Real finance mein humein ledger summary chahiye hogi.
      
      setStats({
        totalSales: totalRevenue,
        totalStockValue: inventoryVal,
        lowStock: criticalStock,
        recentSales: salesData.slice(0, 5), // Sirf top 5
      });
    } catch (err) {
      toast.error("Dashboard sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-inter text-slate-700">
        
        {/* --- 1. WELCOME HEADER --- */}
        <div className="max-w-7xl mx-auto mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 font-medium">Real-time operational metrics for your active branch.</p>
        </div>

        {/* --- 2. KPI GRID --- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={20}/></div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Revenue</p>
              <h2 className="text-2xl font-black text-slate-900">₹{stats.totalSales.toLocaleString()}</h2>
            </div>
          </div>

          {/* Inventory Value */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Package size={20}/></div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Assets</p>
              <h2 className="text-2xl font-black text-slate-900">₹{stats.totalStockValue.toLocaleString()}</h2>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl"><AlertTriangle size={20}/></div>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Critical SKUs</p>
              <h2 className="text-2xl font-black">{stats.lowStock.length} Items</h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl flex flex-col justify-between text-white">
            <div className="flex justify-between items-start text-indigo-200">
               <ShoppingCart size={24} />
               <ArrowUpRight size={20} />
            </div>
            <div className="mt-4 cursor-pointer">
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Action Center</p>
              <h2 className="text-xl font-black">New Bill Entry</h2>
            </div>
          </div>
        </div>

        {/* --- 3. MAIN CONTENT: RECENT SALES & LOW STOCK --- */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Transactions Table */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest flex items-center gap-2">
                <Clock size={16} className="text-indigo-500" /> Recent Invoices
              </h3>
              <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full">
                 <tbody className="divide-y divide-slate-50">
                    {stats.recentSales.map((sale, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-5">
                          <span className="text-sm font-bold text-slate-700">{sale.partyId?.name || "Cash Customer"}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${sale.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                             {sale.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-slate-900">₹{sale.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>

          {/* Low Stock Alerts Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 flex items-center gap-2 text-rose-500">
                  <Box size={16} /> Re-order Required
                </h3>
                <div className="space-y-4">
                   {stats.lowStock.slice(0, 4).map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="text-sm font-black text-slate-700">{item.itemId?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">Stock: {item.quantity}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                     </div>
                   ))}
                   {stats.lowStock.length === 0 && <p className="text-xs font-bold text-slate-400 text-center py-10">All stock levels are healthy.</p>}
                </div>
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
