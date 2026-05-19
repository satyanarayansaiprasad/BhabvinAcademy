export const categoryImages = {
  "microsoft-365": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
  "microsoft-azure": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "copilot": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
  "open-source": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  "networking-basics": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "yoga": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
  "health": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
  "lifestyle": "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80",
  "personal-growth": "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80",
  "art": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80",
  "books": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  // Old/Fallback categories just in case
  "microsoft": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
  "linux": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
  "networking": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "cloud": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "security": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  // Default fallback
  "default": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
};

export function getCourseImageUrl(course) {
  if (!course) return categoryImages.default;

  // 1. If the course specifically has a valid custom image URL, use it
  if (course.image && course.image.startsWith("http")) {
    return course.image;
  }
  if (course.courseImage && course.courseImage.startsWith("http")) {
    return course.courseImage;
  }

  // 2. Check by course category (normalized)
  const categoryKey = String(course.category || "").toLowerCase().trim();
  if (categoryImages[categoryKey]) {
    return categoryImages[categoryKey];
  }

  // 3. Check for partial matches
  for (const [key, url] of Object.entries(categoryImages)) {
    if (key !== "default" && (categoryKey.includes(key) || key.includes(categoryKey))) {
      return url;
    }
  }

  // 4. Default fallback
  return categoryImages.default;
}
