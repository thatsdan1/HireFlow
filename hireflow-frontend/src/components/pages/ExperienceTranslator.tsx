import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { 
  BookOpen,
  Users,
  Briefcase,
  Heart,
  Rocket,
  Microscope,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Save,
  ChevronLeft,
  Zap,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import { Page } from '../App';

interface ExperienceTranslatorProps {
  user: any;
  onNavigate: (page: Page) => void;
}

const experienceTypes = [
  {
    id: 'class-project',
    title: 'Class Project',
    description: 'Turn coursework into professional experience',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    example: 'Built a web application for my CS class'
  },
  {
    id: 'club-leadership',
    title: 'Club/Organization',
    description: 'Highlight leadership and teamwork skills',
    icon: Users,
    color: 'from-green-500 to-green-600',
    example: 'President of the Marketing Club'
  },
  {
    id: 'part-time-job',
    title: 'Part-time Job',
    description: 'Professional experience from any job',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    example: 'Worked as a barista at Starbucks'
  },
  {
    id: 'volunteer-work',
    title: 'Volunteer Work',
    description: 'Show impact and community involvement',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    example: 'Volunteered at local food bank'
  },
  {
    id: 'personal-project',
    title: 'Personal Project',
    description: 'Self-directed learning and initiative',
    icon: Rocket,
    color: 'from-orange-500 to-orange-600',
    example: 'Created a mobile app in my free time'
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Academic research and analysis skills',
    icon: Microscope,
    color: 'from-indigo-500 to-indigo-600',
    example: 'Research assistant in psychology lab'
  }
];

export default function ExperienceTranslator({ user, onNavigate }: ExperienceTranslatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(85);
  const [formality, setFormality] = useState(75);
  const [technicalDetail, setTechnicalDetail] = useState(60);
  const [quantification, setQuantification] = useState(80);

  const steps = [
    'Choose Experience Type',
    'Describe Your Experience', 
    'AI Translation',
    'Refine & Save'
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setCurrentStep(1);
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    setCurrentStep(2);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockTranslation = generateMockTranslation(userInput, selectedType);
      setTranslatedText(mockTranslation);
      setIsTranslating(false);
      setCurrentStep(3);
    }, 3000);
  };

  const generateMockTranslation = (input: string, type: string | null) => {
    // Mock AI translation based on type and input
    const templates = {
      'class-project': '• Developed and implemented a web application using modern technologies, demonstrating proficiency in full-stack development\n• Collaborated with team members to deliver project deliverables within tight deadlines\n• Applied software engineering principles to create scalable and maintainable code solutions',
      'club-leadership': '• Led cross-functional team of 15+ members to execute strategic initiatives and achieve organizational objectives\n• Developed and implemented marketing strategies that increased membership by 40% over one academic year\n• Coordinated events and programs, managing budgets of $5,000+ and ensuring successful project delivery',
      'part-time-job': '• Delivered exceptional customer service in fast-paced environment, serving 100+ customers daily\n• Demonstrated strong multitasking abilities while maintaining accuracy in order processing and cash handling\n• Collaborated with team members to optimize workflow efficiency and maintain service quality standards',
      'volunteer-work': '• Contributed 120+ volunteer hours to support community food security initiatives\n• Coordinated logistics for food distribution events, serving 200+ families weekly\n• Developed interpersonal skills while working with diverse community members and volunteers',
      'personal-project': '• Independently designed and developed mobile application using React Native and Node.js\n• Implemented user authentication and data management features, demonstrating self-directed learning capabilities\n• Published application to app stores, gaining 500+ downloads and positive user feedback',
      'research': '• Conducted quantitative research analysis using statistical software to support academic research objectives\n• Collected and analyzed data from 200+ participants, ensuring research protocol compliance\n• Presented findings at undergraduate research symposium, demonstrating scientific communication skills'
    };
    
    return templates[type as keyof typeof templates] || '• Professional experience bullet points will be generated here based on your input';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">What type of experience do you want to translate?</h2>
              <p className="text-muted-foreground">
                Choose the category that best matches your experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experienceTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                        <type.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                        <Badge variant="outline" className="text-xs">
                          e.g., {type.example}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 1:
        const selectedExperience = experienceTypes.find(t => t.id === selectedType);
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setCurrentStep(0)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold">Describe your {selectedExperience?.title?.toLowerCase()}</h2>
                <p className="text-muted-foreground">
                  Tell us about your experience in your own words - don't worry about making it sound professional yet!
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Experience</label>
                  <Textarea
                    placeholder={`Example: ${selectedExperience?.example}\n\nDescribe what you did, what you learned, any challenges you overcame, or impact you made. Be specific about numbers, tools, or technologies if relevant.`}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{userInput.length} characters</span>
                    <span>Minimum 50 characters recommended</span>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">💡 Tips for better results:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Include specific numbers, dates, or metrics when possible</li>
                    <li>• Mention any tools, software, or technologies you used</li>
                    <li>• Describe challenges you faced and how you solved them</li>
                    <li>• Note any positive outcomes or impact you made</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleTranslate}
                  disabled={userInput.length < 10}
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Transform with AI
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">AI is analyzing your experience...</h2>
                <p className="text-muted-foreground">
                  Transforming your description into professional resume language
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing...</span>
                  <span>{confidenceLevel}%</span>
                </div>
                <Progress value={confidenceLevel} className="h-2" />
              </div>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <TrendingUp className="w-8 h-8 mx-auto text-blue-500" />
                    <div className="font-medium">Analyzing Impact</div>
                    <div className="text-sm text-muted-foreground">Identifying key achievements</div>
                  </div>
                  <div className="space-y-2">
                    <Zap className="w-8 h-8 mx-auto text-purple-500" />
                    <div className="font-medium">Optimizing Language</div>
                    <div className="text-sm text-muted-foreground">Professional terminology</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Your professional experience is ready! ✨</h2>
              <p className="text-muted-foreground">
                Review and refine your AI-generated resume bullets
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Original vs Professional */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Original Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm bg-muted p-4 rounded-md">
                      {userInput}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                      Professional Version
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      {translatedText.split('\n').map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="flex items-start space-x-2"
                        >
                          <span className="text-purple-600 font-medium">•</span>
                          <span>{line.replace('• ', '')}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Customize Your Output</CardTitle>
                    <CardDescription>Adjust the tone and style to match your needs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Formality Level</label>
                      <Slider
                        value={formality}
                        onValueChange={setFormality}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Casual</span>
                        <span>Professional</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Technical Detail</label>
                      <Slider
                        value={technicalDetail}
                        onValueChange={setTechnicalDetail}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Simple</span>
                        <span>Technical</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantification</label>
                      <Slider
                        value={quantification}
                        onValueChange={setQuantification}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Qualitative</span>
                        <span>Numbers-heavy</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate with New Settings
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button 
                    onClick={() => onNavigate('resume-builder')}
                    className="w-full"
                    size="lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add to Resume
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save to Library
                  </Button>
                  <Button variant="ghost" className="w-full">
                    Generate Alternatives
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Experience Translator - Powered by AI
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Turn Any Experience Into Professional Resume Content
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI understands student experiences and transforms them into compelling professional language that recruiters love.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-purple-600">
              Step {currentStep + 1}: {steps[currentStep]}
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        {/* Social Proof */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>2,847 students used this today</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>95% saw improved interview rates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>ATS-optimized results</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}