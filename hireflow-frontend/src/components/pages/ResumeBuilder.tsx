import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { 
  FileText,
  Download,
  Eye,
  Save,
  Undo,
  Redo,
  Plus,
  GripVertical,
  Sparkles,
  Zap,
  Target,
  Smartphone,
  Monitor,
  Share,
  Settings
} from 'lucide-react';
import { Page } from '../App';

interface ResumeBuilderProps {
  user: any;
  onNavigate: (page: Page) => void;
}

const resumeSections = [
  { id: 'personal', label: 'Personal Info', required: true },
  { id: 'education', label: 'Education', required: true },
  { id: 'experience', label: 'Experience', required: false },
  { id: 'projects', label: 'Projects', required: false },
  { id: 'skills', label: 'Skills', required: false },
  { id: 'activities', label: 'Activities & Leadership', required: false },
  { id: 'awards', label: 'Awards & Honors', required: false },
];

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and professional', atsScore: 95 },
  { id: 'classic', name: 'Classic', description: 'Traditional format', atsScore: 98 },
  { id: 'creative', name: 'Creative', description: 'Stand out design', atsScore: 85 },
  { id: 'technical', name: 'Technical', description: 'Perfect for STEM', atsScore: 92 },
];

export default function ResumeBuilder({ user, onNavigate }: ResumeBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [activeSection, setActiveSection] = useState('personal');
  const [atsScore, setAtsScore] = useState(87);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const [resumeData, setResumeData] = useState({
    personal: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: 'College Park, MD',
      linkedin: '',
      github: ''
    },
    education: [
      {
        id: 1,
        school: 'University of Maryland',
        degree: 'Bachelor of Science in Computer Science',
        gpa: '3.7',
        graduationDate: 'May 2025',
        relevant: 'Data Structures, Algorithms, Software Engineering'
      }
    ],
    experience: [],
    projects: [],
    skills: []
  });

  const handleSectionAdd = (sectionType: string) => {
    // Logic to add new items to sections
    console.log('Adding to:', sectionType);
  };

  const handleAIEnhance = () => {
    onNavigate('experience-translator');
  };

  const renderSectionEditor = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  value={resumeData.personal.name}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, name: e.target.value }
                  }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  value={resumeData.personal.email}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, email: e.target.value }
                  }))}
                  placeholder="john.doe@umd.edu"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input 
                  value={resumeData.personal.phone}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, phone: e.target.value }
                  }))}
                  placeholder="(301) 555-0123"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input 
                  value={resumeData.personal.location}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, location: e.target.value }
                  }))}
                  placeholder="College Park, MD"
                />
              </div>
              <div>
                <label className="text-sm font-medium">LinkedIn</label>
                <Input 
                  value={resumeData.personal.linkedin}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, linkedin: e.target.value }
                  }))}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="text-sm font-medium">GitHub</label>
                <Input 
                  value={resumeData.personal.github}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, github: e.target.value }
                  }))}
                  placeholder="github.com/johndoe"
                />
              </div>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Education</h3>
              <Button size="sm" variant="outline" onClick={() => handleSectionAdd('education')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
            {resumeData.education.map((edu, index) => (
              <Card key={edu.id} className="p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">School</label>
                      <Input value={edu.school} placeholder="University of Maryland" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Degree</label>
                      <Input value={edu.degree} placeholder="Bachelor of Science in Computer Science" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">GPA</label>
                      <Input value={edu.gpa} placeholder="3.7" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Graduation Date</label>
                      <Input value={edu.graduationDate} placeholder="May 2025" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Relevant Coursework</label>
                    <Textarea value={edu.relevant} placeholder="Data Structures, Algorithms, Software Engineering" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold capitalize">{activeSection}</h3>
              <Button size="sm" variant="outline" onClick={() => handleSectionAdd(activeSection)}>
                <Plus className="w-4 h-4 mr-2" />
                Add {activeSection}
              </Button>
            </div>
            <div className="p-8 text-center border-2 border-dashed border-muted rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No {activeSection} added yet</p>
              <Button onClick={handleAIEnhance} className="gradient-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Use AI to Add {activeSection}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Panel - Sections & Tools */}
      <div className="w-80 border-r border-border bg-card overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Resume Sections</h2>
            <Badge variant="outline" className="text-xs px-2 py-1 border-red-200 text-red-700 bg-red-50">
              Auto-save
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {resumeSections.map((section) => (
            <motion.div
              key={section.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={activeSection === section.id ? "default" : "ghost"}
                onClick={() => setActiveSection(section.id)}
                className="w-full justify-between h-auto p-3"
              >
                <div className="flex items-center">
                  <GripVertical className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span>{section.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {section.required && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="p-4 space-y-3">
          <h3 className="font-medium text-sm">AI Tools</h3>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleAIEnhance}
          >
            <Sparkles className="w-4 h-4 mr-3 text-red-500" />
            Experience Translator
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Zap className="w-4 h-4 mr-3 text-yellow-500" />
            Bullet Point Generator
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Target className="w-4 h-4 mr-3 text-blue-500" />
            Skills Suggester
          </Button>
        </div>
      </div>

      {/* Center Panel - Live Preview */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <Button 
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button 
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">ATS Score:</span>
                <Badge className="bg-green-100 text-green-700">{atsScore}%</Badge>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm" className="gradient-primary">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-muted/30 p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`mx-auto bg-white shadow-lg ${
              previewMode === 'mobile' ? 'w-80' : 'w-full max-w-4xl'
            }`}
            style={{ aspectRatio: previewMode === 'mobile' ? '9/16' : '8.5/11' }}
          >
            <div className="p-8 h-full">
              {/* Resume Preview */}
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {resumeData.personal.name || 'Your Name'}
                  </h1>
                  <div className="text-sm text-gray-600 mt-2">
                    {resumeData.personal.email} | {resumeData.personal.phone} | {resumeData.personal.location}
                  </div>
                  {resumeData.personal.linkedin && (
                    <div className="text-sm text-gray-600">
                      {resumeData.personal.linkedin}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
                    EDUCATION
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mt-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{edu.school}</div>
                          <div className="text-sm">{edu.degree}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div>GPA: {edu.gpa}</div>
                          <div>{edu.graduationDate}</div>
                        </div>
                      </div>
                      {edu.relevant && (
                        <div className="text-sm text-gray-600 mt-1">
                          Relevant Coursework: {edu.relevant}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {Object.keys(resumeData.experience).length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4" />
                    <p>Start adding sections to see your resume preview</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Content Editor */}
      <div className="w-96 border-l border-border bg-card overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Template</h2>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer border-2 transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-border hover:border-red-200'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-3">
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      ATS {template.atsScore}%
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderSectionEditor()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="font-medium text-sm">AI Suggestions</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add more quantifiable achievements to improve your ATS score. 
              Try the Experience Translator to enhance your descriptions.
            </p>
            <Button size="sm" variant="outline" className="mt-2" onClick={handleAIEnhance}>
              <Sparkles className="w-3 h-3 mr-2" />
              Enhance with AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}