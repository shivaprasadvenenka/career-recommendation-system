// Turns a display name into a URL-friendly "username" slug.
// e.g. "Rahul Sharma" -> "rahul-sharma", "Priya  R." -> "priya-r"
export function slugify(name = "") {
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric runs -> single dash
    .replace(/^-+|-+$/g, "");   // trim leading/trailing dashes
}

// Convenience helper: builds "/profile/<username>" for a given user object.
// Falls back to the email prefix if fullName is missing, and finally to "me".
export function profilePath(user) {
  if (!user) return "/profile";
  const base = user.fullName || (user.email ? user.email.split("@")[0] : "");
  const slug = slugify(base);
  return slug ? `/profile/${slug}` : "/profile";
}