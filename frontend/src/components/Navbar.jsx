import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profilePath } from "../utils/slug";   // ADD THIS LINE

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate(isAdmin ? "/admin-login" : "/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: logo */}
        <Link to={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/logo.svg" alt="CareerPath AI logo" className="w-9 h-9 rounded-lg" />
          <span className="font-heading font-bold text-lg text-cardtext">
            CareerPath <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Center: nav links — hidden entirely for admin */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        )}

        {isAdmin && (
          <div className="hidden md:flex items-center gap-2 font-medium text-primary">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-sm">Admin Panel</span>
          </div>
        )}

        {/* Right: auth actions */}
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg border border-primary text-primary font-semibold hover:bg-blue-50 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}

          {user && !isAdmin && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium">Dashboard</Link>
              <Link to={profilePath(user)} className="text-gray-600 hover:text-primary font-medium">Profile</Link>
              <Link to="/notifications" className="text-gray-600 hover:text-primary font-medium">Notifications</Link>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </>
          )}

          {isAdmin && (
            <button onClick={handleLogout} className="btn-primary">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}
