import React from 'react';

const categoryStyles = {
  microsoft: { gradient: 'linear-gradient(135deg,#0078d4,#005a9e)', emoji: '🪟' },
  linux: { gradient: 'linear-gradient(135deg,#e95420,#772953)', emoji: '🐧' },
  networking: { gradient: 'linear-gradient(135deg,#1ba1e2,#0050ef)', emoji: '🌐' },
  cloud: { gradient: 'linear-gradient(135deg,#0089d6,#00bcf2)', emoji: '☁️' },
  security: { gradient: 'linear-gradient(135deg,#107c10,#004b1c)', emoji: '🔒' },
  default: { gradient: 'linear-gradient(135deg,#5c2d91,#8764b8)', emoji: '⚙️' }
};

function CourseCard({ course, onClick }) {
  const category = course?.category?.toLowerCase() || 'default';
  const style = categoryStyles[category] || categoryStyles.default;

  return (
    <div 
      className="card-base cursor-pointer group"
      onClick={() => onClick && onClick(course?._id)}
    >
      <div 
        className="h-[160px] flex items-center justify-center text-[64px]"
        style={{ background: style.gradient }}
      >
        {style.emoji}
      </div>
      <div className="p-[20px]">
        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6e6e73] mb-[6px]">
          {course?.category}
        </div>
        <div className="text-[17px] font-bold text-[#1d1d1f] mb-[6px] leading-[1.3] group-hover:text-[#0071e3] transition-colors">
          {course?.title}
        </div>
        <div className="text-[13px] text-[#86868b] flex gap-[12px]">
          <span>{course?.curriculum?.length || 0} lessons</span>
          <span>·</span>
          <span>{course?.duration || '0'} hrs</span>
        </div>
        <div className="inline-block px-[10px] py-[2px] rounded-[980px] text-[11px] font-bold bg-[#e8f1fb] text-[#0071e3] mt-[10px]">
          {course?.level || 'All Levels'}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
