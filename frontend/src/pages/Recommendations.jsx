import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import NoResults from "./NoResults";

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/recommendations")
      .then(({ data }) => setRecs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-28 text-center text-gray-400">Loading recommendations...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <h1 className="font-heading text-2xl font-bold text-cardtext mb-6">
        Your Personalized Recommendations
      </h1>

      {recs.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {recs.map(({ career, matchPercent, missingSkills }) => (
            <div key={career._id} className="card p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-heading font-bold text-lg text-cardtext">{career.name}</h3>
                <span className="text-primary font-bold">{matchPercent}%</span>
              </div>

              <p className="text-xs font-semibold text-gray-400 mb-1">REQUIRED SKILLS</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {career.requiredSkills.map((s) => (
                  <span key={s} className="text-xs bg-blue-50 text-primary px-2 py-1 rounded-md">{s}</span>
                ))}
              </div>

              {missingSkills.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-400 mb-1">MISSING SKILLS</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {missingSkills.map((s) => (
                      <span key={s} className="text-xs bg-amber-50 text-warning px-2 py-1 rounded-md">{s}</span>
                    ))}
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Salary: <b className="text-cardtext">{career.averageSalary} LPA</b></span>
                <span className="text-gray-500">Growth: <b className="text-cardtext">{career.growth}</b></span>
              </div>

              <button onClick={() => navigate(`/careers/${career._id}`)} className="btn-primary w-full">
                Explore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
