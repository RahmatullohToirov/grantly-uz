import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Upload,
  Download,
  Trash2,
  Edit
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  const documents = [
    {
      id: 1,
      name: "Resume.pdf",
      type: "Resume/CV",
      uploadDate: "2024-01-15",
      size: "245 KB"
    },
    {
      id: 2,
      name: "Statement_of_Purpose.pdf",
      type: "Statement of Purpose",
      uploadDate: "2024-01-20",
      size: "156 KB"
    },
    {
      id: 3,
      name: "Transcript.pdf",
      type: "Academic Transcript",
      uploadDate: "2024-01-10",
      size: "892 KB"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and documents
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Photo */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>
                    Update your profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                    <AvatarFallback className="text-lg">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue={user?.user_metadata?.first_name || ""}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue={user?.user_metadata?.last_name || ""}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        rows={3}
                      />
                    </div>
                    
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Add your educational background and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentLevel">Current Education Level</Label>
                    <Input
                      id="currentLevel"
                      placeholder="e.g., Bachelor's Degree"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institution">Current Institution</Label>
                    <Input
                      id="institution"
                      placeholder="e.g., MIT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      placeholder="e.g., 3.8/4.0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="graduationYear">Expected Graduation</Label>
                    <Input
                      id="graduationYear"
                      type="date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="academicHonors">Academic Honors</Label>
                    <Input
                      id="academicHonors"
                      placeholder="e.g., Dean's List, Magna Cum Laude"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="researchInterests">Research Interests</Label>
                  <Textarea
                    id="researchInterests"
                    placeholder="Describe your research interests and goals"
                    rows={3}
                  />
                </div>
                
                <Button>Save Academic Info</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Upload and manage your application documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Section */}
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Document List */}
                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Documents</h4>
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Preferences</CardTitle>
                <CardDescription>
                  Set your scholarship search preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredCountries">Preferred Countries</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">United States</Badge>
                    <Badge variant="secondary">United Kingdom</Badge>
                    <Badge variant="secondary">Canada</Badge>
                    <Button variant="outline" size="sm">+ Add Country</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="preferredFields">Preferred Fields of Study</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Computer Science</Badge>
                    <Badge variant="secondary">Engineering</Badge>
                    <Button variant="outline" size="sm">+ Add Field</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="scholarshipTypes">Scholarship Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Fully Funded</Badge>
                    <Badge variant="secondary">Partial Funding</Badge>
                    <Badge variant="secondary">Merit-based</Badge>
                    <Button variant="outline" size="sm">+ Add Type</Button>
                  </div>
                </div>
                
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;