import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  FileText,
  Sparkles,
  Upload,
  PlusCircle,
  ArrowRight,
  Calendar,
  Zap,
  BookOpen,
  Users,
  BarChart3,
  LinkIcon,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { Page } from '../App';

interface DashboardProps {
  user: any;
  onNavigate: (page: Page) => void;
}

const motivationalQuotes = [
  "Every Terp has the potential for greatness. Keep building! 🐢",
  "Your next opportunity is one application away.",
  "Turn your UMD experience into professional success.",
  "Great careers start with great resumes - Fear the Turtle! 🐢",
  "Your student experience has more value than you think."
];

export default function Dashboard({ user, onNavigate }: DashboardProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    applications: 0,
    interviewRate: 0,
    daysUntilDeadline: 0,
    profileCompletion: 0
  });

  const stats = {
    applications: 15,
    interviewRate: 28,
    daysUntilDeadline: 5,
    profileCompletion: 82
  };

  // Animate stats on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDelay = duration / steps;

    const timer = setInterval(() => {
      setAnimatedStats(prev => ({
        applications: Math.min(prev.applications + stats.applications / steps, stats.applications),
        interviewRate: Math.min(prev.interviewRate + stats.interviewRate / steps, stats.interviewRate),
        daysUntilDeadline: Math.min(prev.daysUntilDeadline + stats.daysUntilDeadline / steps, stats.daysUntilDeadline),
        profileCompletion: Math.min(prev.profileCompletion + stats.profileCompletion / steps, stats.profileCompletion)
      }));
    }, stepDelay);

    setTimeout(() => clearInterval(timer), duration);
    return () => clearInterval(timer);
  }, []);

  // Cycle quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'Applied to Software Engineering Intern at Amazon',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'resume',
      title: 'Updated resume with AI Experience Translator',
      time: '1 day ago',
      status: 'neutral'
    },
    {
      id: 3,
      type: 'interview',
      title: 'Interview scheduled with Capital One (McLean, VA)',
      time: '2 days ago',
      status: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'LinkedIn Import',
      description: 'Import your LinkedIn profile',
      icon: LinkIcon,
      action: () => onNavigate('resume-builder'),
      color: 'bg-blue-500'
    },
    {
      title: 'Upload Resume',
      description: 'Upload existing resume',
      icon: Upload,
      action: () => onNavigate('resume-builder'),
      color: 'bg-green-500'
    },
    {
      title: 'Start from Scratch',
      description: 'Guided resume wizard',
      icon: PlusCircle,
      action: () => onNavigate('resume-builder'),
      color: 'bg-red-500'
    }
  ];

  const tools = [
    {
      title: 'Resume Builder',
      description: 'Create ATS-optimized resumes',
      icon: FileText,
      action: () => onNavigate('resume-builder'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Experience Translator',
      description: 'AI-powered experience enhancement',
      icon: Sparkles,
      action: () => onNavigate('experience-translator'),
      color: 'from-red-500 to-red-600',
      featured: true
    },
    {
      title: 'Application Tracker',
      description: 'Track your job applications',
      icon: BarChart3,
      action: () => onNavigate('applications'),
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const umdOpportunities = [
    {
      title: 'UMD Career Fair',
      date: 'March 15, 2024',
      location: 'Stamp Student Union',
      type: 'career-fair'
    },
    {
      title: 'Computer Science Info Session',
      date: 'March 20, 2024',
      location: 'Iribe Center',
      type: 'info-session'
    },
    {
      title: 'Summer Internship Deadline',
      date: 'March 31, 2024',
      location: 'Various Companies',
      type: 'deadline'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              Welcome back, {user?.name?.split(' ')[0] || 'Terp'}! 
              <span className="ml-2 text-2xl">🐢</span>
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-1 border-red-200 text-red-700 bg-red-50">
                <GraduationCap className="w-3 h-3 mr-1" />
                University of Maryland
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1 border-yellow-200 text-yellow-700 bg-yellow-50">
                <MapPin className="w-3 h-3 mr-1" />
                College Park
              </Badge>
            </div>
            <div className="h-6 mt-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentQuote}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-muted-foreground"
                >
                  {motivationalQuotes[currentQuote]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="relative overflow-hidden border-l-4 border-l-red-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-bl-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {Math.round(animatedStats.applications)}
            </div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-bl-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(animatedStats.interviewRate)}%
            </div>
            <p className="text-xs text-muted-foreground">Above UMD average 📈</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-yellow-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-bl-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(animatedStats.daysUntilDeadline)} days
            </div>
            <p className="text-xs text-muted-foreground">Amazon internship</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-bl-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Complete</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(animatedStats.profileCompletion)}%
            </div>
            <Progress value={animatedStats.profileCompletion} className="mt-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Start Building Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="gradient-umd text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Start Building Your Resume
            </CardTitle>
            <CardDescription className="text-red-100">
              Choose how you'd like to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                >
                  <Button
                    onClick={action.action}
                    variant="outline"
                    className="w-full h-auto p-4 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-red-100">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold">Resume Tools</h3>
          <div className="space-y-4">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <Card 
                  className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                    tool.featured 
                      ? 'border-red-200 bg-gradient-to-br from-red-50 to-yellow-50' 
                      : 'hover:border-red-100'
                  }`}
                  onClick={tool.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                          <tool.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{tool.title}</h4>
                            {tool.featured && (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* UMD Opportunities & Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* UMD Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-red-600" />
                UMD Opportunities
              </CardTitle>
              <CardDescription>Upcoming events and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {umdOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      opportunity.type === 'career-fair' ? 'bg-red-500' : 
                      opportunity.type === 'info-session' ? 'bg-yellow-500' : 
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{opportunity.title}</p>
                      <p className="text-xs text-muted-foreground">{opportunity.date} • {opportunity.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}