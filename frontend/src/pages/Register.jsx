import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  highestEducation: "",
  collegeName: "",
  graduationYear: "",
  cgpa: "",
  skills: "",
  preferredRole: "",
  preferredLocation: "",
  password: "",
  confirmPassword: "",
};

// Min 8 chars, at least one uppercase, one lowercase, one number, one special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_HINT =
  "At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.";

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const required = ["fullName", "email", "password", "confirmPassword"];
    for (const field of required) {
      if (!form[field]) {
        setError("Please fill all required fields.");
        return;
      }
    }
    if (!PASSWORD_REGEX.test(form.password)) {
      setError(PASSWORD_HINT);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-bg py-10">
      {/* Left form card */}
      <div className="flex items-center justify-center p-6 order-2 md:order-1">
        <div className="card w-full max-w-lg p-8">
          <h1 className="font-heading text-2xl font-bold text-cardtext mb-1">Create Your Account</h1>
          <p className="text-gray-500 mb-6">Join CareerPath AI and find your path.</p>

          {error && (
            <div className="bg-red-50 text-danger text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} className="input-field sm:col-span-2" />
            <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className="input-field" />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="input-field" />

            <select name="highestEducation" value={form.highestEducation} onChange={handleChange} className="input-field">
              <option value="">Highest Education</option>
              <option>High School</option>
              <option>Diploma</option>
              <option>Bachelor's</option>
              <option>Master's</option>
              <option>PhD</option>
            </select>
            <input name="collegeName" placeholder="College Name" value={form.collegeName} onChange={handleChange} className="input-field" />

            <input name="graduationYear" type="number" placeholder="Graduation Year" value={form.graduationYear} onChange={handleChange} className="input-field" />
            <input name="cgpa" type="number" step="0.01" placeholder="CGPA" value={form.cgpa} onChange={handleChange} className="input-field" />

            <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="input-field sm:col-span-2" />

            <input name="preferredRole" placeholder="Preferred Role" value={form.preferredRole} onChange={handleChange} className="input-field" />
            <input name="preferredLocation" placeholder="Preferred Location" value={form.preferredLocation} onChange={handleChange} className="input-field" />

            <input name="password" type="password" placeholder="Create Password" required value={form.password} onChange={handleChange} className="input-field" />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" required value={form.confirmPassword} onChange={handleChange} className="input-field" />
            <p className="text-xs text-gray-400 sm:col-span-2 -mt-2">{PASSWORD_HINT}</p>

            <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">Login</Link>
          </p>
        </div>
      </div>

      {/* Right illustration */}
      <div className="hidden md:flex items-center justify-center bg-blue-50 p-12 order-1 md:order-2">
        <div className="text-center max-w-sm">
          <div className="text-8xl mb-6">🧑‍💻</div>
          <h2 className="font-heading text-2xl font-bold text-cardtext mb-2">
            Let's build your profile
          </h2>
          <p className="text-gray-500">
            The more we know, the better we can recommend.
          </p>
        </div>
      </div>
    </div>
  );
}
