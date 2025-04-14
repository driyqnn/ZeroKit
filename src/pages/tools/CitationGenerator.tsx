
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileText, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { format } from "date-fns";

const CitationGenerator = () => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    publicationYear: new Date().getFullYear().toString(),
    journalTitle: "",
    bookTitle: "",
    websiteTitle: "",
    publisher: "",
    publisherLocation: "",
    volumeNumber: "",
    issueNumber: "",
    pageNumbers: "",
    doi: "",
    url: "",
    accessDate: format(new Date(), "yyyy-MM-dd"),
  });
  
  const [citationStyle, setCitationStyle] = useState("apa");
  const [sourceType, setSourceType] = useState("journal");
  const [generatedCitation, setGeneratedCitation] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateCitation = () => {
    let citation = "";

    // Check for required fields
    const requiredFields: Record<string, string[]> = {
      journal: ["authors", "title", "journalTitle", "publicationYear"],
      book: ["authors", "title", "publisher", "publisherLocation", "publicationYear"],
      website: ["authors", "title", "websiteTitle", "url", "accessDate"],
    };

    const missingFields = requiredFields[sourceType].filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in the required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Generate citation based on style and source type
    switch (citationStyle) {
      case "apa":
        citation = generateAPACitation();
        break;
      case "mla":
        citation = generateMLACitation();
        break;
      case "chicago":
        citation = generateChicagoCitation();
        break;
      case "harvard":
        citation = generateHarvardCitation();
        break;
      default:
        citation = generateAPACitation();
    }

    setGeneratedCitation(citation);
  };

  const generateAPACitation = () => {
    let citation = "";
    
    // Format authors for APA (LastName, F. M., & LastName, F. M.)
    const formattedAuthors = formatAuthors(formData.authors, "apa");
    
    switch (sourceType) {
      case "journal":
        citation = `${formattedAuthors} (${formData.publicationYear}). ${formData.title}. `;
        citation += `<em>${formData.journalTitle}</em>`;
        
        if (formData.volumeNumber) {
          citation += `, ${formData.volumeNumber}`;
          if (formData.issueNumber) {
            citation += `(${formData.issueNumber})`;
          }
        }
        
        if (formData.pageNumbers) {
          citation += `, ${formData.pageNumbers}`;
        }
        
        citation += ".";
        
        if (formData.doi) {
          citation += ` https://doi.org/${formData.doi}`;
        }
        break;
        
      case "book":
        citation = `${formattedAuthors} (${formData.publicationYear}). `;
        citation += `<em>${formData.title}</em>. `;
        citation += `${formData.publisherLocation}: ${formData.publisher}.`;
        break;
        
      case "website":
        citation = `${formattedAuthors} (${formData.publicationYear}). `;
        citation += `${formData.title}. `;
        citation += `<em>${formData.websiteTitle}</em>. `;
        citation += `Retrieved ${format(new Date(formData.accessDate), "MMMM d, yyyy")}, from ${formData.url}`;
        break;
    }
    
    return citation;
  };

  const generateMLACitation = () => {
    let citation = "";
    
    // Format authors for MLA (LastName, FirstName, and FirstName LastName)
    const formattedAuthors = formatAuthors(formData.authors, "mla");
    
    switch (sourceType) {
      case "journal":
        citation = `${formattedAuthors}. "${formData.title}." `;
        citation += `<em>${formData.journalTitle}</em>`;
        
        if (formData.volumeNumber) {
          citation += `, vol. ${formData.volumeNumber}`;
          if (formData.issueNumber) {
            citation += `, no. ${formData.issueNumber}`;
          }
        }
        
        citation += `, ${formData.publicationYear}`;
        
        if (formData.pageNumbers) {
          citation += `, pp. ${formData.pageNumbers}`;
        }
        
        citation += ".";
        
        if (formData.doi) {
          citation += ` DOI: ${formData.doi}.`;
        }
        break;
        
      case "book":
        citation = `${formattedAuthors}. <em>${formData.title}</em>. `;
        citation += `${formData.publisher}, ${formData.publicationYear}.`;
        break;
        
      case "website":
        citation = `${formattedAuthors}. "${formData.title}." `;
        citation += `<em>${formData.websiteTitle}</em>, `;
        citation += `${format(new Date(formData.accessDate), "d MMMM yyyy")}, ${formData.url}.`;
        break;
    }
    
    return citation;
  };

  const generateChicagoCitation = () => {
    let citation = "";
    
    // Format authors for Chicago (LastName, FirstName, and FirstName LastName)
    const formattedAuthors = formatAuthors(formData.authors, "chicago");
    
    switch (sourceType) {
      case "journal":
        citation = `${formattedAuthors}. "${formData.title}." `;
        citation += `<em>${formData.journalTitle}</em> `;
        
        if (formData.volumeNumber) {
          citation += `${formData.volumeNumber}`;
          if (formData.issueNumber) {
            citation += `, no. ${formData.issueNumber}`;
          }
        }
        
        citation += ` (${formData.publicationYear})`;
        
        if (formData.pageNumbers) {
          citation += `: ${formData.pageNumbers}`;
        }
        
        citation += ".";
        
        if (formData.doi) {
          citation += ` https://doi.org/${formData.doi}.`;
        }
        break;
        
      case "book":
        citation = `${formattedAuthors}. <em>${formData.title}</em>. `;
        citation += `${formData.publisherLocation}: ${formData.publisher}, ${formData.publicationYear}.`;
        break;
        
      case "website":
        citation = `${formattedAuthors}. "${formData.title}." `;
        citation += `<em>${formData.websiteTitle}</em>. `;
        citation += `Accessed ${format(new Date(formData.accessDate), "MMMM d, yyyy")}. ${formData.url}.`;
        break;
    }
    
    return citation;
  };

  const generateHarvardCitation = () => {
    let citation = "";
    
    // Format authors for Harvard (LastName, F. and LastName, F.)
    const formattedAuthors = formatAuthors(formData.authors, "harvard");
    
    switch (sourceType) {
      case "journal":
        citation = `${formattedAuthors} (${formData.publicationYear}) '${formData.title}', `;
        citation += `<em>${formData.journalTitle}</em>`;
        
        if (formData.volumeNumber) {
          citation += `, ${formData.volumeNumber}`;
          if (formData.issueNumber) {
            citation += `(${formData.issueNumber})`;
          }
        }
        
        if (formData.pageNumbers) {
          citation += `, pp. ${formData.pageNumbers}`;
        }
        
        citation += ".";
        
        if (formData.doi) {
          citation += ` doi: ${formData.doi}`;
        }
        break;
        
      case "book":
        citation = `${formattedAuthors} (${formData.publicationYear}) <em>${formData.title}</em>, `;
        citation += `${formData.publisherLocation}: ${formData.publisher}.`;
        break;
        
      case "website":
        citation = `${formattedAuthors} (${formData.publicationYear}) <em>${formData.title}</em>, `;
        citation += `${formData.websiteTitle}. Available at: ${formData.url} `;
        citation += `(Accessed: ${format(new Date(formData.accessDate), "d MMMM yyyy")}).`;
        break;
    }
    
    return citation;
  };

  // Helper to format authors based on citation style
  const formatAuthors = (authorString: string, style: string) => {
    if (!authorString) return "";
    
    const authors = authorString.split(",").map(author => author.trim());
    
    if (authors.length === 0) return "";
    if (authors.length === 1) {
      const parts = authors[0].split(" ");
      const lastName = parts.pop() || "";
      const firstName = parts.join(" ");
      
      switch (style) {
        case "apa":
        case "harvard":
          return `${lastName}, ${firstName.charAt(0)}.`;
        case "mla":
        case "chicago":
          return `${lastName}, ${firstName}`;
        default:
          return authors[0];
      }
    }
    
    // Multiple authors
    const formattedAuthors = authors.map(author => {
      const parts = author.split(" ");
      const lastName = parts.pop() || "";
      const firstName = parts.join(" ");
      
      switch (style) {
        case "apa":
          return `${lastName}, ${firstName.charAt(0)}.`;
        case "harvard":
          return `${lastName}, ${firstName.charAt(0)}.`;
        case "mla":
        case "chicago":
          return `${lastName}, ${firstName}`;
        default:
          return author;
      }
    });
    
    if (formattedAuthors.length === 2) {
      switch (style) {
        case "apa":
          return `${formattedAuthors[0]} & ${formattedAuthors[1]}`;
        case "mla":
          return `${formattedAuthors[0]}, and ${authors[1]}`;
        case "chicago":
          return `${formattedAuthors[0]}, and ${authors[1]}`;
        case "harvard":
          return `${formattedAuthors[0]} and ${formattedAuthors[1]}`;
        default:
          return formattedAuthors.join(" and ");
      }
    }
    
    // Three or more authors
    switch (style) {
      case "apa":
        return formattedAuthors.length > 3
          ? `${formattedAuthors[0]}, et al.`
          : `${formattedAuthors.slice(0, -1).join(", ")}, & ${formattedAuthors.slice(-1)}`;
      case "mla":
        return formattedAuthors.length > 3
          ? `${formattedAuthors[0]}, et al.`
          : `${formattedAuthors[0]}, ${formattedAuthors.slice(1, -1).join(", ")}, and ${formattedAuthors.slice(-1)}`;
      case "chicago":
        return `${formattedAuthors[0]}, ${formattedAuthors.slice(1, -1).join(", ")}, and ${formattedAuthors.slice(-1)}`;
      case "harvard":
        return formattedAuthors.length > 3
          ? `${formattedAuthors[0]} <em>et al.</em>`
          : `${formattedAuthors.slice(0, -1).join(", ")} and ${formattedAuthors.slice(-1)}`;
      default:
        return formattedAuthors.join(", ");
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: "",
      authors: "",
      publicationYear: new Date().getFullYear().toString(),
      journalTitle: "",
      bookTitle: "",
      websiteTitle: "",
      publisher: "",
      publisherLocation: "",
      volumeNumber: "",
      issueNumber: "",
      pageNumbers: "",
      doi: "",
      url: "",
      accessDate: format(new Date(), "yyyy-MM-dd"),
    });
    setGeneratedCitation(null);
  };

  const handleCopyCitation = () => {
    if (generatedCitation) {
      // Strip HTML tags for clipboard
      const plainText = generatedCitation.replace(/<\/?em>/g, "");
      navigator.clipboard.writeText(plainText).then(() => {
        toast.success("Citation copied to clipboard");
      }).catch(() => {
        toast.error("Failed to copy citation");
      });
    }
  };

  // Render fields based on source type
  const renderSourceFields = () => {
    switch (sourceType) {
      case "journal":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journalTitle">Journal Title <span className="text-red-500">*</span></Label>
                <Input
                  id="journalTitle"
                  name="journalTitle"
                  value={formData.journalTitle}
                  onChange={handleInputChange}
                  placeholder="Journal of Example Studies"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volumeNumber">Volume Number</Label>
                <Input
                  id="volumeNumber"
                  name="volumeNumber"
                  value={formData.volumeNumber}
                  onChange={handleInputChange}
                  placeholder="12"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueNumber">Issue Number</Label>
                <Input
                  id="issueNumber"
                  name="issueNumber"
                  value={formData.issueNumber}
                  onChange={handleInputChange}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageNumbers">Page Numbers</Label>
                <Input
                  id="pageNumbers"
                  name="pageNumbers"
                  value={formData.pageNumbers}
                  onChange={handleInputChange}
                  placeholder="45-67"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doi">DOI (Digital Object Identifier)</Label>
              <Input
                id="doi"
                name="doi"
                value={formData.doi}
                onChange={handleInputChange}
                placeholder="10.1000/xyz123"
              />
            </div>
          </>
        );
      case "book":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher <span className="text-red-500">*</span></Label>
                <Input
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="Example University Press"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisherLocation">Publisher Location <span className="text-red-500">*</span></Label>
                <Input
                  id="publisherLocation"
                  name="publisherLocation"
                  value={formData.publisherLocation}
                  onChange={handleInputChange}
                  placeholder="New York, NY"
                />
              </div>
            </div>
          </>
        );
      case "website":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="websiteTitle">Website Title <span className="text-red-500">*</span></Label>
              <Input
                id="websiteTitle"
                name="websiteTitle"
                value={formData.websiteTitle}
                onChange={handleInputChange}
                placeholder="Example Organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL <span className="text-red-500">*</span></Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.org/article"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessDate">Access Date <span className="text-red-500">*</span></Label>
              <Input
                id="accessDate"
                name="accessDate"
                type="date"
                value={formData.accessDate}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ToolLayout
      title="Citation Generator"
      description="Create properly formatted citations for academic papers and research"
      icon={<FileText className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue={citationStyle} onValueChange={(value) => setCitationStyle(value)}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="apa">APA</TabsTrigger>
                <TabsTrigger value="mla">MLA</TabsTrigger>
                <TabsTrigger value="chicago">Chicago</TabsTrigger>
                <TabsTrigger value="harvard">Harvard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="apa" className="mt-0">
                <div className="text-sm text-muted-foreground mb-4">
                  APA 7th edition is commonly used in social sciences, education, and business.
                </div>
              </TabsContent>
              <TabsContent value="mla" className="mt-0">
                <div className="text-sm text-muted-foreground mb-4">
                  MLA 9th edition is commonly used in humanities, literature, and language studies.
                </div>
              </TabsContent>
              <TabsContent value="chicago" className="mt-0">
                <div className="text-sm text-muted-foreground mb-4">
                  Chicago style 17th edition is used in history, arts, and some humanities.
                </div>
              </TabsContent>
              <TabsContent value="harvard" className="mt-0">
                <div className="text-sm text-muted-foreground mb-4">
                  Harvard style is commonly used in universities and academic publications in the UK.
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type</Label>
                <Select value={sourceType} onValueChange={setSourceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="journal">Journal Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title of the article, book, or webpage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authors">Authors <span className="text-red-500">*</span></Label>
                <Input
                  id="authors"
                  name="authors"
                  value={formData.authors}
                  onChange={handleInputChange}
                  placeholder="Jane Doe, John Smith (separate with commas)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publicationYear">Publication Year <span className="text-red-500">*</span></Label>
                <Input
                  id="publicationYear"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleInputChange}
                  placeholder="2023"
                />
              </div>
              
              {/* Source-specific fields */}
              {renderSourceFields()}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                <Button variant="outline" onClick={handleClearForm}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Form
                </Button>
                <Button onClick={handleGenerateCitation}>Generate Citation</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {generatedCitation && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">Generated Citation</h3>
                  <Button variant="outline" size="sm" onClick={handleCopyCitation}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 bg-muted/30 rounded-md" dangerouslySetInnerHTML={{ __html: generatedCitation }} />
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Citation Format Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">APA (7th Edition)</h4>
                <p className="text-sm mb-2">For Journal Articles:</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Author, A. A., & Author, B. B. (Year). Title of the article. <em>Journal Title, Volume</em>(Issue), page range. DOI
                </p>
                
                <p className="text-sm mb-2">For Books:</p>
                <p className="text-sm text-muted-foreground">
                  Author, A. A., & Author, B. B. (Year). <em>Title of the book</em>. Publisher.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">MLA (9th Edition)</h4>
                <p className="text-sm mb-2">For Journal Articles:</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Author, First Name. "Title of Article." <em>Journal Title</em>, vol. X, no. X, Year, pp. XX-XX.
                </p>
                
                <p className="text-sm mb-2">For Books:</p>
                <p className="text-sm text-muted-foreground">
                  Author, First Name. <em>Title of Book</em>. Publisher, Year.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CitationGenerator;
