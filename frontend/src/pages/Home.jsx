import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">
      <h1 className="font-heading text-4xl font-bold text-cardtext mb-4">
        Find the career path that fits <span className="text-primary">you</span>.
      </h1>
      <p className="text-gray-500 max-w-xl mx-auto mb-8">
        CareerPath AI matches your skills, education, and preferences to real careers,
        with a learning roadmap to get there.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/register" className="btn-primary">Get Started</Link>
        <Link to="/careers" className="px-5 py-2.5 rounded-lg border border-primary text-primary font-semibold hover:bg-blue-50">
          Browse Careers
        </Link>
      </div>
    </div>
  );
}
