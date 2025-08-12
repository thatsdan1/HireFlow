import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Search,
  MapPin,
  Building,
  Clock,
  DollarSign,
  Bookmark,
  ExternalLink,
  Filter,
  Star,
  TrendingUp,
  Users,
  Zap,
  Target,
  GraduationCap
} from 'lucide-react';
import { Page } from '../App';

interface JobDiscoveryProps {
  user: any;
  onNavigate: (page: Page) => void;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'internship' | 'entry-level' | 'co-op';
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  deadline?: string;
  remote: boolean;
  matchScore: number;
  saved: boolean;
  trending?: boolean;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'internship',
    salary: '$8,000/month',
    description: 'Join our team to work on cutting-edge projects that impact billions of users worldwide.',
    requirements: ['Computer Science major', 'Java/Python proficiency', '3.5+ GPA'],
    benefits: ['Housing stipend', 'Free meals', 'Mentorship program'],
    posted: '2 days ago',
    deadline: 'March 31, 2024',
    remote: false,
    matchScore: 95,
    saved: false,
    trending: true
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'internship',
    salary: '$7,500/month',
    description: 'Work with large-scale data to drive business decisions and improve customer experience.',
    requirements: ['Statistics/Math background', 'Python/R experience', 'Machine Learning knowledge'],
    benefits: ['Relocation assistance', 'Employee discounts', 'Career development'],
    posted: '1 day ago',
    deadline: 'April 15, 2024',
    remote: true,
    matchScore: 88,
    saved: true
  },
  {
    id: '3',
    title: 'Technology Analyst',
    company: 'Capital One',
    location: 'McLean, VA',
    type: 'entry-level',
    salary: '$85,000/year',
    description: 'Join our technology team to build innovative financial solutions.',
    requirements: ['CS/Engineering degree', 'Problem-solving skills', 'Leadership experience'],
    benefits: ['Health insurance', '401k matching', 'Flexible work'],
    posted: '3 days ago',
    remote: false,
    matchScore: 92,
    saved: false
  },
  {
    id: '4',
    title: 'UX Design Intern',
    company: 'Meta',
    location: 'Menlo Park, CA',
    type: 'internship',
    salary: '$8,500/month',
    description: 'Design user experiences for products used by billions of people.',
    requirements: ['Design portfolio', 'Figma/Sketch proficiency', 'User research experience'],
    benefits: ['Housing stipend', 'Transportation', 'Design mentorship'],
    posted: '1 week ago',
    deadline: 'March 25, 2024',
    remote: false,
    matchScore: 78,
    saved: false
  },
  {
    id: '5',
    title: 'Cybersecurity Co-op',
    company: 'Lockheed Martin',
    location: 'Bethesda, MD',
    type: 'co-op',
    salary: '$25/hour',
    description: 'Protect critical infrastructure through innovative cybersecurity solutions.',
    requirements: ['Security clearance eligible', 'Networking knowledge', 'US citizenship'],
    benefits: ['Security clearance sponsorship', 'Professional development', 'Full-time offer potential'],
    posted: '5 days ago',
    remote: false,
    matchScore: 85,
    saved: true
  },
  {
    id: '6',
    title: 'Product Management Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'internship',
    salary: '$7,800/month',
    description: 'Lead product strategy and work with engineering teams to build amazing products.',
    requirements: ['Business/CS background', 'Analytical skills', 'Communication skills'],
    benefits: ['Housing assistance', 'Mentorship', 'Product strategy training'],
    posted: '4 days ago',
    deadline: 'April 1, 2024',
    remote: true,
    matchScore: 90,
    saved: false,
    trending: true
  }
];

const categories = [
  { name: 'Software Engineering', count: 245, icon: '💻' },
  { name: 'Data Science', count: 156, icon: '📊' },
  { name: 'Product Management', count: 89, icon: '🚀' },
  { name: 'Design', count: 67, icon: '🎨' },
  { name: 'Marketing', count: 123, icon: '📱' },
  { name: 'Finance', count: 98, icon: '💰' }
];

const trendingCompanies = [
  { name: 'Google', openings: 45, growth: '+15%' },
  { name: 'Amazon', openings: 38, growth: '+22%' },
  { name: 'Microsoft', openings: 42, growth: '+18%' },
  { name: 'Meta', openings: 28, growth: '+8%' },
  { name: 'Apple', openings: 35, growth: '+12%' }
];

export default function JobDiscovery({ user, onNavigate }: JobDiscoveryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<string[]>(['2', '5']);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship': return 'bg-blue-100 text-blue-700';
      case 'entry-level': return 'bg-green-100 text-green-700';
      case 'co-op': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const JobCard = ({ job }: { job: Job }) => {
    const daysUntilDeadline = job.deadline ? 
      Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border-2 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-red-100 text-red-600 font-medium">
                    {job.company.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-muted-foreground">{job.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {job.trending && (
                  <Badge className="bg-red-100 text-red-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSaveJob(job.id)}
                  className={savedJobs.includes(job.id) ? 'text-yellow-500' : ''}
                >
                  <Bookmark className={`w-4 h-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                  {job.remote && <Badge variant="outline" className="text-xs">Remote</Badge>}
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.posted}</span>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-center space-x-1 text-sm">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-green-600">{job.salary}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(job.type)}>
                  {job.type}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">{job.matchScore}% match</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="space-y-2 mb-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground">Requirements:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {job.requirements.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.requirements.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {daysUntilDeadline && daysUntilDeadline <= 7 && (
              <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-700">
                  ⚡ Deadline in {daysUntilDeadline} days ({job.deadline})
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button size="sm" className="gradient-primary">
                  Quick Apply
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>4.2 rating</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Discover Your Next Opportunity</h1>
              <p className="text-muted-foreground">Find internships and entry-level positions tailored for UMD students</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved Jobs ({savedJobs.length})
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 gradient-primary">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-red-600" />
                  For UMD Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Jobs</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>New This Week</span>
                  <span className="font-medium text-green-600">+89</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remote Options</span>
                  <span className="font-medium">342</span>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Job Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingCompanies.map((company, index) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm">{company.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {company.openings} openings
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {company.growth}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Pills */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-sm font-medium">Show:</span>
              {['all', 'internship', 'entry-level', 'co-op'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter === 'all' ? 'All Jobs' : filter}
                </Button>
              ))}
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {mockJobs.length} jobs • Sorted by best match
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button variant="outline" size="sm">
                  Best Match
                </Button>
              </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AnimatePresence>
                {mockJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}