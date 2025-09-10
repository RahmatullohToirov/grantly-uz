import { useState } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, FileText, Settings, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Rahmatulloh Abdurazzokov",
    email: "rahmat@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    university: "Stanford University",
    major: "Computer Science",
    year: "Graduate Student",
    gpa: "3.8",
    bio: "Passionate computer science graduate student with interests in AI, machine learning, and sustainable technology solutions."
  });

  const documents = [
    { name: "Resume_Rahmat_2024.pdf", type: "Resume", uploaded: "2024-01-15", size: "2.4 MB" },
    { name: "Transcript_Stanford.pdf", type: "Transcript", uploaded: "2024-01-10", size: "1.2 MB" },
    { name: "Statement_of_Purpose.pdf", type: "SOP", uploaded: "2024-01-08", size: "890 KB" },
    { name: "Recommendation_Letter_Dr_Smith.pdf", type: "Recommendation", uploaded: "2024-01-05", size: "1.1 MB" }
  ];

  const achievements = [
    "Dean's List - Fall 2023",
    "AI Research Paper Published",
    "Google Summer of Code Participant",
    "Hackathon Winner - TechCrunch Disrupt",
    "Volunteer - Code for Good Initiative"
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                My Profile
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Manage your personal information and documents
              </p>
            </div>
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-background text-foreground hover:bg-background/90"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture & Basic Info */}
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-16 w-16 text-primary-foreground" />
                  </div>
                  <Button variant="outline" size="sm">
                    Upload Photo
                  </Button>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-card shadow-soft">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Academic Information */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Input 
                      id="university"
                      value={profile.university}
                      onChange={(e) => setProfile({...profile, university: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input 
                      id="major"
                      value={profile.major}
                      onChange={(e) => setProfile({...profile, major: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Input 
                      id="year"
                      value={profile.year}
                      onChange={(e) => setProfile({...profile, year: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input 
                      id="gpa"
                      value={profile.gpa}
                      onChange={(e) => setProfile({...profile, gpa: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Achievements & Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                      <Badge variant="secondary" className="shrink-0">
                        {index + 1}
                      </Badge>
                      <span className="text-foreground">{achievement}</span>
                    </div>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Add Achievement
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-8">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Uploaded Documents</CardTitle>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • Uploaded {doc.uploaded}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-8">
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications about new opportunities</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account security</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently remove your account</p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;