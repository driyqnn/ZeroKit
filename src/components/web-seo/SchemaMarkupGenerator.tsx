
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, MessageSquare, Code, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type SchemaType = 'LocalBusiness' | 'Product' | 'Article' | 'Event' | 'Recipe' | 'FAQPage';

interface SchemaField {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

const SchemaMarkupGenerator: React.FC = () => {
  const [schemaType, setSchemaType] = useState<SchemaType>('LocalBusiness');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedSchema, setGeneratedSchema] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleFieldChange = (id: string, value: string) => {
    setFields(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerateSchema = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let schema: any = { "@context": "https://schema.org" };
      
      switch (schemaType) {
        case 'LocalBusiness':
          schema = {
            ...schema,
            "@type": "LocalBusiness",
            "name": fields.name || "Business Name",
            "description": fields.description || "Business description",
            "url": fields.url || "https://example.com",
            "telephone": fields.telephone || "+1-123-456-7890",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": fields.streetAddress || "123 Main St",
              "addressLocality": fields.addressLocality || "City",
              "addressRegion": fields.addressRegion || "State",
              "postalCode": fields.postalCode || "12345",
              "addressCountry": fields.addressCountry || "US"
            },
            "openingHours": fields.openingHours || "Mo-Fr 09:00-17:00"
          };
          break;
          
        case 'Product':
          schema = {
            ...schema,
            "@type": "Product",
            "name": fields.name || "Product Name",
            "description": fields.description || "Product description",
            "image": fields.image || "https://example.com/product.jpg",
            "brand": {
              "@type": "Brand",
              "name": fields.brand || "Brand Name"
            },
            "offers": {
              "@type": "Offer",
              "price": fields.price || "19.99",
              "priceCurrency": fields.priceCurrency || "USD",
              "availability": fields.availability || "https://schema.org/InStock"
            }
          };
          break;
          
        case 'Article':
          schema = {
            ...schema,
            "@type": "Article",
            "headline": fields.headline || "Article Headline",
            "description": fields.description || "Article description",
            "image": fields.image || "https://example.com/article.jpg",
            "author": {
              "@type": "Person",
              "name": fields.author || "Author Name"
            },
            "publisher": {
              "@type": "Organization",
              "name": fields.publisher || "Publisher Name",
              "logo": {
                "@type": "ImageObject",
                "url": fields.publisherLogo || "https://example.com/logo.jpg"
              }
            },
            "datePublished": fields.datePublished || "2023-01-01"
          };
          break;
          
        case 'Event':
          schema = {
            ...schema,
            "@type": "Event",
            "name": fields.name || "Event Name",
            "description": fields.description || "Event description",
            "startDate": fields.startDate || "2023-01-01T19:00",
            "endDate": fields.endDate || "2023-01-01T22:00",
            "location": {
              "@type": "Place",
              "name": fields.locationName || "Location Name",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": fields.streetAddress || "123 Main St",
                "addressLocality": fields.addressLocality || "City",
                "addressRegion": fields.addressRegion || "State",
                "postalCode": fields.postalCode || "12345",
                "addressCountry": fields.addressCountry || "US"
              }
            }
          };
          break;
          
        case 'Recipe':
          schema = {
            ...schema,
            "@type": "Recipe",
            "name": fields.name || "Recipe Name",
            "image": fields.image || "https://example.com/recipe.jpg",
            "author": {
              "@type": "Person",
              "name": fields.author || "Author Name"
            },
            "description": fields.description || "Recipe description",
            "prepTime": fields.prepTime || "PT15M",
            "cookTime": fields.cookTime || "PT30M",
            "totalTime": fields.totalTime || "PT45M",
            "recipeYield": fields.recipeYield || "4 servings",
            "recipeIngredient": (fields.ingredients || "Ingredient 1, Ingredient 2").split(',').map(i => i.trim()),
            "recipeInstructions": (fields.instructions || "Step 1, Step 2").split(',').map(i => ({
              "@type": "HowToStep",
              "text": i.trim()
            }))
          };
          break;
          
        case 'FAQPage':
          const questions = fields.questions ? fields.questions.split(',') : ["Question 1", "Question 2"];
          const answers = fields.answers ? fields.answers.split(',') : ["Answer 1", "Answer 2"];
          
          schema = {
            ...schema,
            "@type": "FAQPage",
            "mainEntity": questions.map((q, i) => ({
              "@type": "Question",
              "name": q.trim(),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": answers[i] ? answers[i].trim() : "No answer provided"
              }
            }))
          };
          break;
      }
      
      setGeneratedSchema(JSON.stringify(schema, null, 2));
      setIsLoading(false);
    }, 1000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(generatedSchema);
    setCopied(true);
    toast.success('Schema copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const getSchemaFields = (type: SchemaType): SchemaField[] => {
    switch(type) {
      case 'LocalBusiness':
        return [
          { id: 'name', label: 'Business Name', placeholder: 'Your Business Name', required: true },
          { id: 'description', label: 'Description', placeholder: 'Brief description of your business' },
          { id: 'url', label: 'Website URL', placeholder: 'https://example.com' },
          { id: 'telephone', label: 'Phone Number', placeholder: '+1-123-456-7890' },
          { id: 'streetAddress', label: 'Street Address', placeholder: '123 Main St' },
          { id: 'addressLocality', label: 'City', placeholder: 'City' },
          { id: 'addressRegion', label: 'State/Region', placeholder: 'State' },
          { id: 'postalCode', label: 'Postal Code', placeholder: '12345' },
          { id: 'addressCountry', label: 'Country', placeholder: 'US' },
          { id: 'openingHours', label: 'Opening Hours', placeholder: 'Mo-Fr 09:00-17:00' }
        ];
      case 'Product':
        return [
          { id: 'name', label: 'Product Name', placeholder: 'Product Name', required: true },
          { id: 'description', label: 'Description', placeholder: 'Product description' },
          { id: 'image', label: 'Image URL', placeholder: 'https://example.com/product.jpg' },
          { id: 'brand', label: 'Brand', placeholder: 'Brand Name' },
          { id: 'price', label: 'Price', placeholder: '19.99', required: true },
          { id: 'priceCurrency', label: 'Currency', placeholder: 'USD' },
          { id: 'availability', label: 'Availability', placeholder: 'https://schema.org/InStock' }
        ];
      case 'Article':
        return [
          { id: 'headline', label: 'Headline', placeholder: 'Article Headline', required: true },
          { id: 'description', label: 'Description', placeholder: 'Article description' },
          { id: 'image', label: 'Image URL', placeholder: 'https://example.com/article.jpg' },
          { id: 'author', label: 'Author Name', placeholder: 'Author Name' },
          { id: 'publisher', label: 'Publisher Name', placeholder: 'Publisher Name' },
          { id: 'publisherLogo', label: 'Publisher Logo URL', placeholder: 'https://example.com/logo.jpg' },
          { id: 'datePublished', label: 'Date Published', placeholder: '2023-01-01' }
        ];
      case 'Event':
        return [
          { id: 'name', label: 'Event Name', placeholder: 'Event Name', required: true },
          { id: 'description', label: 'Description', placeholder: 'Event description' },
          { id: 'startDate', label: 'Start Date', placeholder: '2023-01-01T19:00', required: true },
          { id: 'endDate', label: 'End Date', placeholder: '2023-01-01T22:00' },
          { id: 'locationName', label: 'Location Name', placeholder: 'Venue Name' },
          { id: 'streetAddress', label: 'Street Address', placeholder: '123 Main St' },
          { id: 'addressLocality', label: 'City', placeholder: 'City' },
          { id: 'addressRegion', label: 'State/Region', placeholder: 'State' },
          { id: 'postalCode', label: 'Postal Code', placeholder: '12345' },
          { id: 'addressCountry', label: 'Country', placeholder: 'US' }
        ];
      case 'Recipe':
        return [
          { id: 'name', label: 'Recipe Name', placeholder: 'Recipe Name', required: true },
          { id: 'image', label: 'Image URL', placeholder: 'https://example.com/recipe.jpg' },
          { id: 'author', label: 'Author Name', placeholder: 'Author Name' },
          { id: 'description', label: 'Description', placeholder: 'Recipe description' },
          { id: 'prepTime', label: 'Prep Time (ISO format)', placeholder: 'PT15M' },
          { id: 'cookTime', label: 'Cook Time (ISO format)', placeholder: 'PT30M' },
          { id: 'totalTime', label: 'Total Time (ISO format)', placeholder: 'PT45M' },
          { id: 'recipeYield', label: 'Yield', placeholder: '4 servings' },
          { id: 'ingredients', label: 'Ingredients (comma separated)', placeholder: 'Ingredient 1, Ingredient 2' },
          { id: 'instructions', label: 'Instructions (comma separated)', placeholder: 'Step 1, Step 2' }
        ];
      case 'FAQPage':
        return [
          { id: 'questions', label: 'Questions (comma separated)', placeholder: 'Question 1, Question 2', required: true },
          { id: 'answers', label: 'Answers (comma separated)', placeholder: 'Answer 1, Answer 2', required: true }
        ];
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Schema Markup Generator
          </CardTitle>
          <CardDescription>
            Create structured data markup for better SEO and rich results in search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schemaType">Schema Type</Label>
            <Select
              value={schemaType}
              onValueChange={(value) => {
                setSchemaType(value as SchemaType);
                setFields({});
                setGeneratedSchema('');
              }}
            >
              <SelectTrigger id="schemaType">
                <SelectValue placeholder="Select schema type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LocalBusiness">Local Business</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="Event">Event</SelectItem>
                <SelectItem value="Recipe">Recipe</SelectItem>
                <SelectItem value="FAQPage">FAQ Page</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-sm text-muted-foreground">
              Select the appropriate schema type for your content
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Fill in Schema Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getSchemaFields(schemaType).map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500">*</span>}</Label>
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    value={fields[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleGenerateSchema} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading ? 'Generating...' : 'Generate Schema'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : generatedSchema ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Generated Schema
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopySchema}
                className="flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="text-sm">
                <code>{generatedSchema}</code>
              </pre>
            </div>
            
            <Tabs defaultValue="script" className="mt-6">
              <TabsList>
                <TabsTrigger value="script">Script Tag</TabsTrigger>
                <TabsTrigger value="jsonld">JSON-LD</TabsTrigger>
              </TabsList>
              <TabsContent value="script" className="mt-2">
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`<script type="application/ld+json">
${generatedSchema}
</script>`}</code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="jsonld" className="mt-2">
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    <code>{generatedSchema}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Implementation Instructions</h3>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">1</span>
                  <span>Copy the script tag above and paste it into the <code className="bg-muted px-1 rounded">&lt;head&gt;</code> section of your HTML.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">2</span>
                  <span>Ensure all required fields are filled in with accurate information.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">3</span>
                  <span>Test your schema using Google's <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rich Results Test</a>.</span>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default SchemaMarkupGenerator;
