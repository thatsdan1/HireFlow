import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ExperienceTranslator from './pages/ExperienceTranslator';
import ApplicationTracker from './pages/ApplicationTracker';
import JobDiscovery from './pages/jobDiscovery';
import CareerMap from './pages/CareerMap';
import InterviewPrep from './pages/InterviewPrep';
import Sidebar from './layout/Sidebar';
import MobileNav from './layout/MobileNav';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

export type Page = 
  | 'landing'
  | 'dashboard' 
  | 'resume-builder'
  | 'experience-translator'
  | 'applications'
  | 'job-discovery'
  | 'career-map'
  | 'interview-prep';

interface User {
  name: string;
  email: string;
  university: string;
  major: string;
  year: string;
  avatar?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = (userData: User) => {
    console.log('App: handleLogin called with:', userData);
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    console.log('App: User logged in, current page set to dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('landing');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Landing page - no authentication required
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <LandingPage onLogin={handleLogin} />
      </div>
    );
  }

  // Main application layout
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`${isMobile ? 'fixed z-50' : 'relative'}`}
          >
            <Sidebar
              currentPage={currentPage}
              onNavigate={navigateTo}
              onLogout={handleLogout}
              user={user}
              onClose={() => setSidebarOpen(false)}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        {isMobile && (
          <MobileNav
            currentPage={currentPage}
            onNavigate={navigateTo}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            user={user}
          />
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {currentPage === 'dashboard' && <Dashboard user={user} onNavigate={navigateTo} />}
              {currentPage === 'resume-builder' && <ResumeBuilder user={user} onNavigate={navigateTo} />}
              {currentPage === 'experience-translator' && <ExperienceTranslator user={user} onNavigate={navigateTo} />}
              {currentPage === 'applications' && <ApplicationTracker user={user} onNavigate={navigateTo} />}
              {currentPage === 'job-discovery' && <JobDiscovery user={user} onNavigate={navigateTo} />}
              {currentPage === 'career-map' && <CareerMap user={user} onNavigate={navigateTo} />}
              {currentPage === 'interview-prep' && <InterviewPrep user={user} onNavigate={navigateTo} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Assistant FAB */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", damping: 15 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 gradient-primary"
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}