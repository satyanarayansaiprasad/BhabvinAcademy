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

  // Fallbacks
  return {
    gradientClass: 'bg-gradient-to-br from-[#0071e3] to-[#0077ed]',
    emoji: '📚'
  };
}

const levelBadgeClasses = {
  'beginner': 'bg-[#e8f5e9] text-[#1b7a34]',
  'intermediate': 'bg-[#fff3e0] text-[#b25000]',
  'advanced': 'bg-[#fce4ec] text-[#b71c1c]',
  'all levels': 'bg-[#e8f1fb] text-[#0071e3]',
  'all': 'bg-[#e8f1fb] text-[#0071e3]',
};

function CourseCard({ course, onClick }) {
  const { gradientClass, emoji } = getCategoryVisuals(course?.category, course?.title);
  
  const levelKey = String(course?.level || 'All Levels').toLowerCase().trim();
  const badgeClass = levelBadgeClasses[levelKey] || 'bg-[#e8f1fb] text-[#0071e3]';

  // Compute rating and review count consistently
  const rating = course?.rating || '4.9';
  const reviewsCount = course?.ratingsCount || '312';

  // Determine badge inside image
  let imgBadge = null;
  const lowerTitle = String(course?.title || '').toLowerCase();
  if (lowerTitle.includes('server') || lowerTitle.includes('linux')) {
    imgBadge = <span className="absolute top-[10px] right-[10px] text-[10px] font-bold px-[8px] py-[3px] rounded-[980px] uppercase tracking-[0.04em] bg-[#ff9f0a] text-white">Popular</span>;
  } else if (lowerTitle.includes('ccna') || lowerTitle.includes('security')) {
    imgBadge = <span className="absolute top-[10px] right-[10px] text-[10px] font-bold px-[8px] py-[3px] rounded-[980px] uppercase tracking-[0.04em] bg-[#ff3b30] text-white">Hot</span>;
  } else if (lowerTitle.includes('azure') || lowerTitle.includes('fundamentals')) {
    imgBadge = <span className="absolute top-[10px] right-[10px] text-[10px] font-bold px-[8px] py-[3px] rounded-[980px] uppercase tracking-[0.04em] bg-[#0071e3] text-white">New</span>;
  }

  return (
    <div 
      className="c-card flex flex-col bg-white border border-[#e8e8ed] rounded-[18px] overflow-hidden transition-all duration-[0.25s] cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:border-transparent"
      onClick={() => onClick && onClick(course?._id)}
    >
      <div className={`h-[150px] flex items-center justify-center text-[56px] relative select-none ${gradientClass}`}>
        {emoji}
        {imgBadge}
      </div>
      <div className="p-[18px] flex-1 flex flex-col">
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0071e3] mb-[5px]">
          {course?.category}
        </div>
        <div className="text-[15px] font-semibold text-[#1d1d1f] mb-[6px] leading-[1.3] line-clamp-2">
          {course?.title}
        </div>
        <div className="text-[12px] text-[#86868b] line-clamp-2 mb-[10px] leading-[1.5]">
          {course?.subtitle || course?.description}
        </div>
        <div className="text-[12px] text-[#86868b] flex gap-[10px] items-center mb-[10px]">
          <span>{course?.curriculum?.length || 0} lessons</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#d2d2d7]"></span>
          <span>{course?.duration || '0'} hrs</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-[4px]">
          <span className={`inline-block px-[10px] py-[3px] rounded-[980px] text-[11px] font-semibold ${badgeClass}`}>
            {course?.level || 'All Levels'}
          </span>
          <button className="text-[12px] font-semibold text-[#0071e3] bg-none border-none cursor-pointer p-0 hover:underline">
            Enroll →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
