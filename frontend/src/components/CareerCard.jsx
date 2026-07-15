import { useNavigate } from "react-router-dom";

export default function CareerCard({ career }) {
  const navigate = useNavigate();

  return (
    <div className="card p-6 flex flex-col justify-between hover:-translate-y-1 transform transition-transform duration-300">
      <div>
        <h3 className="font-heading font-bold text-lg text-cardtext mb-2">{career.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">{career.description}</p>

        <p className="text-xs font-semibold text-gray-400 mb-2">TOP SKILLS</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {career.requiredSkills?.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs bg-blue-50 text-primary px-2 py-1 rounded-md font-medium">
              {skill}
            </span>
          ))}
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-gray-400 text-xs">Average Salary</p>
            <p className="font-semibold text-cardtext">{career.averageSalary} LPA</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">City</p>
            <p className="font-semibold text-cardtext">{career.preferredCity}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/careers/${career._id}`)}
        className="btn-primary w-full"
      >
        View Details
      </button>
    </div>
  );
}
