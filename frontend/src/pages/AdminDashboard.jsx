import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [activityLogs, setActivityLogs] = useState([]);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityAction, setActivityAction] = useState("all");
  const [actionTypes, setActionTypes] = useState([]);
  const [activityPage, setActivityPage] = useState(1);
  const [activityPages, setActivityPages] = useState(1);

  const loadStats = () => api.get("/admin/stats").then(({ data }) => setStats(data));

  const loadUsers = (p = 1, s = search, per = period) =>
    api
      .get("/admin/users", { params: { page: p, search: s, period: per } })
      .then(({ data }) => {
        setUsers(data.users);
        setPages(data.pages);
        setPage(data.page);
      });

  const loadActivity = (p = 1, s = activitySearch, a = activityAction) =>
    api
      .get("/admin/activity", { params: { page: p, search: s, action: a } })
      .then(({ data }) => {
        setActivityLogs(data.logs);
        setActivityPages(data.pages);
        setActivityPage(data.page);
        setActionTypes(data.actionTypes);
      });

  useEffect(() => {
    loadStats();
    loadUsers(1, "", "all");
    loadActivity(1, "", "all");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(1, search, period);
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
    loadUsers(1, search, value);
  };

  const toggleBlock = async (id) => {
    await api.put(`/admin/users/${id}/block`);
    loadUsers(page, search, period);
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers(page, search, period);
  };

  const handleActivitySearch = (e) => {
    e.preventDefault();
    loadActivity(1, activitySearch, activityAction);
  };

  const handleActivityActionChange = (value) => {
    setActivityAction(value);
    loadActivity(1, activitySearch, value);
  };

  const statCards = stats
    ? [
        { label: "Total Members", value: stats.totalUsers, icon: "🧑‍🤝‍🧑" },
        { label: "Active Members", value: stats.activeUsers, icon: "✅" },
        { label: "Logged in This Week", value: stats.thisWeekLogins, icon: "📅" },
        { label: "Logged in This Month", value: stats.thisMonthLogins, icon: "🗓️" },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <h1 className="font-heading text-2xl font-bold text-cardtext mb-6">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((c) => (
          <div key={c.label} className="card p-6 flex items-center gap-4">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <p className="text-2xl font-bold text-cardtext">{c.value}</p>
              <p className="text-xs text-gray-400">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-heading font-semibold text-lg text-cardtext mb-4">All Members</h2>

        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 font-medium">Search</label>
            <input
              className="input-field mt-1"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="min-w-[180px]">
            <label className="text-xs text-gray-400 font-medium">Login Activity</label>
            <select
              className="input-field mt-1"
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
            >
              <option value="all">All Members</option>
              <option value="week">Logged in This Week</option>
              <option value="month">Logged in This Month</option>
            </select>
          </div>

          <button className="btn-primary" type="submit">Search</button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Education</th>
                <th className="py-2 pr-4">Skills</th>
                <th className="py-2 pr-4">Last Active</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium text-cardtext">{u.fullName}</td>
                  <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                  <td className="py-3 pr-4 text-gray-500">{u.highestEducation || "-"}</td>
                  <td className="py-3 pr-4 text-gray-500">{(u.skills || []).join(", ") || "-"}</td>
                  <td className="py-3 pr-4 text-gray-500">
                    {u.lastActive ? new Date(u.lastActive).toLocaleString() : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        u.status === "active"
                          ? "bg-green-50 text-success"
                          : u.status === "blocked"
                          ? "bg-red-50 text-danger"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 space-x-2 whitespace-nowrap">
                    <button onClick={() => toggleBlock(u._id)} className="text-primary font-medium">
                      {u.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="text-danger font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">No members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex gap-2 justify-center mt-6">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => loadUsers(p, search, period)}
                className={`w-8 h-8 rounded-md text-sm font-medium ${
                  p === page ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6 mt-10">
        <h2 className="font-heading font-semibold text-lg text-cardtext mb-4">Activity Log</h2>

        <form onSubmit={handleActivitySearch} className="flex flex-wrap gap-3 mb-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-gray-400 font-medium">Search</label>
            <input
              className="input-field mt-1"
              placeholder="Search by name or email"
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
            />
          </div>

          <div className="min-w-[180px]">
            <label className="text-xs text-gray-400 font-medium">Action</label>
            <select
              className="input-field mt-1"
              value={activityAction}
              onChange={(e) => handleActivityActionChange(e.target.value)}
            >
              <option value="all">All Actions</option>
              {actionTypes.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <button className="btn-primary" type="submit">Search</button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Details</th>
                <th className="py-2 pr-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log) => (
                <tr key={log._id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium text-cardtext">{log.fullName}</td>
                  <td className="py-3 pr-4 text-gray-500">{log.email}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-primary">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{log.details || "-"}</td>
                  <td className="py-3 pr-4 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {activityLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">No activity found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {activityPages > 1 && (
          <div className="flex gap-2 justify-center mt-6">
            {Array.from({ length: activityPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => loadActivity(p, activitySearch, activityAction)}
                className={`w-8 h-8 rounded-md text-sm font-medium ${
                  p === activityPage ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}