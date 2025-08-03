import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center shadow hover:shadow-lg transition">
    <div className="text-3xl font-bold text-lime-300">{value}</div>
    <p className="text-gray-300 text-sm mt-1">{label}</p>
  </div>
);

export default StatCard;
