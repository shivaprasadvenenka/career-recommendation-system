import { useEffect, useState } from "react";
import api from "../api/axios";
import CareerCard from "../components/CareerCard";
import NoResults from "./NoResults";

export default function Dashboard() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ skills: "", city: "", salary: "", role: "" });

  const fetchCareers = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get("/careers", { params });
      setCareers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.skills) params.skills = filters.skills;
    if (filters.city && filters.city !== "All Cities") params.city = filters.city;
    if (filters.salary && filters.salary !== "Any") params.salary = filters.salary;
    if (filters.role && filters.role !== "All Roles") params.role = filters.role;
    fetchCareers(params);
  };

  const clearFilters = () => {
    setFilters({ skills: "", city: "", salary: "", role: "" });
    fetchCareers();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <h1 className="font-heading text-2xl font-bold text-cardtext mb-6">Explore Career Paths</h1>

      <form onSubmit={handleSearch} className="card p-5 flex flex-wrap gap-4 items-end mb-10">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-gray-400 font-medium">Search Skills</label>
          <input
            className="input-field mt-1"
            placeholder="e.g. Python, React"
            value={filters.skills}
            onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
          />
        </div>

        <div className="min-w-[150px]">
          <label className="text-xs text-gray-400 font-medium">City</label>
          <select
            className="input-field mt-1"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          >
            <option>All Cities</option>
            <option>Bangalore</option>
            <option>Hyderabad</option>
            <option>Pune</option>
            <option>Mumbai</option>
            <option>Any</option>
          </select>
        </div>

        <div className="min-w-[150px]">
          <label className="text-xs text-gray-400 font-medium">Min Salary (LPA)</label>
          <select
            className="input-field mt-1"
            value={filters.salary}
            onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
          >
            <option>Any</option>
            <option value="5">5+</option>
            <option value="10">10+</option>
            <option value="15">15+</option>
            <option value="20">20+</option>
          </select>
        </div>

        <div className="min-w-[170px]">
          <label className="text-xs text-gray-400 font-medium">Role</label>
          <select
            className="input-field mt-1"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option>All Roles</option>
            <option>Data Scientist</option>
            <option>Machine Learning Engineer</option>
            <option>Backend Developer</option>
            <option>Frontend Developer</option>
            <option>Full Stack Developer</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <p className="text-gray-400">Loading careers...</p>
      ) : careers.length === 0 ? (
        <NoResults onClear={clearFilters} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <CareerCard key={career._id} career={career} />
          ))}
        </div>
      )}
    </div>
  );
}
