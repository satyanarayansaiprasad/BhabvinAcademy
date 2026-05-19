import React from 'react';
import { getCourseImageUrl } from '../../utils/course-images';

function CourseCard({ course, onClick }) {
  const imageUrl = getCourseImageUrl(course);

  return (
    <div 
      className="card-base cursor-pointer group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-2xl hover:border-[#0071e3]/30 transition-all duration-300"
      onClick={() => onClick && onClick(course?._id)}
    >
      <div className="h-[160px] relative overflow-hidden bg-[#f5f5f7] shrink-0">
        <img 
          src={imageUrl} 
          alt={course?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
      <div className="p-[20px] flex flex-col flex-1">
        <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#0071e3] mb-[6px]">
          {course?.category}
        </div>
        <div className="text-[17px] font-bold text-[#1d1d1f] mb-[6px] leading-[1.3] group-hover:text-[#0071e3] transition-colors line-clamp-2 min-h-[44px]">
          {course?.title}
        </div>
        <div className="text-[13px] text-[#86868b] flex gap-[12px] mt-auto">
          <span>{course?.curriculum?.length || 0} lessons</span>
          <span>·</span>
          <span>{course?.duration || '0'} hrs</span>
        </div>
        <div className="inline-block self-start px-[10px] py-[2px] rounded-[980px] text-[11px] font-bold bg-[#e8f1fb] text-[#0071e3] mt-[10px]">
          {course?.level || 'All Levels'}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
