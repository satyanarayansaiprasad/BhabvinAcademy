import React from 'react';

function PathCard({ path, index }) {
  return (
    <div className="border border-[#d2d2d7] rounded-[18px] p-[32px] sm:p-[28px] transition-all cursor-pointer hover:border-[#0071e3] hover:shadow-[0_4px_20px_rgba(0,113,227,0.1)] group">
      <div className="text-[13px] font-bold text-[#0071e3] mb-[12px]">
        Path {String(index + 1).padStart(2, '0')}
      </div>
      <div className="text-[22px] font-bold tracking-[-0.5px] mb-[10px] text-[#1d1d1f]">
        {path?.title}
      </div>
      <div className="text-[14px] text-[#6e6e73] leading-[1.6] mb-[20px]">
        {path?.description}
      </div>
      <div className="flex flex-wrap gap-[6px]">
        {path?.tags?.map((tag, i) => (
          <span 
            key={i} 
            className="text-[11px] font-medium bg-[#f5f5f7] text-[#1d1d1f] px-[12px] py-[4px] rounded-[980px]"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="block mt-[20px] text-[#0071e3] text-[13px] font-bold group-hover:translate-x-1 transition-transform">
        Start path →
      </span>
    </div>
  );
}

export default PathCard;
