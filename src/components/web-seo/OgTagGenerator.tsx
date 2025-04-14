
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

const OgTagGenerator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState('website');
  const [siteName, setSiteName] = useState('');
  const [locale, setLocale] = useState('en_US');
  
  const generateHtml = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
${siteName ? `<meta property="og:site_name" content="${siteName}" />` : ''}
${locale ? `<meta property="og:locale" content="${locale}" />` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${image}" />`;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateHtml());
    toast.success('Meta tags copied to clipboard!');
  };
  
  const downloadHtml = () => {
    const element = document.createElement('a');
    const file = new Blob([generateHtml()], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = 'meta-tags.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Meta tags downloaded!');
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input Form */}
      <Card className="p-0">
        <CardHeader>
          <CardTitle>OpenGraph Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Required)</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Your page title" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Required)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief description of your page" 
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL (Required)</Label>
            <Input 
              id="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://example.com/your-page" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Image URL (Required)</Label>
            <Input 
              id="image" 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
              placeholder="https://example.com/image.jpg" 
            />
            <p className="text-xs text-muted-foreground">Recommended size: 1200×630 pixels</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="music.song">Music</SelectItem>
                <SelectItem value="video.movie">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name (Optional)</Label>
            <Input 
              id="siteName" 
              value={siteName} 
              onChange={(e) => setSiteName(e.target.value)} 
              placeholder="Your Website Name" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="locale">Locale (Optional)</Label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger id="locale">
                <SelectValue placeholder="Select locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en_US">English (US)</SelectItem>
                <SelectItem value="en_GB">English (UK)</SelectItem>
                <SelectItem value="es_ES">Spanish</SelectItem>
                <SelectItem value="fr_FR">French</SelectItem>
                <SelectItem value="de_DE">German</SelectItem>
                <SelectItem value="ja_JP">Japanese</SelectItem>
                <SelectItem value="zh_CN">Chinese (Simplified)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview & Generated Code */}
      <div className="space-y-6">
        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {image ? (
              <div className="mb-4 border rounded-md overflow-hidden">
                <img 
                  src={image} 
                  alt="OpenGraph Preview" 
                  className="w-full h-auto object-cover max-h-[200px]" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x630?text=Invalid+Image+URL';
                  }}
                />
              </div>
            ) : (
              <div className="mb-4 bg-muted h-[200px] flex items-center justify-center rounded-md">
                <span className="text-muted-foreground">Image preview will appear here</span>
              </div>
            )}
            
            <div className="space-y-1">
              <h3 className="font-semibold text-lg line-clamp-1">{title || 'Your Title'}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{description || 'Your description will appear here'}</p>
              <div className="text-xs text-muted-foreground truncate">{url || 'https://example.com'}</div>
              {siteName && <div className="text-xs">{siteName}</div>}
            </div>
          </CardContent>
        </Card>
        
        {/* Generated Code */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Meta Tags</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={downloadHtml}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs md:text-sm">
              {generateHtml()}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OgTagGenerator;
