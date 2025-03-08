import React from 'react';
import { MessageSquareDiff } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, path, gradientColors, iconColor }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/${path}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`h-48 w-full flex flex-col items-center justify-center space-y-2 ${gradientColors} rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400`}
      aria-label={`Go to ${title} tasks`}
    >
      <span className="text-lg text-gray-800 font-bold">{`Go to ${title} Task`}</span>
      <MessageSquareDiff className={`w-10 h-10 ${iconColor}`} aria-hidden="true" />
    </button>
  );
};

function Dashboard() {
  const sections = [
    {
      title: 'Daily',
      path: 'dailytask',
      gradientColors: 'bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Weekly',
      path: 'weekly',
      gradientColors: 'bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Monthly',
      path: 'monthly',
      gradientColors: 'bg-gradient-to-r from-green-200 via-green-300 to-green-400',
      iconColor: 'text-green-600'
    },
    {
      title: 'Yearly',
      path: 'yearly',
      gradientColors: 'bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <>
    <div className="max-w-full h-fit py-8 px-4 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((section) => (
          <DashboardCard
            key={section.path}
            {...section}
          />
        ))}
      </div>
    </div>

    </>
  );
}

export default Dashboard;











