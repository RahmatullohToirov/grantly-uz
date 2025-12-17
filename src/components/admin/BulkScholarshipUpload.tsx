import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Upload,
  FileJson,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
  Info,
  FileText,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

// Extended schema for bulk upload validation (includes array fields)
const bulkScholarshipSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(500, 'Title must be less than 500 characters'),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional().nullable(),
  amount: z.number().positive('Amount must be positive').optional().nullable(),
  deadline: z.string().optional().nullable(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  link: z.string().url('Please enter a valid URL').optional().nullable().or(z.literal('')),
  requirements: z.string().max(2000, 'Requirements must be less than 2000 characters').optional().nullable(),
  source_name: z.string().max(200, 'Source name must be less than 200 characters').optional().nullable(),
  source_url: z.string().url('Please enter a valid URL').optional().nullable().or(z.literal('')),
  eligible_genders: z.array(z.string()).optional().nullable(),
  eligible_countries: z.array(z.string()).optional().nullable(),
  eligible_nationalities: z.array(z.string()).optional().nullable(),
  eligible_education_levels: z.array(z.string()).optional().nullable(),
  eligible_fields: z.array(z.string()).optional().nullable(),
  min_age: z.number().int().min(0).max(150).optional().nullable(),
  max_age: z.number().int().min(0).max(150).optional().nullable(),
  min_gpa: z.number().min(0).max(4).optional().nullable(),
  financial_need_required: z.boolean().optional().nullable(),
});

type BulkScholarshipInput = z.infer<typeof bulkScholarshipSchema>;

interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: BulkScholarshipInput;
}

interface ScholarshipRow {
  title: string;
  description?: string;
  amount?: number;
  deadline?: string;
  location?: string;
  category?: string;
  link?: string;
  requirements?: string;
  source_name?: string;
  source_url?: string;
  eligible_genders?: string[];
  eligible_countries?: string[];
  eligible_nationalities?: string[];
  eligible_education_levels?: string[];
  eligible_fields?: string[];
  min_age?: number;
  max_age?: number;
  min_gpa?: number;
  financial_need_required?: boolean;
}

interface UploadResult {
  success: boolean;
  row: number;
  title?: string;
  error?: string;
}

const requiredFields = [
  { name: 'title', type: 'string', required: true, description: 'Scholarship name (required)' },
];

const optionalFields = [
  { name: 'description', type: 'string', description: 'Detailed description of the scholarship' },
  { name: 'amount', type: 'number', description: 'Award amount in USD (e.g., 5000)' },
  { name: 'deadline', type: 'date', description: 'Application deadline (YYYY-MM-DD format)' },
  { name: 'location', type: 'string', description: 'Geographic location (e.g., USA, UK, Global)' },
  { name: 'category', type: 'string', description: 'Category: STEM, Arts, Business, Leadership, Sports, Community, Exchange, General' },
  { name: 'link', type: 'url', description: 'Application URL' },
  { name: 'requirements', type: 'string', description: 'Eligibility requirements text' },
  { name: 'source_name', type: 'string', description: 'Provider/organization name' },
  { name: 'source_url', type: 'url', description: 'Source website URL' },
  { name: 'eligible_genders', type: 'array', description: 'Comma-separated: Male, Female, Non-binary, Other' },
  { name: 'eligible_countries', type: 'array', description: 'Comma-separated country codes or names' },
  { name: 'eligible_nationalities', type: 'array', description: 'Comma-separated nationalities' },
  { name: 'eligible_education_levels', type: 'array', description: 'Comma-separated: High School, Undergraduate, Graduate, PhD, Postdoctoral' },
  { name: 'eligible_fields', type: 'array', description: 'Comma-separated fields of study' },
  { name: 'min_age', type: 'number', description: 'Minimum age requirement' },
  { name: 'max_age', type: 'number', description: 'Maximum age requirement' },
  { name: 'min_gpa', type: 'number', description: 'Minimum GPA (0-4 scale)' },
  { name: 'financial_need_required', type: 'boolean', description: 'true/false if financial need is required' },
];

const sampleCSV = `title,description,amount,deadline,location,category,link,requirements,source_name,eligible_genders,eligible_education_levels,min_gpa
"Gates Millennium Scholarship","Full scholarship for minority students","50000","2025-03-01","USA","General","https://gmsp.org","US citizen, GPA 3.3+, minority background","Gates Foundation","Male,Female","Undergraduate,Graduate","3.3"
"STEM Leaders Award","For women in STEM fields","10000","2025-04-15","Global","STEM","https://example.com","Female, STEM major","Tech Corp","Female","Undergraduate","3.0"`;

