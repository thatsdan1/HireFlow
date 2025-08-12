import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  LayoutDashboard,
  FileText,
  Sparkles,
  BarChart3,
  Search,
  Map,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Crown,
  BookOpen,
  Briefcase,
  Target,
  GraduationCap
} from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: any;
  onClose: () => void;
  isMobile: boolean;
}

export default function Sidebar({ currentPage, onNavigate, onLogout, user, onClose, isMobile }: SidebarProps) {
  const navigationItems = [
    {
      section: "Overview",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Your progress hub' },
      ]
    },
    {
      section: "Build & Create",
      items: [
        { id: 'resume-builder', label: 'Resume Builder', icon: FileText, description: 'Create and edit resumes' },
        { id: 'experience-translator', label: 'Experience Translator', icon: Sparkles, description: 'Turn activities into experience', highlight: true },
      ]
    },
    {
      section: "Apply & Track",
      items: [
        { id: 'applications', label: 'Application Tracker', icon: BarChart3, description: 'Track your applications' },
        { id: 'job-discovery', label: 'Find Jobs', icon: Search, description: 'Discover opportunities' },
      ]
    },
    {
      section: "Career Growth",
      items: [
        { id: 'career-map', label: 'Career Map', icon: Map, description: 'Plan your career path' },
        { id: 'interview-prep', label: 'Interview Prep', icon: MessageSquare, description: 'Practice and prepare' },
      ]
    }
  ];

  const NavItem = ({ item, section }: { item: any, section: string }) => {
    const isActive = currentPage === item.id;
    
    return (
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <Button
          variant={isActive ? "default" : "ghost"}
          onClick={() => onNavigate(item.id)}
          className={`w-full justify-start h-auto p-3 ${
            isActive 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'hover:bg-accent text-foreground'
          }`}
        >
          <div className="flex items-center w-full">
            <item.icon className={`w-5 h-5 mr-3 ${
              item.highlight && !isActive ? 'text-red-500' : ''
            }`} />
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{item.label}</span>
                {item.highlight && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-red-100 text-red-700 border-red-200">
                    AI
                  </Badge>
                )}
              </div>
              <div className={`text-xs mt-0.5 ${
                isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {item.description}
              </div>
            </div>
          </div>
        </Button>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="w-80 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shadow-lg"
      initial={false}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                TerpsResume
              </span>
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-red-200 text-red-700 bg-red-50">
                UMD
              </Badge>
            </div>
          </div>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-red-100 text-red-600 font-medium">
              {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{user?.name || 'Student User'}</div>
            <div className="text-sm text-muted-foreground truncate">
              {user?.major || 'Undeclared'} • {user?.year || 'Sophomore'}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-red-200 text-red-700 bg-red-50">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-yellow-200 text-yellow-700 bg-yellow-50">
                🐢 Terp
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationItems.map((section, sectionIndex) => (
          <div key={section.section}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: (sectionIndex * section.items.length + itemIndex) * 0.05,
                    duration: 0.3 
                  }}
                >
                  <NavItem item={item} section={section.section} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </motion.div>
  );
}