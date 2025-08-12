import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Sparkles,
  BarChart3,
  Search,
  Map,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { Page } from '../App';

interface MobileNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  user: any;
}

export default function MobileNav({ currentPage, onNavigate, sidebarOpen, onToggleSidebar, user }: MobileNavProps) {
  const getPageTitle = (page: Page) => {
    switch (page) {
      case 'dashboard': return 'Dashboard';
      case 'resume-builder': return 'Resume Builder';
      case 'experience-translator': return 'Experience Translator';
      case 'applications': return 'Applications';
      case 'job-discovery': return 'Find Jobs';
      case 'career-map': return 'Career Map';
      case 'interview-prep': return 'Interview Prep';
      default: return 'ResumeForge';
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="bg-white border-b border-border shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30"
    >
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div>
          <h1 className="font-semibold text-lg">{getPageTitle(currentPage)}</h1>
          {currentPage === 'experience-translator' && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 mt-1">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="p-2">
          <Search className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" size="sm" className="p-2 relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
        </Button>

        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-medium">
            {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.header>
  );
}