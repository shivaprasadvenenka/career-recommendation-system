export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">© 2026 CareerPath AI</p>

        <div className="flex gap-6 text-sm text-gray-500">
          <a href="/about" className="hover:text-primary">About</a>
          <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
          <a href="/terms" className="hover:text-primary">Terms</a>
          <a href="/contact" className="hover:text-primary">Contact</a>
        </div>

        <div className="flex gap-4 text-gray-400">
          <a href="#" aria-label="LinkedIn" className="hover:text-primary">in</a>
          <a href="#" aria-label="GitHub" className="hover:text-primary">gh</a>
          <a href="#" aria-label="Twitter" className="hover:text-primary">tw</a>
        </div>
      </div>
    </footer>
  );
}
