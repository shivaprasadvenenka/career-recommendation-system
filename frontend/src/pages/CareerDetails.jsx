import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function Section({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="font-heading font-semibold text-cardtext mb-2">{title}</h3>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CareerDetails() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    api.get(`/careers/${id}`).then(({ data }) => setCareer(data));
  }, [id]);

  const handleSave = async () => {
    try {
      await api.post(`/careers/${id}/save`);
      setSaved(true);
    } catch (err) {
      alert(err.response?.data?.message || "Please log in to save careers.");
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setApplyMessage("");
    try {
      await api.post("/applications", { careerId: id });
      setApplied(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Please log in to apply.";
      if (err.response?.status === 409) {
        setApplied(true);
      } else {
        setApplyMessage(msg);
      }
    } finally {
      setApplying(false);
    }
  };

  if (!career) {
    return <div className="pt-28 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
      <div className="card p-8">
        <h1 className="font-heading text-3xl font-bold text-cardtext mb-2">{career.name}</h1>
        <p className="text-gray-500 mb-6">{career.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div>
            <p className="text-xs text-gray-400">Salary</p>
            <p className="font-semibold text-cardtext">{career.averageSalary} LPA</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Growth</p>
            <p className="font-semibold text-cardtext">{career.growth}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Difficulty</p>
            <p className="font-semibold text-cardtext">{career.difficulty}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Experience</p>
            <p className="font-semibold text-cardtext">{career.experience}</p>
          </div>
        </div>

        <Section title="Required Skills" items={career.requiredSkills} />
        <Section title="Companies Hiring" items={career.companiesHiring} />
        <Section title="Learning Roadmap" items={career.learningRoadmap} />
        <Section title="Projects" items={career.projects} />
        <Section title="Required Certifications" items={career.certifications} />
        <Section title="Courses" items={career.courses} />
        <Section title="Books" items={career.books} />
        <Section title="YouTube Resources" items={career.youtubeResources} />

        {applyMessage && (
          <div className="bg-red-50 text-danger text-sm px-4 py-2 rounded-lg mb-4">{applyMessage}</div>
        )}

        <div className="flex gap-4 mt-8">
          <button onClick={handleApply} disabled={applying || applied} className="btn-primary disabled:opacity-60">
            {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg border border-primary text-primary font-semibold hover:bg-blue-50"
          >
            {saved ? "Saved ✓" : "Save Career"}
          </button>
        </div>
      </div>
    </div>
  );
}
