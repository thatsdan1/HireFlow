import React from 'react';

interface CareerMapProps {
  user: any;
  onNavigate: (page: 'landing' | 'dashboard' | 'resume-builder' | 'experience-translator' | 'applications' | 'job-discovery' | 'career-map' | 'interview-prep') => void;
}

const CareerMap: React.FC<CareerMapProps> = ({ user, onNavigate }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Career Map</h1>
      <p className="text-gray-600">
        This feature is coming soon. Here you'll be able to map out your career path
        and track your professional development goals.
      </p>
    </div>
  );
};

export default CareerMap;
