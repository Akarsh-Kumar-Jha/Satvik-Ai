import React from 'react'

function RecipeCard({ title, description, image, tags, cookTime, calories }) {
  return (
     <div
      className="bg-white/5 p-5 rounded-2xl border border-white/10 
                 backdrop-blur-md hover:shadow-[0_0_20px_rgba(102,196,117,0.2)] 
                 transition duration-300 max-w-sm"
      data-aos="fade-up"
    >
      {/* Recipe Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />

      {/* Title */}
      <h3 className="text-xl font-semibold text-lime-300 mb-1">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 bg-white/10 text-gray-200 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
        <span>🕒 {cookTime}</span>
        <span>🔥 {calories}</span>
      </div>
    </div>
  )
}

export default RecipeCard