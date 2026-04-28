import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          // Global settings
          className: 'font-sans font-bold text-sm',
          // 🔥 Success specific duration
          success: {
            duration: 4000, 
            theme: {
              primary: '#10b981',
            },
          },
          // 🔥 Error specific duration
          error: {
            duration: 5000, // Errors ko thoda aur zyada time dena chahiye
          },
        }}
      />
      <AppRoutes />
    </Router>
  );
}

export default App;
