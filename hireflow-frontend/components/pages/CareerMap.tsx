import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Star,
  BookOpen,
  Target,
  Zap,
  MapPin,
  GraduationCap,
  Building
} from 'lucide-react';
import { Page } from '../../App';

interface CareerMapProps {
  user: any;
  onNavigate: (page: Page) => void;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  startingSalary: string;
  midCareerSalary: string;
  growth: string;
  timeToAdvance: string;
  skills: string[];
  companies: string[];
  satisfaction: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  pathLength: number;
  connections: string[];
}

const careerPaths: CareerPath[] = [
  {
    id: 'swe',
    title: 'Software Engineer',
    description: 'Design and build software applications and systems',
    startingSalary: '$95,000',
    midCareerSalary: '$150,000',
    growth: '+22%',
    timeToAdvance: '3-5 years',
    skills: ['Programming', 'Problem Solving', 'System Design', 'Testing'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Meta'],
    satisfaction: 4.2,
    demandLevel: 'High',
    pathLength: 4,
    connections: ['pm', 'data-scientist', 'dev-ops']
  },
  {
    id: 'pm',
    title: 'Product Manager',
    description: 'Lead product strategy and coordinate cross-functional teams',
    startingSalary: '$110,000',
    midCareerSalary: '$180,000',
    growth: '+19%',
    timeToAdvance: '2-4 years',
    skills: ['Strategy', 'Communication', 'Analytics', 'Leadership'],
    companies: ['Apple', 'Google', 'Amazon', 'Spotify'],
    satisfaction: 4.0,
    demandLevel: 'High',
    pathLength: 4,
    connections: ['swe', 'data-scientist', 'designer']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Extract insights from data to drive business decisions',
    startingSalary: '$100,000',
    midCareerSalary: '$160,000',
    growth: '+25%',
    timeToAdvance: '3-5 years',
    skills: ['Statistics', 'Python/R', 'Machine Learning', 'Visualization'],
    companies: ['Netflix', 'Uber', 'Airbnb', 'Tesla'],
    satisfaction: 4.1,
    demandLevel: 'High',
    pathLength: 5,
    connections: ['swe', 'pm', 'ml-engineer']
  },
  {
    id: 'designer',
    title: 'UX Designer',
    description: 'Create user-centered designs for digital products',
    startingSalary: '$85,000',
    midCareerSalary: '$130,000',
    growth: '+13%',
    timeToAdvance: '3-6 years',
    skills: ['Design Thinking', 'Prototyping', 'User Research', 'Visual Design'],
    companies: ['Apple', 'Adobe', 'Figma', 'Airbnb'],
    satisfaction: 4.3,
    demandLevel: 'Medium',
    pathLength: 4,
    connections: ['pm', 'frontend']
  },
  {
    id: 'dev-ops',
    title: 'DevOps Engineer',
    description: 'Manage infrastructure and deployment pipelines',
    startingSalary: '$90,000',
    midCareerSalary: '$145,000',
    growth: '+21%',
    timeToAdvance: '2-4 years',
    skills: ['Cloud Platforms', 'Automation', 'Monitoring', 'Security'],
    companies: ['AWS', 'Google Cloud', 'Microsoft', 'Netflix'],
    satisfaction: 4.0,
    demandLevel: 'High',
    pathLength: 3,
    connections: ['swe', 'security']
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    description: 'Build and deploy machine learning models at scale',
    startingSalary: '$115,000',
    midCareerSalary: '$175,000',
    growth: '+30%',
    timeToAdvance: '3-5 years',
    skills: ['ML/AI', 'Python', 'MLOps', 'Deep Learning'],
    companies: ['OpenAI', 'Google', 'Tesla', 'NVIDIA'],
    satisfaction: 4.4,
    demandLevel: 'High',
    pathLength: 5,
    connections: ['data-scientist', 'swe']
  }
];

export default function CareerMap({ user, onNavigate }: CareerMapProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>('swe');
  const [showConnections, setShowConnections] = useState(true);

  // Create currentStudent object using the user prop
  const currentStudent = {
    major: user?.major || 'Computer Science',
    year: user?.year || 'Junior',
    skills: ['Java', 'Python', 'React', 'Data Structures'],
    interests: ['Technology', 'Problem Solving', 'Innovation']
  };

  const getMatchScore = (path: CareerPath) => {
    // Simple matching algorithm based on skills overlap
    const studentSkills = currentStudent.skills.map(s => s.toLowerCase());
    const pathSkills = path.skills.map(s => s.toLowerCase());
    const overlap = pathSkills.filter(skill => 
      studentSkills.some(studentSkill => 
        skill.includes(studentSkill) || studentSkill.includes(skill)
      )
    ).length;
    return Math.min(95, Math.max(65, (overlap / pathSkills.length) * 100 + Math.random() * 10));
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const CareerNode = ({ path, isSelected, onClick }: { 
    path: CareerPath; 
    isSelected: boolean; 
    onClick: () => void; 
  }) => {
    const matchScore = Math.round(getMatchScore(path));
    
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative cursor-pointer ${isSelected ? 'z-10' : ''}`}
        onClick={onClick}
      >
        <Card className={`border-2 transition-all duration-300 ${
          isSelected 
            ? 'border-red-500 shadow-lg bg-red-50' 
            : 'border-border hover:border-red-200 hover:shadow-md'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{path.title}</h3>
              <Badge className={`text-xs ${getDemandColor(path.demandLevel)}`}>
                {path.demandLevel}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {path.description}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Match</span>
                <span className="font-medium text-red-600">{matchScore}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Starting</span>
                <span className="font-medium text-green-600">{path.startingSalary}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{path.satisfaction}/5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection lines */}
        {showConnections && isSelected && path.connections.map((connectionId) => {
          const connectedPath = careerPaths.find(p => p.id === connectionId);
          if (!connectedPath) return null;
          
          return (
            <motion.div
              key={connectionId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute top-1/2 left-full w-16 h-0.5 bg-red-300 pointer-events-none"
              style={{ transform: 'translateY(-50%)' }}
            />
          );
        })}
      </motion.div>
    );
  };

  const selectedPathData = careerPaths.find(p => p.id === selectedPath);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Career Path Explorer</h1>
              <p className="text-muted-foreground">
                Discover career opportunities based on your {currentStudent.major} major
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Career Guide
              </Button>
              <Button className="gradient-primary" onClick={() => onNavigate('job-discovery')}>
                <Target className="w-4 h-4 mr-2" />
                Find Jobs
              </Button>
            </div>
          </div>

          {/* Student Profile */}
          <Card className="mt-6 border-2 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentStudent.major} • {currentStudent.year} • University of Maryland
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Current Skills</p>
                  <div className="flex space-x-1 mt-1">
                    {currentStudent.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      +{currentStudent.skills.length - 3}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Career Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interactive Career Map</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConnections(!showConnections)}
                  >
                    {showConnections ? 'Hide' : 'Show'} Connections
                  </Button>
                </div>
                <CardDescription>
                  Click on career paths to explore opportunities and connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {careerPaths.map((path) => (
                    <CareerNode
                      key={path.id}
                      path={path}
                      isSelected={selectedPath === path.id}
                      onClick={() => setSelectedPath(path.id)}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-3">Legend</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>High Demand</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Medium Demand</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Selected Path</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Path Details */}
          <div>
            <AnimatePresence mode="wait">
              {selectedPathData && (
                <motion.div
                  key={selectedPath}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2 text-red-600" />
                        {selectedPathData.title}
                      </CardTitle>
                      <CardDescription>{selectedPathData.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Match Score */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Your Match</span>
                          <span className="font-medium">{Math.round(getMatchScore(selectedPathData))}%</span>
                        </div>
                        <Progress value={getMatchScore(selectedPathData)} className="h-2" />
                      </div>

                      {/* Salary Info */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Salary Range
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Entry Level</span>
                            <span className="font-medium text-green-600">{selectedPathData.startingSalary}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Mid Career</span>
                            <span className="font-medium text-green-600">{selectedPathData.midCareerSalary}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Growth Rate</span>
                            <span className="font-medium text-blue-600">{selectedPathData.growth}</span>
                          </div>
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          Key Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPathData.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Top Companies */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Top Companies
                        </h4>
                        <div className="space-y-2">
                          {selectedPathData.companies.map((company) => (
                            <div key={company} className="flex items-center justify-between text-sm">
                              <span>{company}</span>
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Career Timeline */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Typical Timeline
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>Time to advance: {selectedPathData.timeToAdvance}</p>
                          <p>Job satisfaction: {selectedPathData.satisfaction}/5.0</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button className="w-full gradient-primary" onClick={() => onNavigate('job-discovery')}>
                          Find {selectedPathData.title} Jobs
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => onNavigate('resume-builder')}>
                          Optimize Resume for This Path
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <BookOpen className="w-4 h-4 mr-3" />
                  Take Career Assessment Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Users className="w-4 h-4 mr-3" />
                  Connect with Alumni
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  View Market Trends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}