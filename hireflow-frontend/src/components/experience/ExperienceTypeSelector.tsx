import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Briefcase, Heart, Rocket, Microscope } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ExperienceType } from '../../types/experience';

interface ExperienceTypeSelectorProps {
  selectedType: string | null;
  onSelectType: (type: string) => void;
  onNext: () => void;
}

const experienceTypes: ExperienceType[] = [
  {
    id: 'class-project',
    name: 'Class Project',
    description: 'Academic assignments, research papers, group projects',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    examples: ['Capstone project', 'Research paper', 'Group presentation', 'Lab report']
  },
  {
    id: 'club-organization',
    name: 'Club/Organization',
    description: 'Student groups, leadership roles, extracurricular activities',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    examples: ['Student government', 'Academic club', 'Cultural organization', 'Sports team']
  },
  {
    id: 'part-time-job',
    name: 'Part-time Job',
    description: 'Work experience, internships, summer jobs',
    icon: Briefcase,
    color: 'from-green-500 to-green-600',
    examples: ['Retail associate', 'Tutor', 'Research assistant', 'Internship']
  },
  {
    id: 'volunteer-work',
    name: 'Volunteer Work',
    description: 'Community service, charity work, social impact',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    examples: ['Food bank', 'Animal shelter', 'Community garden', 'Youth mentoring']
  },
  {
    id: 'personal-project',
    name: 'Personal Project',
    description: 'Independent work, hobbies, creative endeavors',
    icon: Rocket,
    color: 'from-orange-500 to-orange-600',
    examples: ['Mobile app', 'Blog', 'Art portfolio', 'Open source contribution']
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Academic research, experiments, data analysis',
    icon: Microscope,
    color: 'from-indigo-500 to-indigo-600',
    examples: ['Lab research', 'Survey study', 'Data analysis', 'Literature review']
  }
];

const ExperienceTypeSelector: React.FC<ExperienceTypeSelectorProps> = ({
  selectedType,
  onSelectType,
  onNext
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          What type of experience are you translating?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Choose the category that best fits your experience. We'll tailor the AI translation accordingly.
        </motion.p>
      </div>

      {/* Experience Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experienceTypes.map((type, index) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-purple-500 border-purple-200' 
                    : 'hover:border-purple-300'
                }`}
                onClick={() => onSelectType(type.id)}
              >
                <div className="text-center p-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {type.description}
                  </p>
                  
                  {/* Examples */}
                  <div className="space-y-1">
                    {type.examples.slice(0, 2).map((example, idx) => (
                      <div key={idx} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {example}
                      </div>
                    ))}
                    {type.examples.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{type.examples.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <button
          onClick={onNext}
          disabled={!selectedType}
          className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
            selectedType
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Next Step
        </button>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center text-sm text-gray-500"
      >
        <span className="inline-flex items-center">
          ✨ 2,847 students used this today
        </span>
      </motion.div>
    </div>
  );
};

export default ExperienceTypeSelector; 