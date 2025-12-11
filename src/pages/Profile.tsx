import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useProfileCompleteness } from "@/hooks/useProfileCompleteness";
import { Loader2, Upload, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { NotificationSettings } from "@/components/NotificationSettings";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", 
  "Belgium", "Brazil", "Canada", "China", "Colombia", "Egypt", "Ethiopia", "France", 
  "Germany", "Ghana", "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "South Korea", 
  "Malaysia", "Mexico", "Morocco", "Nepal", "Netherlands", "New Zealand", "Nigeria", 
  "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia", 
  "Singapore", "South Africa", "Spain", "Sri Lanka", "Sweden", "Switzerland", 
  "Taiwan", "Tanzania", "Thailand", "Turkey", "UAE", "Uganda", "Ukraine", 
  "United Kingdom", "United States", "Uzbekistan", "Vietnam", "Other"
];

const EDUCATION_LEVELS = [
  "High School",
  "Associate's Degree", 
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Professional Degree (MD, JD, etc.)"
];

const INSTITUTION_TYPES = [
  "Public University",
  "Private University", 
  "Community College",
  "Online Institution",
  "Technical/Vocational School",
  "Research Institution"
];

const INCOME_LEVELS = [
  "Low Income (< $30,000)",
  "Lower Middle ($30,000 - $60,000)",
  "Middle ($60,000 - $100,000)",
  "Upper Middle ($100,000 - $200,000)",
  "High Income (> $200,000)"
];

const FIELDS_OF_STUDY = [
  "Accounting", "Agriculture", "Architecture", "Arts & Humanities", "Biology", 
  "Business Administration", "Chemistry", "Computer Science", "Data Science",
  "Economics", "Education", "Engineering", "Environmental Science", "Finance",
  "Health Sciences", "History", "Information Technology", "International Relations",
  "Journalism", "Law", "Literature", "Marketing", "Mathematics", "Medicine",
  "Music", "Nursing", "Pharmacy", "Philosophy", "Physics", "Political Science",
  "Psychology", "Public Health", "Social Work", "Sociology", "STEM", "Other"
];

interface ProfileFormData {
  full_name: string;
  bio: string;
  location: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
  education_level: string;
  field_of_study: string;
  gpa: string;
  institution_type: string;
  income_level: string;
  financial_need: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const completeness = useProfileCompleteness();

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    bio: '',
    location: '',
    gender: '',
    date_of_birth: '',
    nationality: '',
    country_of_residence: '',
    education_level: '',
    field_of_study: '',
    gpa: '',
    institution_type: '',
    income_level: '',
    financial_need: false,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || user?.user_metadata?.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        gender: profile.gender || '',
        date_of_birth: profile.date_of_birth || '',
        nationality: profile.nationality || '',
        country_of_residence: profile.country_of_residence || '',
        education_level: profile.education_level || '',
        field_of_study: profile.field_of_study || '',
        gpa: profile.gpa?.toString() || '',
        institution_type: profile.institution_type || '',
        income_level: profile.income_level || '',
        financial_need: profile.financial_need || false,
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata?.first_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
          : user.user_metadata?.full_name || '',
      }));
    }
  }, [profile, user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    const dataToSave = {
      full_name: formData.full_name,
      bio: formData.bio || null,
      location: formData.location || null,
      gender: formData.gender || null,
      date_of_birth: formData.date_of_birth || null,
      nationality: formData.nationality || null,
      country_of_residence: formData.country_of_residence || null,
      education_level: formData.education_level || null,
      field_of_study: formData.field_of_study || null,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      institution_type: formData.institution_type || null,
      income_level: formData.income_level || null,
      financial_need: formData.financial_need,
    };
    await updateProfile.mutateAsync(dataToSave as any);
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
        {/* Header with completion banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mb-4">
            Complete your profile to get personalized scholarship matches
          </p>
          
          {/* Profile Completion Card */}
          <Card className={completeness.isComplete ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30" : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                {completeness.isComplete ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {completeness.isComplete ? "Profile Complete!" : "Complete Your Profile"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {completeness.isComplete 
                      ? "You're getting the most accurate scholarship matches" 
                      : "Add your details to unlock better scholarship recommendations"}
                  </p>
                </div>
                <div className="text-2xl font-bold">{completeness.percentage}%</div>
              </div>
              <Progress value={completeness.percentage} className="h-3" />
              <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
                <div className="text-center">
                  <div className="font-medium">Personal</div>
                  <div className="text-muted-foreground">{completeness.categoryProgress.personal}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Demographics</div>
                  <div className="text-muted-foreground">{completeness.categoryProgress.demographics}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Academic</div>
                  <div className="text-muted-foreground">{completeness.categoryProgress.academic}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">Financial</div>
                  <div className="text-muted-foreground">{completeness.categoryProgress.financial}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
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

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your basic information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
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
                      <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">City / Region</Label>
                      <Input
                        id="location"
                        value={formData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Tashkent, London, New York"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself, your goals and aspirations..."
                        rows={3}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(formData.bio?.length || 0)}/500 characters
                      </p>
                    </div>
                    
                    <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                      ) : (
                        <><Save className="mr-2 h-4 w-4" />Save Changes</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
                <CardDescription>
                  This information helps match you with scholarships that target specific demographics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Select value={formData.nationality} onValueChange={(v) => handleInputChange('nationality', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="countryOfResidence">Country of Residence</Label>
                    <Select value={formData.country_of_residence} onValueChange={(v) => handleInputChange('country_of_residence', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />Save Demographics</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Your educational background helps match you with relevant scholarships
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="educationLevel">Current Education Level *</Label>
                    <Select value={formData.education_level} onValueChange={(v) => handleInputChange('education_level', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                    <Select value={formData.field_of_study} onValueChange={(v) => handleInputChange('field_of_study', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELDS_OF_STUDY.map(field => (
                          <SelectItem key={field} value={field}>{field}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gpa">GPA (on 4.0 scale)</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa || ''}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      placeholder="e.g., 3.75"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Convert your grade to 4.0 scale if needed
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="institutionType">Institution Type</Label>
                    <Select value={formData.institution_type} onValueChange={(v) => handleInputChange('institution_type', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTITUTION_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />Save Academic Info</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Many scholarships are need-based. This information helps match you with financial aid opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="incomeLevel">Household Income Level</Label>
                  <Select value={formData.income_level} onValueChange={(v) => handleInputChange('income_level', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      {INCOME_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    This information is kept private and only used for matching
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="financialNeed" className="text-base">I have financial need</Label>
                    <p className="text-sm text-muted-foreground">
                      Check this if you require financial assistance to pursue your education
                    </p>
                  </div>
                  <Switch
                    id="financialNeed"
                    checked={formData.financial_need}
                    onCheckedChange={(checked) => handleInputChange('financial_need', checked)}
                  />
                </div>
                
                <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />Save Financial Info</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <DocumentUpload />
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
