import React from 'react';
import { getCourseImageUrl } from '../../utils/course-images';

function CourseCard({ course, onClick }) {
  const imageUrl = getCourseImageUrl(course);

  return (
    <div 
      className="bg-surface-container-lowest rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-atmospheric cursor-pointer flex flex-col h-full border border-transparent"
      onClick={() => onClick && onClick(course?._id)}
    >
      <div className="relative aspect-square overflow-hidden bg-surface-container-high shrink-0">
        <img 
          src={imageUrl} 
          alt={course?.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold shadow-md uppercase tracking-wider">
          {course?.level || 'All Levels'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3 text-yellow-500">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
          <span className="text-xs font-bold text-on-surface-variant ml-1">4.8</span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold font-headline mb-2 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
          {course?.title}
        </h3>
        
        {/* Description */}
        <p className="text-xs text-on-surface-variant mb-6 font-body">
          {course?.category} • {course?.curriculum?.length || 0} lessons • {course?.duration || 0} hrs
        </p>

        {/* Button */}
        <button className="w-full mt-auto py-3 bg-surface-container-high text-on-primary-fixed-variant font-bold rounded-xl text-sm group-hover:bg-primary group-hover:text-on-primary transition-colors duration-200">
          Read Review
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
