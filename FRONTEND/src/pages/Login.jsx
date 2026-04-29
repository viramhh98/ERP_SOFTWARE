// import React, { useState } from "react";
// import api from "../services/api";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast"; // ✅ Yeh import missing tha!

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await api.post("/auth/login", { email, password });
      
//       // Save details
//       localStorage.setItem("erp_token", response.data.token);
//       localStorage.setItem("userName", response.data.user.name); 

//       // 🔥 Success Toast (Isme humne 2-3 seconds fix kar diye hain)
//       toast.success(`Welcome back, ${response.data.user.name}!`, {
//         duration: 3000, 
//       });
      
//       console.log("Login Successful, redirecting...");
      
//       // Redirect to dashboard
//       navigate("/dashboard");
      
//     } catch (error) {
//       const errorMsg = error.response?.data?.message || "Invalid email or password";
//       console.error("Login Error:", errorMsg);
      
//       // 🔥 Error Toast
//       toast.error(errorMsg, {
//         duration: 4000, // Error ko thoda zyada time dete hain
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 font-sans">
//       <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-200">
//         {/* Top Accent Bar */}
//         <div className="h-2 bg-blue-600"></div>
        
//         <div className="p-10">
//           <div className="text-center mb-10">
//             <h1 className="text-4xl font-black text-slate-800 tracking-tight">ERP PRO</h1>
//             <p className="mt-3 text-slate-500 font-medium text-sm">Access your business dashboard</p>
//           </div>
          
//           <form onSubmit={handleLogin} className="space-y-6">
//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[2px]">Email Address</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="admin@company.com"
//                 required
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-slate-700"
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[2px]">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 required
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-slate-700"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 py-4 rounded-2xl font-bold text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   <span>Signing in...</span>
//                 </>
//               ) : (
//                 "Login to Dashboard"
//               )}
//             </button>
//           </form>

//           <div className="mt-10 text-center">
//             <p className="text-slate-500 font-medium text-sm">
//               Don't have an account?{" "}
//               <Link
//                 to="/register"
//                 className="text-blue-600 font-black hover:underline underline-offset-4"
//               >
//                 Create Account
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;













import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google"; // ✅ Google Auth import

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // Traditional Email/Password Login
  // ----------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Save details
      localStorage.setItem("erp_token", response.data.token);
      localStorage.setItem("userName", response.data.user.name); 

      toast.success(`Welcome back, ${response.data.user.name}!`, {
        duration: 3000, 
      });
      
      navigate("/dashboard");
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid email or password";
      toast.error(errorMsg, {
        duration: 4000, 
      });
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Google OAuth Login
  // ----------------------------------------
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Sending the token to the backend route we created earlier
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      // Save details (same logic as traditional login)
      localStorage.setItem("erp_token", response.data.token);
      localStorage.setItem("userName", response.data.user.name);

      toast.success(`Welcome back, ${response.data.user.name}!`, {
        duration: 3000,
      });

      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Google Authentication failed";
      toast.error(errorMsg, {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login Failed. Please try again.", {
      duration: 4000,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 font-sans">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-200">
        {/* Top Accent Bar */}
        <div className="h-2 bg-blue-600"></div>
        
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">ERP PRO</h1>
            <p className="mt-3 text-slate-500 font-medium text-sm">Access your business dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[2px]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-[2px]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 py-4 rounded-2xl font-bold text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>

          {/* 🔥 Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-400 font-black tracking-widest text-[10px] uppercase">
                Or continue with
              </span>
            </div>
          </div>

          {/* 🔥 Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap // Shows a neat popup if the user has logged in before
              shape="rectangular"
              size="large"
              text="signin_with"
            />
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-black hover:underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;