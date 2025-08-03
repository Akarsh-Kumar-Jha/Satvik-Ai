import React from 'react'

function FeatureCard({ title, desc, img }) {
  return (
    <div data-aos="fade-up" 
      data-aos-delay="150" className="group bg-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-lg border border-white/10 
                    hover:shadow-[0_0_30px_rgba(102,196,117,0.25)] hover:scale-[1.02] transition-shadow duration-300 ease-in-out">

      {/* Icon */}
      <div className="w-14 h-14 flex justify-center items-center rounded-full bg-lime-400/10 backdrop-blur-sm mb-5">
        <img
          src={img}
          alt={title}
          className="h-12 w-12 object-contain"
          onError={(e) => {
            e.target.src = "/fallback-icon.svg"; // fallback in case icon doesn't load
          }}
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-lime-300 group-hover:text-lime-200 transition">{title}</h3>

      {/* Description */}
      <p className="text-gray-300 text-sm mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}

export default FeatureCard;
