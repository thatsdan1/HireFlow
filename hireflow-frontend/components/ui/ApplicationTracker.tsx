import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type ApplicationStatus = 'Applied' | 'Viewed' | 'Interview Scheduled' | 'Interview Completed' | 'Offer Received' | 'Rejected' | 'Withdrawn';

interface Application {
  id: number;
  company: string;
  position: string;
  appliedDate: string;
  status: ApplicationStatus;
  resumeUsed: string;
  notes: string;
}

export default function ApplicationsTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const applications: Application[] = [
    {
      id: 1,
      company: 'TechCorp',
      position: 'Software Engineer',
      appliedDate: '2024-01-15',
      status: 'Interview Scheduled',
      resumeUsed: 'Technical Template',
      notes: 'Follow up scheduled for next Tuesday'
    },
    {
      id: 2,
      company: 'Analytics Inc',
      position: 'Data Analyst',
      appliedDate: '2024-01-12',
      status: 'Viewed',
      resumeUsed: 'Professional Template',
      notes: 'Application viewed 3 times'
    },
    {
      id: 3,
      company: 'Design Studio',
      position: 'UX Designer',
      appliedDate: '2024-01-10',
      status: 'Rejected',
      resumeUsed: 'Creative Template',
      notes: 'Feedback: Looking for more senior candidate'
    },
    {
      id: 4,
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      appliedDate: '2024-01-08',
      status: 'Interview Completed',
      resumeUsed: 'Technical Template',
      notes: 'Waiting for final decision'
    },
    {
      id: 5,
      company: 'Marketing Pro',
      position: 'Digital Marketing Manager',
      appliedDate: '2024-01-05',
      status: 'Applied',
      resumeUsed: 'Professional Template',
      notes: 'Initial application submitted'
    }
  ];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return 'secondary';
      case 'Viewed':
        return 'outline';
      case 'Interview Scheduled':
      case 'Interview Completed':
        return 'default';
      case 'Offer Received':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Withdrawn':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: applications.length,
    pending: applications.filter(app => ['Applied', 'Viewed'].includes(app.status)).length,
    interviews: applications.filter(app => ['Interview Scheduled', 'Interview Completed'].includes(app.status)).length,
    closed: applications.filter(app => ['Offer Received', 'Rejected', 'Withdrawn'].includes(app.status)).length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Applications Tracker</h1>
        <p className="text-muted-foreground">
          Track the status of your job applications and interview progress
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Interview Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.interviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Manage and track your job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search companies or positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Viewed">Viewed</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="Interview Completed">Interview Completed</SelectItem>
                <SelectItem value="Offer Received">Offer Received</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resume Used</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.company}</TableCell>
                    <TableCell>{application.position}</TableCell>
                    <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{application.resumeUsed}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-48 truncate">
                      {application.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}