const sampleJSON = `[
  {
    "title": "Gates Millennium Scholarship",
    "description": "Full scholarship for minority students",
    "amount": 50000,
    "deadline": "2025-03-01",
    "location": "USA",
    "category": "General",
    "link": "https://gmsp.org",
    "requirements": "US citizen, GPA 3.3+, minority background",
    "source_name": "Gates Foundation",
    "eligible_genders": ["Male", "Female"],
    "eligible_education_levels": ["Undergraduate", "Graduate"],
    "min_gpa": 3.3
  },
  {
    "title": "STEM Leaders Award",
    "description": "For women in STEM fields",
    "amount": 10000,
    "deadline": "2025-04-15",
    "location": "Global",
    "category": "STEM",
    "eligible_genders": ["Female"],
    "min_gpa": 3.0
  }
]`;

export const BulkScholarshipUpload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [previewData, setPreviewData] = useState<ScholarshipRow[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): ScholarshipRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data: ScholarshipRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const row: Partial<ScholarshipRow> = {};
      headers.forEach((header, idx) => {
        const value = values[idx]?.replace(/^"|"$/g, '') || '';
        if (!value) return;

        // Handle arrays (comma-separated in quotes)
        if (['eligible_genders', 'eligible_countries', 'eligible_nationalities', 'eligible_education_levels', 'eligible_fields'].includes(header)) {
          row[header] = value.split(',').map(v => v.trim()).filter(Boolean);
        }
        // Handle numbers
        else if (['amount', 'min_age', 'max_age', 'min_gpa'].includes(header)) {
          const num = parseFloat(value);
          if (!isNaN(num)) row[header] = num;
        }
        // Handle booleans
        else if (header === 'financial_need_required') {
          row[header] = value.toLowerCase() === 'true';
        }
        // Handle strings
        else {
          row[header] = value;
        }
      });

      if (row.title) {
        data.push(row as ScholarshipRow);
      }
    }

    return data;
  };

  const parseJSON = (text: string): ScholarshipRow[] => {
    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data.filter(row => row.title) : [];
    } catch {
      return [];
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setResults([]);

    const text = await file.text();
    let parsed: ScholarshipRow[] = [];

    if (file.name.endsWith('.csv')) {
      parsed = parseCSV(text);
    } else if (file.name.endsWith('.json')) {
      parsed = parseJSON(text);
    }

    setPreviewData(parsed);

    if (parsed.length === 0) {
      toast.error('Could not parse file. Please check the format.');
    }
  };

  const validateRow = (row: ScholarshipRow): ValidationResult => {
    try {
      const data = bulkScholarshipSchema.parse({
        title: row.title,
        description: row.description || null,
        amount: row.amount || null,
        deadline: row.deadline || null,
        location: row.location || null,
        category: row.category || null,
        link: row.link || null,
        requirements: row.requirements || null,
        source_name: row.source_name || null,
        source_url: row.source_url || null,
        eligible_genders: row.eligible_genders || null,
        eligible_countries: row.eligible_countries || null,
        eligible_nationalities: row.eligible_nationalities || null,
        eligible_education_levels: row.eligible_education_levels || null,
        eligible_fields: row.eligible_fields || null,
        min_age: row.min_age || null,
        max_age: row.max_age || null,
        min_gpa: row.min_gpa || null,
        financial_need_required: row.financial_need_required || null,
      });
      return { valid: true, errors: [], data };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { valid: false, errors: err.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
      }
      return { valid: false, errors: ['Unknown validation error'] };
    }
  };

  const handleUpload = async () => {
    if (previewData.length === 0) return;

    setUploading(true);
    setProgress(0);
    const uploadResults: UploadResult[] = [];

    for (let i = 0; i < previewData.length; i++) {
      const row = previewData[i];
      
      // Validate row before inserting
      const validation = validateRow(row);
      if (!validation.valid) {
        uploadResults.push({
          success: false,
          row: i + 1,
          title: row.title,
          error: `Validation failed: ${validation.errors.join('; ')}`
        });
        setProgress(((i + 1) / previewData.length) * 100);
        continue;
      }

      try {
        const { error } = await supabase.from('scholarships').insert({
          title: validation.data!.title,
          description: validation.data!.description,
          amount: validation.data!.amount,
          deadline: validation.data!.deadline,
          location: validation.data!.location,
          category: validation.data!.category,
          link: validation.data!.link || null,
          requirements: validation.data!.requirements,
          source_name: validation.data!.source_name,
          source_url: validation.data!.source_url || null,
          eligible_genders: validation.data!.eligible_genders,
          eligible_countries: validation.data!.eligible_countries,
          eligible_nationalities: validation.data!.eligible_nationalities,
          eligible_education_levels: validation.data!.eligible_education_levels,
          eligible_fields: validation.data!.eligible_fields,
          min_age: validation.data!.min_age,
          max_age: validation.data!.max_age,
          min_gpa: validation.data!.min_gpa,
          financial_need_required: validation.data!.financial_need_required ?? false,
        });

        if (error) throw error;

        uploadResults.push({ success: true, row: i + 1, title: row.title });
      } catch (err) {
        uploadResults.push({ 
          success: false, 
          row: i + 1, 
          title: row.title,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }

      setProgress(((i + 1) / previewData.length) * 100);
    }

    setResults(uploadResults);
    setUploading(false);

    const successCount = uploadResults.filter(r => r.success).length;
    const failCount = uploadResults.filter(r => !r.success).length;

    if (failCount === 0) {
      toast.success(`Successfully uploaded ${successCount} scholarships!`);
    } else {
      toast.warning(`Uploaded ${successCount} scholarships. ${failCount} failed.`);
    }
  };

  const downloadSample = (format: 'csv' | 'json') => {
    const content = format === 'csv' ? sampleCSV : sampleJSON;
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholarships_template.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setResults([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Bulk Upload Scholarships
          </DialogTitle>
          <DialogDescription>
            Upload multiple scholarships at once using CSV or JSON files
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="format">File Format</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-1 overflow-auto space-y-4">
            {/* File Upload Zone */}
            <Card className="border-dashed border-2">
              <CardContent className="pt-6">
                <div 
                  className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex gap-4 mb-4">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <FileJson className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <p className="text-lg font-medium mb-1">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CSV or JSON files (max 1000 scholarships per upload)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {previewData.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Preview ({previewData.length} scholarships)
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetUpload}>
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-48">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Location</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.slice(0, 10).map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-xs">{idx + 1}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{row.title}</TableCell>
                            <TableCell>{row.amount ? `$${row.amount.toLocaleString()}` : '-'}</TableCell>
                            <TableCell>{row.deadline || '-'}</TableCell>
                            <TableCell>{row.location || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {previewData.length > 10 && (
                      <div className="p-2 text-center text-sm text-muted-foreground bg-muted/50">
                        ... and {previewData.length - 10} more scholarships
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading scholarships...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    Upload Results
                    <Badge variant={results.every(r => r.success) ? "default" : "destructive"}>
                      {results.filter(r => r.success).length}/{results.length} Success
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-32">
                    <div className="p-4 space-y-2">
                      {results.filter(r => !r.success).length > 0 && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Some uploads failed</AlertTitle>
                          <AlertDescription>
                            {results.filter(r => !r.success).map(r => (
                              <div key={r.row} className="text-xs">
                                Row {r.row} ({r.title}): {r.error}
                              </div>
                            ))}
                          </AlertDescription>
                        </Alert>
                      )}
                      {results.every(r => r.success) && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-800 dark:text-green-200">Success!</AlertTitle>
                          <AlertDescription className="text-green-700 dark:text-green-300">
                            All {results.length} scholarships uploaded successfully.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={uploading || previewData.length === 0}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {previewData.length} Scholarships
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="format" className="flex-1 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Required & Optional Fields
                </CardTitle>
                <CardDescription>
                  Your file should contain these columns/fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Required Fields
                    </h4>
                    <div className="space-y-2">
                      {requiredFields.map(field => (
                        <div key={field.name} className="flex items-start gap-3 p-2 rounded bg-muted/50">
                          <Badge variant="outline" className="font-mono text-xs mt-0.5">
                            {field.name}
                          </Badge>
                          <div className="flex-1">
                            <span className="text-sm">{field.description}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {field.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Optional Fields
                    </h4>
                    <ScrollArea className="h-64">
                      <div className="space-y-2 pr-4">
                        {optionalFields.map(field => (
                          <div key={field.name} className="flex items-start gap-3 p-2 rounded bg-muted/50">
                            <Badge variant="outline" className="font-mono text-xs mt-0.5">
                              {field.name}
                            </Badge>
                            <div className="flex-1">
                              <span className="text-sm">{field.description}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {field.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="flex-1 overflow-auto space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                    CSV Template
                  </CardTitle>
                  <CardDescription>
                    Spreadsheet-friendly format, easy to edit in Excel/Google Sheets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 rounded border bg-muted/30 p-3">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{sampleCSV}</pre>
                  </ScrollArea>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => downloadSample('csv')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-amber-600" />
                    JSON Template
                  </CardTitle>
                  <CardDescription>
                    Structured format, ideal for programmatic generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 rounded border bg-muted/30 p-3">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{sampleJSON}</pre>
                  </ScrollArea>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => downloadSample('json')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON Template
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Tips for Web Scraping</AlertTitle>
              <AlertDescription className="text-sm">
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Export your scraped data as JSON for best compatibility with arrays</li>
                  <li>Use ISO date format (YYYY-MM-DD) for deadlines</li>
                  <li>Ensure all amounts are numbers without currency symbols</li>
                  <li>The title field is required - rows without titles will be skipped</li>
                </ul>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
