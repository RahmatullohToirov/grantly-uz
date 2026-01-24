import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  useIsAdmin,
  useAdminScholarships,
  useCreateScholarship,
  useUpdateScholarship,
  useDeleteScholarship,
  useAdminUsers,
  useUserRoles,
  useAssignRole,
  useRemoveRole,
  useAdminStats,
  Scholarship,
  ScholarshipInput,
} from '@/hooks/useAdmin';
import {
  useAdminMentorApplications,
  useUpdateMentorApplicationStatus,
  useDeleteMentorApplication,
} from '@/hooks/useMentorApplications';
import { BulkScholarshipUpload } from '@/components/admin/BulkScholarshipUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  GraduationCap,
  Users,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Shield,
  Loader2,
  ShieldAlert,
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: stats } = useAdminStats();
  const { data: scholarships, isLoading: scholarshipsLoading } = useAdminScholarships();
  const { data: users } = useAdminUsers();
  const { data: roles } = useUserRoles();
  const { data: mentorApplications, isLoading: mentorAppsLoading } = useAdminMentorApplications();
  const createScholarship = useCreateScholarship();
  const updateScholarship = useUpdateScholarship();
  const deleteScholarship = useDeleteScholarship();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const updateMentorStatus = useUpdateMentorApplicationStatus();
  const deleteMentorApp = useDeleteMentorApplication();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [formData, setFormData] = useState<ScholarshipInput>({
    title: '',
    description: '',
    amount: undefined,
    deadline: '',
    location: '',
    category: '',
    link: '',
    requirements: '',
    source_name: '',
    source_url: '',
  });

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground text-center">
              You don't have permission to access the admin panel.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingScholarship) {
      await updateScholarship.mutateAsync({ id: editingScholarship.id, ...formData });
      setEditingScholarship(null);
    } else {
      await createScholarship.mutateAsync(formData);
      setIsCreateOpen(false);
    }
    
    setFormData({
      title: '',
      description: '',
      amount: undefined,
      deadline: '',
      location: '',
      category: '',
      link: '',
      requirements: '',
      source_name: '',
      source_url: '',
    });
  };

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      title: scholarship.title,
      description: scholarship.description || '',
      amount: scholarship.amount || undefined,
      deadline: scholarship.deadline || '',
      location: scholarship.location || '',
      category: scholarship.category || '',
      link: scholarship.link || '',
      requirements: scholarship.requirements || '',
      source_name: scholarship.source_name || '',
      source_url: scholarship.source_url || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this scholarship?')) {
      await deleteScholarship.mutateAsync(id);
    }
  };

  const getUserRole = (userId: string) => {
    return roles?.find(r => r.user_id === userId);
  };

  const handleAssignRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    const existingRole = getUserRole(userId);
    if (existingRole) {
      await removeRole.mutateAsync(existingRole.id);
    }
    if (role !== 'user') {
      await assignRole.mutateAsync({ userId, role });
    }
  };

  const ScholarshipForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., USA, UK, Global"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STEM">STEM</SelectItem>
              <SelectItem value="Arts">Arts & Humanities</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Community">Community Service</SelectItem>
              <SelectItem value="Exchange">Exchange Program</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link">Application Link</Label>
          <Input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          rows={2}
          placeholder="GPA requirements, eligibility criteria, etc."
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source_name">Source Name</Label>
          <Input
            id="source_name"
            value={formData.source_name}
            onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
            placeholder="e.g., Gates Foundation"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source_url">Source URL</Label>
          <Input
            id="source_url"
            type="url"
            value={formData.source_url}
            onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setEditingScholarship(null);
            setFormData({
              title: '',
              description: '',
              amount: undefined,
              deadline: '',
              location: '',
              category: '',
              link: '',
              requirements: '',
              source_name: '',
              source_url: '',
            });
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createScholarship.isPending || updateScholarship.isPending}>
          {(createScholarship.isPending || updateScholarship.isPending) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {editingScholarship ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Scholarships
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalScholarships || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scholarships" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="mentor-applications">Mentor Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="scholarships" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold">Manage Scholarships</h2>
                <p className="text-sm text-muted-foreground">
                  Add scholarships manually or upload in bulk from CSV/JSON files
                </p>
              </div>
              <div className="flex gap-2">
                <BulkScholarshipUpload />
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Manually
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Scholarship</DialogTitle>
                      <DialogDescription>
                        Add a single scholarship with all details
                      </DialogDescription>
                    </DialogHeader>
                    <ScholarshipForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {scholarshipsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : scholarships?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No scholarships yet. Add your first one!</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scholarships?.map((scholarship) => (
                      <TableRow key={scholarship.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {scholarship.title}
                        </TableCell>
                        <TableCell>
                          {scholarship.category && (
                            <Badge variant="secondary">{scholarship.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {scholarship.amount ? `$${scholarship.amount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell>
                          {scholarship.deadline
                            ? new Date(scholarship.deadline).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>{scholarship.location || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog
                              open={editingScholarship?.id === scholarship.id}
                              onOpenChange={(open) => {
                                if (!open) {
                                  setEditingScholarship(null);
                                  setFormData({
                                    title: '',
                                    description: '',
                                    amount: undefined,
                                    deadline: '',
                                    location: '',
                                    category: '',
                                    link: '',
                                    requirements: '',
                                    source_name: '',
                                    source_url: '',
                                  });
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(scholarship)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Scholarship</DialogTitle>
                                </DialogHeader>
                                <ScholarshipForm />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(scholarship.id)}
                              disabled={deleteScholarship.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="mentor-applications" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Mentor Applications</h2>
                <p className="text-sm text-muted-foreground">
                  Review and manage mentor applications from users
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {mentorApplications?.filter(a => a.status === 'pending').length || 0} Pending
              </Badge>
            </div>

            {mentorAppsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : mentorApplications?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No mentor applications yet.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentorApplications?.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={application.profile?.avatar_url || undefined} />
                              <AvatarFallback>
                                {application.profile?.full_name?.charAt(0) || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {application.profile?.full_name || 'Unknown'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {application.profile?.field_of_study || 'No field specified'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={application.has_experience ? 'default' : 'outline'}>
                            {application.has_experience ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              application.status === 'approved' ? 'default' :
                              application.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                            className="flex items-center gap-1 w-fit"
                          >
                            {application.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                            {application.status === 'rejected' && <XCircle className="h-3 w-3" />}
                            {application.status === 'pending' && <Clock className="h-3 w-3" />}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog
                              open={selectedApplication === application.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setSelectedApplication(application.id);
                                  setAdminNotes(application.admin_notes || '');
                                } else {
                                  setSelectedApplication(null);
                                  setAdminNotes('');
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Mentor Application</DialogTitle>
                                  <DialogDescription>
                                    Review the application details and update status
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage src={application.profile?.avatar_url || undefined} />
                                      <AvatarFallback>
                                        {application.profile?.full_name?.charAt(0) || '?'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-semibold">
                                        {application.profile?.full_name || 'Unknown'}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {application.profile?.education_level} • {application.profile?.field_of_study}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="bg-muted/50 rounded-lg p-4">
                                    <Label className="text-sm text-muted-foreground">Has Mentoring Experience?</Label>
                                    <p className="font-medium mt-1">
                                      {application.has_experience ? 'Yes' : 'No'}
                                    </p>
                                  </div>

                                  <div className="bg-muted/50 rounded-lg p-4">
                                    <Label className="text-sm text-muted-foreground">Why they want to mentor</Label>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">
                                      {application.motivation}
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="admin-notes">Admin Notes</Label>
                                    <Textarea
                                      id="admin-notes"
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      placeholder="Add notes for the applicant..."
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex gap-2 pt-4">
                                    <Button
                                      variant="outline"
                                      className="flex-1"
                                      onClick={() => {
                                        updateMentorStatus.mutate({
                                          id: application.id,
                                          status: 'rejected',
                                          admin_notes: adminNotes || undefined,
                                        });
                                        setSelectedApplication(null);
                                      }}
                                      disabled={updateMentorStatus.isPending}
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </Button>
                                    <Button
                                      className="flex-1"
                                      onClick={() => {
                                        updateMentorStatus.mutate({
                                          id: application.id,
                                          status: 'approved',
                                          admin_notes: adminNotes || undefined,
                                        });
                                        setSelectedApplication(null);
                                      }}
                                      disabled={updateMentorStatus.isPending}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this application?')) {
                                  deleteMentorApp.mutate(application.id);
                                }
                              }}
                              disabled={deleteMentorApp.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h2 className="text-xl font-semibold">Manage Users</h2>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((profile) => {
                    const userRole = getUserRole(profile.id);
                    return (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {profile.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>{profile.education_level || '-'}</TableCell>
                        <TableCell>{profile.location || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              userRole?.role === 'admin'
                                ? 'default'
                                : userRole?.role === 'moderator'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {userRole?.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={userRole?.role || 'user'}
                            onValueChange={(value) =>
                              handleAssignRole(profile.id, value as 'admin' | 'moderator' | 'user')
                            }
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
