import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ExperienceTypeSelector from './ExperienceTypeSelector';
import TranslationDisplay from './TranslationDisplay';
import { ExperienceType, TranslationResult } from '../../types/experience';

type WizardStep = 'type-selection' | 'description' | 'translation' | 'refinement';

interface ExperienceWizardProps {
  onComplete: (result: TranslationResult) => void;
  onClose: () => void;
}

const ExperienceWizard: React.FC<ExperienceWizardProps> = ({
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('type-selection');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const steps = [
    { id: 'type-selection', name: 'Choose Type', icon: '🎯' },
    { id: 'description', name: 'Describe Experience', icon: '✍️' },
    { id: 'translation', name: 'AI Translation', icon: '✨' },
    { id: 'refinement', name: 'Refine & Save', icon: '💾' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (currentStep === 'type-selection') {
      setCurrentStep('description');
    } else if (currentStep === 'description') {
      setCurrentStep('translation');
      handleTranslation();
    } else if (currentStep === 'translation') {
      setCurrentStep('refinement');
    }
  };

  const handleBack = () => {
    if (currentStep === 'description') {
      setCurrentStep('type-selection');
    } else if (currentStep === 'translation') {
      setCurrentStep('description');
    } else if (currentStep === 'refinement') {
      setCurrentStep('translation');
    }
  };

  const handleTranslation = async () => {
    setIsTranslating(true);
    
    // Simulate AI translation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock translation result
    const mockResult: TranslationResult = {
      original: description,
      professional: `Led a comprehensive ${selectedType === 'class-project' ? 'academic research project' : 'team initiative'} that resulted in measurable improvements and demonstrated strong leadership capabilities. Collaborated with cross-functional stakeholders to deliver high-quality outcomes within established timelines.`,
      confidence: 87,
      improvements: [
        'Added action verbs and quantifiable results',
        'Enhanced professional language and industry terminology',
        'Improved clarity and impact of achievements',
        'Optimized for ATS keyword matching'
      ],
      keywords: ['Leadership', 'Collaboration', 'Project Management', 'Results-Driven', 'Cross-functional']
    };
    
    setTranslationResult(mockResult);
    setIsTranslating(false);
  };

  const handleRegenerate = () => {
    handleTranslation();
  };

  const handleSave = () => {
    if (translationResult) {
      onComplete(translationResult);
    }
  };

  const canProceed = () => {
    if (currentStep === 'type-selection') return selectedType !== null;
    if (currentStep === 'description') return description.trim().length > 10;
    if (currentStep === 'translation') return translationResult !== null;
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type-selection':
        return (
          <ExperienceTypeSelector
            selectedType={selectedType}
            onSelectType={handleTypeSelection}
            onNext={handleNext}
          />
        );
      
      case 'description':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                Describe Your Experience
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Tell us what you did, what you learned, and what you accomplished. Be as detailed as possible!
              </motion.p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: I worked on a group project where we had to create a mobile app for our computer science class. I was responsible for the user interface design and helped coordinate the team meetings..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={6}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {description.length} characters
                  </span>
                  <span className="text-xs text-gray-500">
                    Minimum 10 characters
                  </span>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Tips for better results:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Include specific actions you took</li>
                  <li>• Mention any results or outcomes</li>
                  <li>• Describe your role and responsibilities</li>
                  <li>• Add any skills or technologies used</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'translation':
        return (
          <TranslationDisplay
            result={translationResult}
            isLoading={isTranslating}
            onRegenerate={handleRegenerate}
            onSave={handleSave}
          />
        );
      
      case 'refinement':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                Almost Done! 🎯
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Review your translated experience and make any final adjustments before saving.
              </motion.p>
            </div>

            {translationResult && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Final Version</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">{translationResult.professional}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Confidence:</span> {translationResult.confidence}%
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Keywords:</span> {translationResult.keywords.length} added
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStepIndex 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {index < currentStepIndex ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <span className="text-sm">{step.icon}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStepIndex ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {steps[currentStepIndex].name}
            </h1>
            <p className="text-gray-600">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={handleBack}
            disabled={currentStep === 'type-selection'}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 'type-selection'
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {currentStep !== 'type-selection' && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                canProceed()
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 'refinement' ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceWizard; 