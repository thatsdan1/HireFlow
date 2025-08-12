import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Users, 
  Award, 
  TrendingUp,
  BookOpen,
  Briefcase,
  Heart,
  Rocket,
  Star,
  Quote,
  GraduationCap,
  X
} from 'lucide-react';

interface LandingPageProps {
  onLogin: (user: any) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [currentText, setCurrentText] = useState(0);
  const [email, setEmail] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const cyclingTexts = [
    "Turn your class project",
    "Turn your club leadership", 
    "Turn your part-time job",
    "Turn your volunteer work",
    "Turn your side project"
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI Experience Translator",
      description: "Transform any student activity into professional resume language",
      highlight: true
    },
    {
      icon: BookOpen,
      title: "Student-First Templates",
      description: "ATS-friendly designs that highlight your potential, not just experience"
    },
    {
      icon: TrendingUp,
      title: "Live ATS Scoring",
      description: "Real-time feedback on how applicant tracking systems rate your resume"
    },
    {
      icon: Users,
      title: "Peer Review Network",
      description: "Get feedback from students in your field and review others"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science, UMD",
      content: "Turned my class projects into a software engineer resume that got me interviews at Google and Meta!",
      rating: 5
    },
    {
      name: "Marcus Johnson", 
      role: "Business, UMD",
      content: "The Experience Translator helped me show how my campus job taught me real leadership skills.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Design, UMD",
      content: "Finally, a resume builder that understands what students actually do. Got my dream internship!",
      rating: 5
    }
  ];

  // Cycle through texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % cyclingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [cyclingTexts.length]);

  const handleGetStarted = () => {
    try {
      console.log('handleGetStarted called with email:', email);
      // Check if .edu email
      if (email.includes('.edu') || email.includes('umd.edu')) {
        console.log('Email is .edu, logging in...');
        // Auto-login with premium
        onLogin({
          name: 'Student User',
          email: email,
          university: 'University of Maryland',
          major: 'Undeclared',
          year: 'Sophomore'
        });
      } else {
        console.log('Email is not .edu, showing login modal');
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error('Error in handleGetStarted:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleLogin = () => {
    try {
      console.log('handleLogin called with:', { loginEmail, loginPassword });
      if (loginEmail && loginPassword) {
        console.log('Logging in user...');
        onLogin({
          name: 'Student User',
          email: loginEmail,
          university: 'University of Maryland',
          major: 'Undeclared',
          year: 'Sophomore'
        });
        setShowLoginModal(false);
      } else {
        console.log('Missing email or password');
        alert('Please enter both email and password');
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSignUp = () => {
    try {
      console.log('handleSignUp called');
      setShowLoginModal(true);
    } catch (error) {
      console.error('Error in handleSignUp:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleLoginButtonClick = () => {
    try {
      console.log('Login button clicked');
      setShowLoginModal(true);
    } catch (error) {
      console.error('Error in handleLoginButtonClick:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSignUpButtonClick = () => {
    try {
      console.log('Sign Up button clicked');
      handleSignUp();
    } catch (error) {
      console.error('Error in handleSignUpButtonClick:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleStartFreeClick = () => {
    try {
      console.log('Start Free button clicked!');
      handleGetStarted();
    } catch (error) {
      console.error('Error in handleStartFreeClick:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleFinalCTAClick = () => {
    try {
      console.log('Final CTA button clicked');
      handleSignUp();
    } catch (error) {
      console.error('Error in handleFinalCTAClick:', error);
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
              TerpsResume
            </span>
            <Badge variant="outline" className="text-xs px-2 py-1 border-red-200 text-red-700 bg-red-50">
              UMD
            </Badge>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <Button variant="ghost" onClick={handleLoginButtonClick}>Login</Button>
          <Button className="gradient-primary" onClick={handleSignUpButtonClick}>Sign Up Free</Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center space-x-3">
              <Badge variant="outline" className="px-4 py-2 border-red-200 text-red-700 bg-red-50">
                <GraduationCap className="w-4 h-4 mr-2" />
                Made for Terps, by Terps
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-yellow-200 text-yellow-700 bg-yellow-50">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Build a Resume That{' '}
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                Gets You Hired
              </span>
            </h1>
          </motion.div>

          {/* Animated cycling text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground space-y-2"
          >
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-red-600 font-medium"
                >
                  {cyclingTexts[currentText]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-foreground font-medium">
              Into professional experience
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto space-y-4"
          >
            <div className="flex gap-2">
              <Input
                placeholder="Enter your @umd.edu email for instant premium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              {/* Simplified button for testing */}
              <button 
                onClick={handleStartFreeClick}
                className="bg-gradient-to-r from-red-600 to-yellow-600 text-white px-8 py-3 rounded-lg font-medium hover:from-red-700 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ cursor: 'pointer' }}
              >
                Start Free <ArrowRight className="w-4 h-4 ml-2 inline" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              🐢 Free premium with @umd.edu email • No credit card required
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Finally, a resume builder that{' '}
              <span className="text-red-600">gets students</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop trying to fit your student experience into corporate templates. 
              Our AI understands what you've actually been doing at UMD.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 h-full border-2 transition-all duration-300 hover:shadow-lg ${
                  feature.highlight ? 'border-red-200 bg-red-50' : 'hover:border-red-100'
                }`}>
                  <CardContent className="p-0 space-y-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      feature.highlight ? 'bg-red-600' : 'bg-yellow-500'
                    }`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-12"
        >
          <h2 className="text-4xl font-bold">
            Loved by <span className="text-red-600">5,000+</span> UMD students
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-left border-2 hover:border-red-100 transition-all duration-300">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8 p-12 rounded-2xl gradient-umd"
        >
          <h2 className="text-4xl font-bold text-white">
            Ready to Fear the Turtle in the job market?
          </h2>
          <p className="text-xl text-red-100">
            Join thousands of Terps who've landed their dream jobs
          </p>
          <Button size="lg" variant="outline" className="bg-white text-red-600 hover:bg-red-50 border-white" onClick={handleFinalCTAClick}>
            Start Building Your Resume <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Welcome to TerpsResume</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowLoginModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your.email@umd.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full gradient-primary"
                  size="lg"
                >
                  Sign In
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button 
                      className="text-red-600 hover:text-red-700 font-medium"
                      onClick={() => {
                        setLoginEmail('');
                        setLoginPassword('');
                      }}
                    >
                      Sign up for free
                    </button>
                  </p>
                </div>

                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      onLogin({
                        name: 'Demo User',
                        email: 'demo@umd.edu',
                        university: 'University of Maryland',
                        major: 'Computer Science',
                        year: 'Junior'
                      });
                      setShowLoginModal(false);
                    }}
                  >
                    Try Demo Mode
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}