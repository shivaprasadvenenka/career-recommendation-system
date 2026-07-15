import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { profilePath } from "../utils/slug";

export default function Profile() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/me").then(({ data }) => {
      setForm({ ...data, skills: (data.skills || []).join(", "), password: "" });

      // Keep the URL in sync with the user's name, e.g. /profile/rahul-sharma
      const correctPath = profilePath(data);
      if (correctPath !== `/profile/${username || ""}` && correctPath !== "/profile") {
        navigate(correctPath, { replace: true });
      }
    });
  }, [username, navigate]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await api.put("/users/me", payload);
      setForm({ ...data, skills: (data.skills || []).join(", "), password: "" });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
    }
  };

  if (!form) return <div className="pt-28 text-center text-gray-400">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <div className="card p-8">
        <h1 className="font-heading text-2xl font-bold text-cardtext mb-6">Your Profile</h1>

        {message && <div className="bg-blue-50 text-primary text-sm px-4 py-2 rounded-lg mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Name" value={form.fullName || ""} onChange={handleChange} className="input-field sm:col-span-2" />
          <input name="phone" placeholder="Phone" value={form.phone || ""} onChange={handleChange} className="input-field" />
          <input name="highestEducation" placeholder="Education" value={form.highestEducation || ""} onChange={handleChange} className="input-field" />
          <input name="skills" placeholder="Skills (comma separated)" value={form.skills || ""} onChange={handleChange} className="input-field sm:col-span-2" />
          <input name="preferredRole" placeholder="Preferred Role" value={form.preferredRole || ""} onChange={handleChange} className="input-field" />
          <input name="preferredLocation" placeholder="Preferred Location" value={form.preferredLocation || ""} onChange={handleChange} className="input-field" />
          <input name="password" type="password" placeholder="New Password (optional)" value={form.password || ""} onChange={handleChange} className="input-field sm:col-span-2" />

          <button type="submit" className="btn-primary sm:col-span-2">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
