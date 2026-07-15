import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint yet — this just confirms submission in the UI for now.
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
      <h1 className="font-heading text-3xl font-bold text-cardtext mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-10">
        Have a question, feedback, or found a bug? We'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-heading font-semibold text-lg text-cardtext mb-4">Get in touch</h2>
          <ul className="space-y-3 text-gray-600">
            <li><span className="font-medium text-cardtext">Email:</span> support@careerpathai.com</li>
            <li><span className="font-medium text-cardtext">Phone:</span> +91 90140 00000</li>
            <li><span className="font-medium text-cardtext">Location:</span> Hyderabad, Telangana, India</li>
            <li><span className="font-medium text-cardtext">Office Hours:</span> Mon–Fri, 9:00 AM – 6:00 PM IST</li>
          </ul>
        </div>

        <div className="card p-6">
          {sent ? (
            <p className="text-success font-medium">
              Thanks — your message has been noted. We'll get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
              <input
                required
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
              <textarea
                required
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field"
              />
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
