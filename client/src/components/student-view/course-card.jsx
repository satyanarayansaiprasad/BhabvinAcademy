import React from 'react';

function getCategoryVisuals(category, title) {
  const cat = String(category || '').toLowerCase().trim();
  const t = String(title || '').toLowerCase().trim();

  if (t.includes('active directory') || cat.includes('directory') || cat.includes('ad')) {
    return {
      gradientClass: 'bg-gradient-to-br from-[#5c2d91] to-[#8764b8]',
      emoji: '⚙️'
    };
  }
  if (cat.includes('microsoft') || cat.includes('m365') || t.includes('windows server') || t.includes('microsoft')) {
    return {
      gradientClass: 'bg-gradient-to-br from-[#0078d4] to-[#005a9e]',
      emoji: '🪟'
    };
  }
  if (cat.includes('linux') || t.includes('linux')) {
    return {
      gradientClass: 'bg-gradient-to-br from-[#e95420] to-[#772953]',
      emoji: '🐧'
    };
  }
  if (cat.includes('network') || t.includes('ccna') || t.includes('network') || cat.includes('cisco')) {
    return {
      gradientClass: 'bg-gradient-to-br from-[#1ba1e2] to-[#0050ef]',
      emoji: '🌐'
    };
  }
  if (cat.includes('cloud') || cat.includes('azure') || t.includes('azure') || t.includes('cloud') || t.includes('aws')) {
    return {
      gradientClass: 'bg-gradient-to-br from-[#0089d6] to-[#00bcf2]',
      emoji: '☁️'
    };
  }
  if (cat.includes('security') || cat.includes('comptia') || t.includes('security')) {
    return {
      gradientClass: 'bg-gradient-to-br from-[#107c10] to-[#004b1c]',
      emoji: '🔒'
    };
  }

  return {
    gradientClass: 'bg-gradient-to-br from-[#4f46e5] to-[#7c3aed]',
    emoji: '🤖'
  };
}

function CourseCard({ course, onClick }) {
  const { gradientClass, emoji } = getCategoryVisuals(course?.category, course?.title);

  // Instructor Name
  const instructorName = course?.instructorName || course?.instructor || 'Todd McLeod';

  // Rating & Ratings Count
  const rating = course?.rating || '4.6';
  const ratingsCount = course?.ratingsCount || '2,112';

  // Price calculations matching reference image format
  const rawPrice = course?.pricing !== undefined && course?.pricing !== null ? Number(course.pricing) : 489;
  const priceValue = rawPrice > 0 ? rawPrice : 489;
  const currentPrice = priceValue.toFixed(2);
  const originalPrice = (priceValue * 1.634).toFixed(2);

  // Check if course image is a valid URL or image path
  const hasImageUrl = course?.image && (
    course.image.startsWith('http://') ||
    course.image.startsWith('https://') ||
    course.image.startsWith('/') ||
    course.image.startsWith('data:')
  );

  return (
    <div
      className="group bg-white border border-[#e2e8f0] rounded-[24px] p-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => onClick && onClick(course?._id)}
    >
      {/* Thumbnail Banner Container */}
      <div className="relative w-full h-[185px] rounded-[16px] overflow-hidden select-none bg-slate-900 flex items-center justify-center">
        {hasImageUrl ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover rounded-[16px] group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center text-[56px] ${gradientClass} transition-transform duration-500 group-hover:scale-105`}>
            <span>{emoji}</span>
          </div>
        )}
      </div>

      {/* Course Content Details */}
      <div className="pt-3.5 px-1 pb-1 flex-1 flex flex-col">
        {/* Course Title */}
        <h3 className="text-[17px] font-bold text-[#1d1d1f] leading-[1.35] tracking-[-0.3px] line-clamp-2 mb-1 group-hover:text-[#0071e3] transition-colors">
          {course?.title || 'ChatGPT & AI Tools - From Beginner to Expert'}
        </h3>

        {/* Instructor Name */}
        <p className="text-[13px] text-[#71717a] font-normal mb-3.5">
          {instructorName}
        </p>

        {/* Badges Row */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {/* Premium Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-[#5850ec] text-white text-[11px] font-bold shadow-xs">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Premium
          </span>

          {/* Rating Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] border border-[#e2e8f0] bg-white text-[#334155] text-[11px] font-semibold">
            <span className="text-amber-500 text-xs">★</span>
            {rating}
          </span>

          {/* Rating Count Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] border border-[#e2e8f0] bg-white text-[#64748b] text-[11px] font-normal">
            {ratingsCount} ratings
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2.5 mt-auto pt-1">
          <span className="text-[20px] font-extrabold text-[#111827] tracking-tight">
            ₹{currentPrice}
          </span>
          <span className="text-[14px] text-[#9ca3af] line-through font-normal">
            ₹{originalPrice}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
