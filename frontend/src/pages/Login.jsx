import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-bg">
      {/* Left illustration */}
      <div className="hidden md:flex items-center justify-center bg-blue-50 p-12">
        <div className="text-center max-w-sm">
          <div className="text-8xl mb-6">🚩</div>
          <h2 className="font-heading text-2xl font-bold text-cardtext mb-2">
            Climb toward your dream career
          </h2>
          <p className="text-gray-500">
            Personalized recommendations, one step at a time.
          </p>
        </div>
      </div>

      {/* Right login card */}
      <div className="flex items-center justify-center p-6">
        <div className="card w-full max-w-md p-8">
          <h1 className="font-heading text-2xl font-bold text-cardtext mb-1">Welcome Back!</h1>
          <p className="text-gray-500 mb-6">Login to your CareerPath AI account.</p>

          {error && (
            <div className="bg-red-50 text-danger text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email or Username</label>
              <input
                type="text"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="input-field mt-1 pr-16"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" /> Remember Me
              </label>
              <Link to="/forgot-password" className="text-primary font-medium">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold">Sign Up</Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            <Link to="/admin-login">Login as Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
