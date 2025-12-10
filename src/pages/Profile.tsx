import { useState, useEffect } from "react";
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
import { useProfile, useUpdateProfile, ProfileFormData } from "@/hooks/useProfile";
import { Loader2, Upload, Save } from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { NotificationSettings } from "@/components/NotificationSettings";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    bio: '',
    location: '',
    education_level: '',
    field_of_study: '',
  });

  // Load profile data into form when it's fetched
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || user?.user_metadata?.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        education_level: profile.education_level || '',
        field_of_study: profile.field_of_study || '',
      });
    } else if (user) {
      // Use user metadata as fallback
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata?.first_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
          : user.user_metadata?.full_name || '',
      }));
    }
  }, [profile, user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = async () => {
    await updateProfile.mutateAsync(formData);
  };

  const handleSaveAcademicInfo = async () => {
    await updateProfile.mutateAsync(formData);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                    <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={user?.email} />
                    <AvatarFallback className="text-lg">
                      {formData.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
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
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
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
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Tashkent, Uzbekistan"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(formData.bio?.length || 0)}/500 characters
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleSavePersonalInfo}
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
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
                  Add your educational background - this helps us match you with relevant scholarships
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentLevel">Current Education Level</Label>
                    <Input
                      id="currentLevel"
                      value={formData.education_level || ''}
                      onChange={(e) => handleInputChange('education_level', e.target.value)}
                      placeholder="e.g., Bachelor's Degree, High School"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      value={formData.field_of_study || ''}
                      onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                      placeholder="e.g., Computer Science, Medicine"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveAcademicInfo}
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Academic Info
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Preferences</CardTitle>
                <CardDescription>
                  Set your scholarship search preferences (Coming soon)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredCountries">Preferred Countries</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">United States</Badge>
                    <Badge variant="secondary">United Kingdom</Badge>
                    <Badge variant="secondary">Canada</Badge>
                    <Button variant="outline" size="sm" disabled>+ Add Country</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="preferredFields">Preferred Fields of Study</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Computer Science</Badge>
                    <Badge variant="secondary">Engineering</Badge>
                    <Button variant="outline" size="sm" disabled>+ Add Field</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="scholarshipTypes">Scholarship Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Fully Funded</Badge>
                    <Badge variant="secondary">Partial Funding</Badge>
                    <Badge variant="secondary">Merit-based</Badge>
                    <Button variant="outline" size="sm" disabled>+ Add Type</Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Preference customization will be available soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
