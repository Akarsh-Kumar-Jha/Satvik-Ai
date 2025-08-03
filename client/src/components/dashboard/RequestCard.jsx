import React from 'react';
import { useNavigate } from 'react-router-dom';

const RequestCard = ({ request }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow hover:shadow-xl transition">
      <p className="text-lime-300 font-medium">{request.userName}</p>
      <p className="text-gray-400 text-sm">Goal: {request.goal}</p>
      <p className="text-gray-500 text-xs">Requested: {new Date(request.date).toLocaleDateString()}</p>
      <button
        onClick={() => navigate(`/nutritionist/meal-plan/${request._id}`)}
        className="mt-2 text-sm text-emerald-300 hover:underline"
      >
        View Request →
      </button>
    </div>
  );
};

export default RequestCard;
