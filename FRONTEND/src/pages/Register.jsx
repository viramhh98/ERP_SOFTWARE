import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Input change handler
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // API call to backend
      const response = await api.post('/auth/signup', formData);
      
      if (response.status === 201 || response.status === 200) {
        navigate('/'); // Login page par redirect karein
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMsg, {
        duration: 4000, // Error ko thoda zyada time dete hain
      });
    } finally {
      setLoading(false);
    }
    }
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border-t-4 border-green-600">
        
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
            <p className="mt-2 text-slate-500">Register to access ERP Dashboard</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <input 
                name="name"
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 transition-all"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
              <input 
                name="email"
                type="email" 
                placeholder="admin@erp.com" 
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 transition-all"
                required
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white shadow-lg shadow-green-100 transition-all hover:bg-green-700 active:scale-[0.98]"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/" className="font-bold text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
