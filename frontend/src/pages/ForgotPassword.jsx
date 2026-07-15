import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const PASSWORD_HINT =
  "At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "", newPassword: "", confirmNewPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", form);
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="card w-full max-w-md p-8">
        <h1 className="font-heading text-2xl font-bold text-cardtext mb-1">Reset Password</h1>
        <p className="text-gray-500 mb-6">
          Enter your registered email and choose a new password.
        </p>

        {error && (
          <div className="bg-red-50 text-danger text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
        )}
        {message && (
          <div className="bg-green-50 text-success text-sm px-4 py-2 rounded-lg mb-4">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Registered Email"
            value={form.email}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="password"
            name="newPassword"
            required
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="password"
            name="confirmNewPassword"
            required
            placeholder="Confirm New Password"
            value={form.confirmNewPassword}
            onChange={handleChange}
            className="input-field"
          />
          <p className="text-xs text-gray-400">{PASSWORD_HINT}</p>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}