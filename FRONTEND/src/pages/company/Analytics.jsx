import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Target, 
  Layers, Zap, Calendar, Filter 
} from "lucide-react";

const Analytics = () => {
  const [data, setData] = useState({ salesData: [], pieData: [], summary: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { activecompanyid: localStorage.getItem('activeCompanyId') } };
        const [salesRes, stockRes] = await Promise.all([
          api.get("/sales", config),
          api.get("/stock", config)
        ]);

        const sales = salesRes.data.data || [];
        const stock = stockRes.data.data || [];

        // 📊 Logic 1: Pichle 7 din ka sales data prepare karna
        const chartMapped = sales.slice(0, 7).map(s => ({
          date: new Date(s.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          amount: s.totalAmount
        })).reverse();

        // 🥧 Logic 2: Top 5 Items for Pie Chart
        const pieMapped = stock.slice(0, 5).map(s => ({
          name: s.itemId?.name.substring(0, 10),
          value: s.quantity
        }));

        setData({ salesData: chartMapped, pieData: pieMapped });
      } catch (err) {
        toast.error("Analytics sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-inter text-slate-700">
        
        {/* --- HEADER --- */}
        <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Business Intelligence</h1>
            <p className="text-slate-500 font-medium mt-1">Advanced data visualization for performance tracking.</p>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm"><Calendar size={14}/> 7 Days</button>
             <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-200 flex items-center gap-2"><Filter size={14}/> Export Report</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* --- TOP ROW: PERFORMANCE CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20"><Zap size={80}/></div>
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Growth Velocity</p>
                <h2 className="text-4xl font-black mt-2 tracking-tighter">84.2%</h2>
                <div className="mt-4 flex items-center gap-1 text-emerald-300 font-bold text-xs">
                  <ArrowUpRight size={14}/> 12% higher than last week
                </div>
             </div>
             
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Sales Target</p>
                <h2 className="text-4xl font-black mt-2 text-slate-800 tracking-tighter">₹2.4M</h2>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
                   <div className="bg-emerald-500 h-full w-[65%]"></div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2">65% of monthly goal achieved</p>
             </div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Operational Efficiency</p>
                  <h2 className="text-4xl font-black mt-2 text-slate-800 tracking-tighter">98.4%</h2>
                </div>
                <Target size={48} className="text-indigo-100" />
             </div>
          </div>

          {/* --- MIDDLE ROW: MAIN CHARTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Revenue Trend Line Chart */}
            <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-10 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" /> Revenue Stream (Last 7 Entries)
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salesData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inventory Distribution Pie Chart */}
            <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                <Layers size={18} className="text-amber-500" /> Top SKU Volume
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                 {data.pieData.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                        <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-900">{item.value} units</span>
                   </div>
                 ))}
              </div>
            </div>

          </div>

          {/* --- BOTTOM ROW: BAR CHART --- */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-10 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-500" /> Daily Volume Comparison
             </h3>
             <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                    <Bar dataKey="amount" fill="#6366f1" radius={[10, 10, 10, 10]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
