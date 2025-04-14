
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const MetaTagPreview = () => {
  const [title, setTitle] = useState('Your Page Title');
  const [description, setDescription] = useState('Your page description goes here. Keep it concise and informative for better SEO.');
  const [url, setUrl] = useState('https://example.com/your-page');
  const [image, setImage] = useState('https://via.placeholder.com/1200x630');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card className="p-0">
          <CardHeader>
            <CardTitle>Page Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter page title" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter page description" 
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="Enter page URL" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                placeholder="Enter image URL" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="dark-mode" 
                checked={isDarkMode} 
                onCheckedChange={setIsDarkMode} 
              />
              <Label htmlFor="dark-mode">Dark Mode Preview</Label>
            </div>
          </CardContent>
        </Card>
        
        {/* Previews */}
        <Tabs defaultValue="google">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google" className="mt-0">
            <Card className={`p-4 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
              <div className="space-y-2">
                <div className="text-sm text-primary truncate">{url}</div>
                <h3 className="text-xl text-blue-600 hover:underline cursor-pointer font-medium truncate">{title}</h3>
                <p className="text-sm line-clamp-2">{description}</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="facebook" className="mt-0">
            <Card className={`overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
              <div className="relative pt-[52.5%]">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>
              <div className="p-3 border-t">
                <div className="text-xs uppercase text-muted-foreground">example.com</div>
                <h3 className="text-base font-semibold line-clamp-2">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="twitter" className="mt-0">
            <Card className={`overflow-hidden rounded-xl ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
              <div className="relative pt-[52.5%]">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
                <div className="text-xs text-muted-foreground mt-2 truncate">{url}</div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated Meta Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`<title>${title}</title>
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${image}" />`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaTagPreview;
