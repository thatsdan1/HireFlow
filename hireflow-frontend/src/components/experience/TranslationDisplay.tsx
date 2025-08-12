import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, RotateCcw, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { TranslationResult } from '../../types/experience';

interface TranslationDisplayProps {
  result: TranslationResult | null;
  isLoading: boolean;
  onRegenerate: () => void;
  onSave: () => void;
}

const TranslationDisplay: React.FC<TranslationDisplayProps> = ({
  result,
  isLoading,
  onRegenerate,
  onSave
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            AI is working its magic! ✨
          </h3>
          <p className="text-gray-600">
            Transforming your experience into professional achievements...
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="max-w-md mx-auto">
          <div className="space-y-3">
            {['Analyzing content', 'Identifying key achievements', 'Applying professional language', 'Optimizing for ATS'].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm text-gray-600">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Translation Complete! 🎉
        </h3>
        <p className="text-gray-600">
          Your experience has been transformed into professional language
        </p>
      </div>

      {/* Confidence Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white p-4 rounded-xl border border-gray-200"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Professional Confidence</span>
          <span className="text-sm font-semibold text-green-600">{result.confidence}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          This indicates how professional and impactful your translated experience sounds
        </p>
      </motion.div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Original Text</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(result.original)}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 text-sm leading-relaxed">{result.original}</p>
          </div>
        </motion.div>

        {/* Professional */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-green-200 bg-green-50/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              Professional Version
              <Sparkles className="w-4 h-4 text-green-600 ml-2" />
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(result.professional)}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <p className="text-gray-900 text-sm leading-relaxed font-medium">{result.professional}</p>
          </div>
        </motion.div>
      </div>

      {/* Improvements & Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Improvements</h4>
          <div className="space-y-2">
            {result.improvements.map((improvement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{improvement}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ATS Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">ATS Keywords Added</h4>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((keyword, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onRegenerate}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Generate Alternatives
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={onSave}
        >
          <Download className="w-4 h-4 mr-2" />
          Save to Resume
        </Button>
      </motion.div>
    </div>
  );
};

export default TranslationDisplay; 