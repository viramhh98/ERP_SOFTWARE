import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { ERP_MODULES } from '../../utils/constants';
import api from '../../services/api';
import toast from 'react-hot-toast'; // 🔥 Import Toast
import { 
  ShieldCheck, Save, CheckCircle2, Circle, Trash2, 
  ShieldAlert, KeyRound, ListFilter, AlertTriangle, X, RefreshCcw 
} from 'lucide-react';

const CreateRole = () => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ 
    isOpen: false, 
    role: null, 
    affectedUsers: [],
    targetRoleId: '',
    isDeleting: false
  });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/role');
      setRolesList(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleToggleAction = (module, action) => {
    setPermissions((prev) => {
      const existingModule = prev.find((p) => p.module === module);
      if (existingModule) {
        const updatedActions = existingModule.actions.includes(action)
          ? existingModule.actions.filter((a) => a !== action)
          : [...existingModule.actions, action];
        return updatedActions.length === 0 
          ? prev.filter((p) => p.module !== module)
          : prev.map((p) => (p.module === module ? { ...p, actions: updatedActions } : p));
      }
      return [...prev, { module, actions: [action] }];
    });
  };

  const isChecked = (module, action) => {
    return permissions.find((p) => p.module === module)?.actions.includes(action);
  };

  const handleSubmit = async () => {
    if (!roleName) return toast.error("Enter a role name");
    if (permissions.length === 0) return toast.error("Select at least one permission");

    try {
      await api.post('/role', { name: roleName.toUpperCase(), permissions });
      toast.success("Role created successfully!"); // 🔥 No Alert
      setRoleName('');
      setPermissions([]);
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create role");
    }
  };

  const openDeleteModal = async (role) => {
    if (role.name === 'OWNER') return toast.error("The OWNER role is protected");
    try {
      const res = await api.get(`/user-company-role/usersbyrole/${role._id}`);
      setDeleteModal({ 
        isOpen: true, 
        role, 
        affectedUsers: res.data, 
        targetRoleId: '',
        isDeleting: false 
      });
    } catch (err) {
      toast.error("Failed to fetch affected users");
    }
  };

  const handleFinalDelete = async () => {
    const { role, affectedUsers, targetRoleId } = deleteModal;
    
    if (affectedUsers.length > 0 && !targetRoleId) {
      return toast.error("Select a replacement role first!");
    }

    setDeleteModal(prev => ({ ...prev, isDeleting: true }));

    try {
      if (affectedUsers.length > 0) {
        for (const user of affectedUsers) {
          await api.post('/user-company-role/update-role', {
            userId: user.id,
            curr_roleId: role._id,
            new_roleId: targetRoleId
          });
        }
      }

      await api.delete(`/role/${role._id}`);
      setRolesList((prev) => prev.filter((r) => r._id !== role._id));

      toast.success("Users migrated and role removed!"); // 🔥 No Alert
      setDeleteModal({ isOpen: false, role: null, affectedUsers: [], targetRoleId: '', isDeleting: false });

    } catch (err) {
      toast.error("Action failed! Check console.");
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <MainLayout title="Access Control">
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6 h-[calc(100vh-140px)] items-stretch">
        
        {/* LEFT PANEL */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><KeyRound size={28} /></div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Access Matrix</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Manage Permissions</p>
              </div>
            </div>
            <div className="flex items-center bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <input type="text" placeholder="ROLE NAME..." value={roleName} onChange={(e) => setRoleName(e.target.value)} className="bg-transparent px-4 py-1 outline-none font-bold text-slate-700 w-56 text-base" />
              <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-sm uppercase transition-all"><Save size={18} /> Save</button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between bg-slate-50/50 px-10">
              <span className="text-xs font-black text-slate-500 uppercase tracking-[2px]">Module</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-[2px]">Scope</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar px-2">
              {ERP_MODULES.map((mod) => (
                <div key={mod.id} className="group flex flex-col md:flex-row items-center p-8 hover:bg-blue-50/30 transition-all px-10">
                  <div className="w-full md:w-1/3"><h4 className="font-bold text-slate-800 text-base">{mod.name}</h4><p className="text-[11px] font-bold text-slate-400 uppercase">{mod.id}</p></div>
                  <div className="w-full md:w-2/3 flex flex-wrap gap-3 justify-end">
                    {mod.actions.map((action) => (
                      <button key={action} onClick={() => handleToggleAction(mod.id, action)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${isChecked(mod.id, action) ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}>
                        {isChecked(mod.id, action) ? <CheckCircle2 size={16} /> : <Circle size={16} />}{action.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 lg:col-span-4 flex flex-col h-full overflow-hidden">
          <div className="bg-slate-50 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="p-7 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3"><div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><ShieldCheck size={24} /></div><h3 className="text-slate-800 font-extrabold text-lg">Registry</h3></div>
              <span className="text-[11px] bg-blue-600 text-white px-4 py-1.5 rounded-full font-black uppercase shadow-md">{rolesList.length} Active</span>
            </div>
            <div className="flex-1 overflow-y-auto p-7 space-y-5 custom-scrollbar bg-slate-50/50">
              {loading ? <p className="text-center animate-pulse text-xs font-bold text-slate-400">Syncing...</p> : rolesList.map((role) => (
                <div key={role._id} className="group p-6 rounded-[1.5rem] bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-sm font-black text-slate-800 uppercase">{role.name}</span>
                    {role.name !== 'OWNER' && (
                      <button onClick={() => openDeleteModal(role)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((p, i) => <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-md border border-slate-200 uppercase">{p.module}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-50/30">
              <div className="flex items-center gap-3 text-rose-600"><AlertTriangle size={24} /><h3 className="font-black uppercase text-lg">System Warning</h3></div>
              <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="p-2 hover:bg-rose-100 rounded-full text-rose-400 transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center"><p className="text-slate-500 text-sm font-medium">Deleting role:</p><h4 className="text-2xl font-black text-slate-800 uppercase tracking-widest">{deleteModal.role?.name}</h4></div>
              {deleteModal.affectedUsers.length > 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start gap-3"><RefreshCcw className="text-amber-600 mt-1" size={20} /><div><p className="text-amber-900 font-bold text-sm">Action Required!</p><p className="text-amber-700 text-xs mt-1">Migration needed for <b>{deleteModal.affectedUsers.length} users</b>.</p></div></div>
                  <select value={deleteModal.targetRoleId} onChange={(e) => setDeleteModal({...deleteModal, targetRoleId: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none">
                    <option value="">Select Replacement Role...</option>
                    {rolesList.filter(r => r._id !== deleteModal.role?._id).map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                  </select>
                </div>
              ) : <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center font-bold text-emerald-700 text-sm">Role is idle. Safe to delete.</div>}
              <div className="flex gap-3"><button onClick={() => setDeleteModal({...deleteModal, isOpen: false})} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button><button onClick={handleFinalDelete} disabled={deleteModal.isDeleting} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all disabled:opacity-50"><Trash2 size={16} />{deleteModal.isDeleting ? "Processing..." : "Confirm"}</button></div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CreateRole;
