import React from 'react';

const SectionHeading = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold text-green-300">{title}</h2>
    <p className="text-gray-400 text-sm">{subtitle}</p>
  </div>
);

export default SectionHeading;