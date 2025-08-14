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
  Settings,
  Link,
  Copy,
  CheckCircle,
  ExternalLink,
  Brain,
  TrendingUp,
  Lightbulb,
  Upload
} from 'lucide-react';
import { Page } from '../App';
import aiService from '../../services/aiService';

interface ResumeBuilderProps {
  user: any;
  onNavigate: (page: Page) => void;
}

interface JobApplication {
  id: string;
  company: string;
  position: string;
  url: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
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
  
  // Job Application Tracking
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    url: '',
    description: ''
  });

  // Resume Upload States
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // AI Integration States
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any>(null);
  const [selectedJobForAI, setSelectedJobForAI] = useState<JobApplication | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

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
    experience: [] as Array<{
      id?: number;
      company: string;
      position: string;
      duration: string;
      location: string;
      description: string;
    }>,
    projects: [] as Array<{
      id?: number;
      name: string;
      description: string;
      technologies: string;
      url?: string;
    }>,
    skills: [] as Array<{
      id?: number;
      name: string;
      level: string;
      category: string;
    }>
  });

  const handleSectionAdd = (sectionType: string) => {
    switch (sectionType) {
      case 'education':
        const newEducation = {
          id: Date.now(),
          school: '',
          degree: '',
          gpa: '',
          graduationDate: '',
          relevant: ''
        };
        setResumeData(prev => ({
          ...prev,
          education: [...prev.education, newEducation]
        }));
        break;
      
      case 'experience':
        const newExperience = {
          id: Date.now(),
          company: '',
          position: '',
          duration: '',
          location: '',
          description: ''
        };
        setResumeData(prev => ({
          ...prev,
          experience: [...prev.experience, newExperience]
        }));
        break;
      
      case 'skills':
        const newSkill = {
          id: Date.now(),
          name: '',
          level: 'Beginner',
          category: 'Technical'
        };
        setResumeData(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
        }));
        break;
      
      default:
        console.log('Adding to:', sectionType);
    }
  };

  const handleAIEnhance = () => {
    onNavigate('experience-translator');
  };

  // Resume Upload Functions
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('txt')) {
      alert('Please upload a PDF, DOC, or TXT file');
      return;
    }

    setIsUploading(true);
    setUploadedResume(file);

    try {
      // For now, we'll extract text from the file
      // In a real app, you'd send this to the backend for processing
      const text = await extractTextFromFile(file);
      setResumeText(text);
      
      // Parse the resume and update resumeData
      const parsedData = parseResumeText(text);
      setResumeData(prev => ({ ...prev, ...parsedData }));
      
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const extractTextFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.includes('txt')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        // For PDF/DOC, we'll simulate text extraction
        // In production, use a library like pdf-parse or send to backend
        setTimeout(() => {
          resolve('Sample resume text extracted from ' + file.name);
        }, 1000);
      }
    });
  };

  const parseResumeText = (text: string) => {
    // Simple parsing logic - in production, use AI or more sophisticated parsing
    const lines = text.split('\n');
    const parsed = {
      personal: { ...resumeData.personal },
      education: [...resumeData.education],
      experience: [],
      projects: [],
      skills: []
    };

    // Basic parsing - look for common patterns
    lines.forEach(line => {
      if (line.toLowerCase().includes('university') || line.toLowerCase().includes('college')) {
        parsed.education.push({
          id: Date.now(),
          school: line.trim(),
          degree: 'Degree to be filled',
          gpa: 'GPA to be filled',
          graduationDate: 'Date to be filled',
          relevant: 'Relevant coursework to be filled'
        });
      }
    });

    return parsed;
  };

  // AI Integration Functions
  const analyzeJobWithAI = async (job: JobApplication) => {
    if (!job.description) {
      alert('This job application needs a description to analyze with AI.');
      return;
    }

    setIsAIAnalyzing(true);
    setSelectedJobForAI(job);
    setShowAIPanel(true);

    try {
      // Analyze the job description
      const jobAnalysis = await aiService.analyzeJobDescription({
        job_description: job.description,
        company: job.company,
        role: job.position
      });

      // Tailor the resume for this job
      const resumeTailoring = await aiService.tailorResumeForJob({
        resume_data: resumeData,
        job_description: job.description,
        target_role: job.position,
        company: job.company
      });

      // Generate a cover letter
      const coverLetter = await aiService.generateCoverLetter({
        resume_data: resumeData,
        job_description: job.description,
        company: job.company,
        role: job.position,
        user_name: resumeData.personal.name || 'Your Name'
      });

      // Apply AI suggestions to the resume
      if (resumeTailoring.ats_improvements || resumeTailoring.keywords) {
        applyAISuggestionsToResume({
          ats_improvements: resumeTailoring.ats_improvements,
          keywords: resumeTailoring.keywords
        });
      }

      setAiAnalysisResults({
        jobAnalysis,
        resumeTailoring,
        coverLetter
      });

      // Update ATS score
      const newScore = Math.min(100, atsScore + resumeTailoring.score_improvement);
      setAtsScore(newScore);

    } catch (error) {
      console.error('AI analysis failed:', error);
      alert('AI analysis failed. Please try again.');
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  const optimizeForATS = async (job: JobApplication) => {
    if (!job.description) {
      alert('This job application needs a description to optimize for ATS.');
      return;
    }

    setIsAIAnalyzing(true);

    try {
      const atsOptimization = await aiService.optimizeForATS({
        resume_data: resumeData,
        job_description: job.description,
        target_role: job.position,
        company: job.company
      });

      setAiAnalysisResults({
        atsOptimization,
        type: 'ats'
      });

      // Update ATS score
      if (atsOptimization.score_improvement) {
        const newScore = Math.min(100, atsScore + atsOptimization.score_improvement);
        setAtsScore(newScore);
      }

    } catch (error) {
      console.error('ATS optimization failed:', error);
      alert('ATS optimization failed. Please try again.');
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  const enhanceExperienceWithAI = async (experienceText: string, targetRole: string, industry: string) => {
    setIsAIAnalyzing(true);

    try {
      const enhancement = await aiService.enhanceExperience({
        experience_text: experienceText,
        target_role: targetRole,
        industry: industry
      });

      // Apply the enhanced experience to the resume
      if (enhancement.enhanced_description) {
        const newExperience = {
          id: Date.now(),
          company: 'Company Name',
          position: targetRole,
          duration: 'Duration',
          location: 'Location',
          description: enhancement.enhanced_description
        };
        
        setResumeData(prev => ({
          ...prev,
          experience: [...prev.experience, newExperience]
        }));
      }

      setAiAnalysisResults({
        experienceEnhancement: enhancement,
        type: 'experience'
      });

    } catch (error) {
      console.error('Experience enhancement failed:', error);
      alert('Experience enhancement failed. Please try again.');
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  // Function to apply AI suggestions to the resume
  const applyAISuggestionsToResume = (suggestions: any) => {
    if (suggestions.experience_improvements) {
      // Add enhanced experience descriptions
      const enhancedExperience = suggestions.experience_improvements.map((improvement: any, index: number) => ({
        id: Date.now() + index,
        company: improvement.company || 'Company Name',
        position: improvement.position || 'Position',
        duration: improvement.duration || 'Duration',
        location: improvement.location || 'Location',
        description: improvement.description || improvement.text || improvement
      }));

      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, ...enhancedExperience]
      }));
    }

    if (suggestions.skills_to_add) {
      // Add suggested skills
      const newSkills = suggestions.skills_to_add.map((skill: any, index: number) => ({
        id: Date.now() + index,
        name: typeof skill === 'string' ? skill : skill.name || 'Skill',
        level: 'Intermediate',
        category: 'Technical'
      }));

      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, ...newSkills]
      }));
    }

    if (suggestions.keywords) {
      // Update ATS score based on keyword matching
      const keywordScore = Math.min(10, suggestions.keywords.length * 2);
      setAtsScore(prev => Math.min(100, prev + keywordScore));
    }
  };

  // Job Application Functions
  const addJobApplication = () => {
    if (newJob.company && newJob.position) {
      const job: JobApplication = {
        id: Date.now().toString(),
        company: newJob.company,
        position: newJob.position,
        url: newJob.url,
        description: newJob.description,
        status: 'active',
        createdAt: new Date()
      };
      
      setJobApplications([...jobApplications, job]);
      setNewJob({ company: '', position: '', url: '', description: '' });
      setShowJobForm(false);
    }
  };

  // Job URL Scraping Function
  const scrapeJobDescription = async (url: string) => {
    if (!url) return;
    
    setIsAIAnalyzing(true);
    try {
      // Try to scrape the job description from the URL
      const response = await fetch(`/api/scrape-job?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.description) {
          setNewJob(prev => ({ ...prev, description: data.description }));
          alert('Job description scraped successfully!');
        } else {
          alert('Could not automatically scrape job description. Please paste it manually.');
        }
      } else {
        alert('Could not scrape job description. Please paste it manually.');
      }
    } catch (error) {
      console.error('Error scraping job description:', error);
      alert('Could not scrape job description. Please paste it manually.');
    } finally {
      setIsAIAnalyzing(false);
    }
  };

  const removeJobApplication = (id: string) => {
    setJobApplications(jobApplications.filter(job => job.id !== id));
  };

  const copyJobDescription = (description: string) => {
    navigator.clipboard.writeText(description);
  };

  const openJobUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
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
                      <Input 
                        value={edu.school} 
                        onChange={(e) => {
                          const newEducation = [...resumeData.education];
                          newEducation[index] = { ...edu, school: e.target.value };
                          setResumeData(prev => ({ ...prev, education: newEducation }));
                        }}
                        placeholder="University of Maryland" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Degree</label>
                      <Input 
                        value={edu.degree} 
                        onChange={(e) => {
                          const newEducation = [...resumeData.education];
                          newEducation[index] = { ...edu, degree: e.target.value };
                          setResumeData(prev => ({ ...prev, education: newEducation }));
                        }}
                        placeholder="Bachelor of Science in Computer Science" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">GPA</label>
                      <Input 
                        value={edu.gpa} 
                        onChange={(e) => {
                          const newEducation = [...resumeData.education];
                          newEducation[index] = { ...edu, gpa: e.target.value };
                          setResumeData(prev => ({ ...prev, education: newEducation }));
                        }}
                        placeholder="3.7" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Graduation Date</label>
                      <Input 
                        value={edu.graduationDate} 
                        onChange={(e) => {
                          const newEducation = [...resumeData.education];
                          newEducation[index] = { ...edu, graduationDate: e.target.value };
                          setResumeData(prev => ({ ...prev, education: newEducation }));
                        }}
                        placeholder="May 2025" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Relevant Coursework</label>
                    <Textarea 
                      value={edu.relevant} 
                      onChange={(e) => {
                        const newEducation = [...resumeData.education];
                        newEducation[index] = { ...edu, relevant: e.target.value };
                        setResumeData(prev => ({ ...prev, education: newEducation }));
                      }}
                      placeholder="Data Structures, Algorithms, Software Engineering" 
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Experience</h3>
              <Button size="sm" variant="outline" onClick={() => handleSectionAdd('experience')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
            {resumeData.experience && resumeData.experience.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <Card key={exp.id || index} className="p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <Input 
                          value={exp.company || ''} 
                          onChange={(e) => {
                            const newExperience = [...resumeData.experience];
                            newExperience[index] = { ...exp, company: e.target.value };
                            setResumeData(prev => ({ ...prev, experience: newExperience }));
                          }}
                          placeholder="Company Name" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Position</label>
                        <Input 
                          value={exp.position || ''} 
                          onChange={(e) => {
                            const newExperience = [...resumeData.experience];
                            newExperience[index] = { ...exp, position: e.target.value };
                            setResumeData(prev => ({ ...prev, experience: newExperience }));
                          }}
                          placeholder="Job Title" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <Input 
                          value={exp.duration || ''} 
                          onChange={(e) => {
                            const newExperience = [...resumeData.experience];
                            newExperience[index] = { ...exp, duration: e.target.value };
                            setResumeData(prev => ({ ...prev, experience: newExperience }));
                          }}
                          placeholder="Jan 2023 - Present" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input 
                          value={exp.location || ''} 
                          onChange={(e) => {
                            const newExperience = [...resumeData.experience];
                            newExperience[index] = { ...exp, location: e.target.value };
                            setResumeData(prev => ({ ...prev, experience: newExperience }));
                          }}
                          placeholder="City, State" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={exp.description || ''} 
                        onChange={(e) => {
                          const newExperience = [...resumeData.experience];
                          newExperience[index] = { ...exp, description: e.target.value };
                          setResumeData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        placeholder="Describe your role and achievements..." 
                        className="min-h-20"
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-muted rounded-lg">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No experience added yet</p>
                <Button onClick={handleAIEnhance} className="gradient-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use AI to Add Experience
                </Button>
              </div>
            )}
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Skills</h3>
              <Button size="sm" variant="outline" onClick={() => handleSectionAdd('skills')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
            {resumeData.skills && resumeData.skills.length > 0 ? (
              resumeData.skills.map((skill, index) => (
                <Card key={skill.id || index} className="p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium">Skill Name</label>
                        <Input 
                          value={skill.name} 
                          onChange={(e) => {
                            const newSkills = [...resumeData.skills];
                            newSkills[index] = { ...skill, name: e.target.value };
                            setResumeData(prev => ({ ...prev, skills: newSkills }));
                          }}
                          placeholder="e.g., React, Python, AWS" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Level</label>
                        <select 
                          value={skill.level} 
                          onChange={(e) => {
                            const newSkills = [...resumeData.skills];
                            newSkills[index] = { ...skill, level: e.target.value };
                            setResumeData(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="w-full px-3 py-2 border border-input rounded-md text-sm"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <select 
                          value={skill.category} 
                          onChange={(e) => {
                            const newSkills = [...resumeData.skills];
                            newSkills[index] = { ...skill, category: e.target.value };
                            setResumeData(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="w-full px-3 py-2 border border-input rounded-md text-sm"
                        >
                          <option value="Technical">Technical</option>
                          <option value="Soft Skills">Soft Skills</option>
                          <option value="Languages">Languages</option>
                          <option value="Tools">Tools</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-muted rounded-lg">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No skills added yet</p>
                <Button onClick={handleAIEnhance} className="gradient-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use AI to Suggest Skills
                </Button>
              </div>
            )}
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
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            <Brain className="w-4 h-4 mr-3 text-purple-500" />
            AI Resume Analysis
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

                {resumeData.experience && resumeData.experience.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      EXPERIENCE
                    </h2>
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id || index} className="mt-3">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{exp.position}</div>
                            <div className="text-sm">{exp.company}</div>
                          </div>
                          <div className="text-right text-sm">
                            <div>{exp.duration}</div>
                            <div>{exp.location}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {exp.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      SKILLS
                    </h2>
                    <div className="mt-3 space-y-2">
                      {resumeData.skills.map((skill, index) => (
                        <div key={skill.id || index} className="flex justify-between items-center">
                          <span className="font-medium">{skill.name}</span>
                          <div className="text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded mr-2">{skill.level}</span>
                            <span className="text-xs">{skill.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.experience && resumeData.experience.length === 0 && 
                 resumeData.skills && resumeData.skills.length === 0 && (
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

      {/* Right Panel - Content Editor & Job Tracking */}
      <div className="w-96 border-l border-border bg-card overflow-y-auto">
        {/* AI Analysis Panel */}
        {showAIPanel && (
          <div className="p-6 border-b border-border bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-purple-800">AI Resume Analysis</h2>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowAIPanel(false)}
              >
                ×
              </Button>
            </div>
            
            {isAIAnalyzing ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-sm text-purple-600">AI is analyzing your resume...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => selectedJobForAI && analyzeJobWithAI(selectedJobForAI)}
                  disabled={!selectedJobForAI}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Full Resume Analysis
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => selectedJobForAI && optimizeForATS(selectedJobForAI)}
                  disabled={!selectedJobForAI}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  ATS Optimization
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleAIEnhance}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Experience Enhancement
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Job Application Tracking Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Job Applications</h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowJobForm(!showJobForm)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </Button>
          </div>
          
          {/* Add Job Form */}
          {showJobForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-4 bg-muted/50 rounded-lg mb-4"
            >
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <Input
                  value={newJob.position}
                  onChange={(e) => setNewJob({...newJob, position: e.target.value})}
                  placeholder="Job Title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Job URL</label>
                <div className="flex space-x-2">
                  <Input
                    value={newJob.url}
                    onChange={(e) => setNewJob({...newJob, url: e.target.value})}
                    placeholder="https://company.com/careers/job"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => scrapeJobDescription(newJob.url)}
                    disabled={!newJob.url || isAIAnalyzing}
                  >
                    {isAIAnalyzing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-1" />
                        Scrape
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Paste the job description here for AI analysis..."
                  className="min-h-20"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={addJobApplication}
                  disabled={!newJob.company || !newJob.position}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowJobForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Job Applications List */}
          <div className="space-y-3">
            {jobApplications.map((job) => (
              <Card key={job.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{job.position}</h4>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeJobApplication(job.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {job.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openJobUrl(job.url)}
                        className="text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Job
                      </Button>
                    )}
                    {job.description && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyJobDescription(job.description)}
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Description
                      </Button>
                    )}
                  </div>

                  {/* AI Analysis Buttons */}
                  {job.description && (
                    <div className="pt-2 border-t border-muted space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedJobForAI(job);
                            setShowAIPanel(true);
                          }}
                          className="text-xs"
                        >
                          <Brain className="w-3 h-3 mr-1" />
                          AI Analysis
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => optimizeForATS(job)}
                          className="text-xs"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          ATS Optimize
                        </Button>
                      </div>
                      
                      {/* Job Description Summary */}
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1 mb-1">
                          <Target className="w-3 h-3" />
                          <span className="font-medium">Key Requirements:</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          {job.description.length > 100 
                            ? `${job.description.substring(0, 100)}...` 
                            : job.description
                          }
                        </div>
                      </div>
                    </div>
                  )}

                  {job.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {job.description.substring(0, 100)}...
                    </div>
                  )}
                </div>
              </Card>
            ))}
            
            {jobApplications.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No job applications yet</p>
                <p className="text-xs">Add jobs to track your applications</p>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Template Selection */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Template</h2>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Job-Specific Template Recommendations */}
          {selectedJobForAI && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Template for {selectedJobForAI.company}
                </span>
              </div>
              <p className="text-xs text-blue-600">
                Based on job requirements, we recommend the <strong>Technical</strong> template for best ATS compatibility.
              </p>
            </div>
          )}
          
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
                    {selectedJobForAI && template.id === 'technical' && (
                      <Badge className="text-xs mt-1 bg-blue-100 text-blue-700">
                        Recommended
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resume Upload Section */}
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold mb-4">Resume Upload</h2>
          
          {!uploadedResume ? (
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload your existing resume to get started
              </p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button className="gradient-primary cursor-pointer">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Resume
                      </>
                    )}
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX, and TXT files
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{uploadedResume.name}</p>
                    <p className="text-sm text-green-600">Resume uploaded successfully</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setUploadedResume(null);
                    setResumeText('');
                  }}
                >
                  Remove
                </Button>
              </div>
              
              {resumeText && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Extracted Text Preview:</p>
                  <div className="text-xs bg-white p-2 rounded border max-h-20 overflow-y-auto">
                    {resumeText.substring(0, 200)}...
                  </div>
                </div>
              )}

              {/* Resume Actions */}
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveSection('personal')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Edit Resume
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowJobForm(true)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Resume Success Tracking */}
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold mb-4">Resume Performance</h2>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Successful Applications</span>
                </div>
                <Badge className="bg-green-100 text-green-700">3</Badge>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Resumes that led to interviews or offers
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Pending Applications</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">2</Badge>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                Applications still under review
              </p>
            </div>
            
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Rejected Applications</span>
                </div>
                <Badge className="bg-red-100 text-red-700">1</Badge>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Resumes that didn't work - use AI to improve
              </p>
            </div>
          </div>
        </div>

        {/* Section Editor */}
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

      {/* AI Results Modal */}
      {aiAnalysisResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">AI Analysis Results</h2>
              <Button
                variant="ghost"
                onClick={() => setAiAnalysisResults(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-6">
              {aiAnalysisResults.jobAnalysis && (
                <div>
                  <h3 className="font-semibold mb-2">Job Analysis</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {aiService.formatAIResponse(aiAnalysisResults.jobAnalysis, 'job_analysis')}
                    </pre>
                  </div>
                </div>
              )}
              
              {aiAnalysisResults.resumeTailoring && (
                <div>
                  <h3 className="font-semibold mb-2">Resume Tailoring</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {aiService.formatAIResponse(aiAnalysisResults.resumeTailoring, 'resume_tailoring')}
                    </pre>
                  </div>
                </div>
              )}
              
              {aiAnalysisResults.coverLetter && (
                <div>
                  <h3 className="font-semibold mb-2">Cover Letter</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {aiService.formatAIResponse(aiAnalysisResults.coverLetter, 'cover_letter')}
                    </pre>
                  </div>
                </div>
              )}
              
              {aiAnalysisResults.atsOptimization && (
                <div>
                  <h3 className="font-semibold mb-2">ATS Optimization</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(aiAnalysisResults.atsOptimization, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              {aiAnalysisResults.resumeTailoring && (
                <Button 
                  onClick={() => {
                    if (aiAnalysisResults.resumeTailoring) {
                      applyAISuggestionsToResume({
                        ats_improvements: aiAnalysisResults.resumeTailoring.ats_improvements,
                        keywords: aiAnalysisResults.resumeTailoring.keywords
                      });
                      alert('AI suggestions applied to your resume!');
                    }
                  }}
                  className="gradient-primary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply AI Suggestions
                </Button>
              )}
              <Button onClick={() => setAiAnalysisResults(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}