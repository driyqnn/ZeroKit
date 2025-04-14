
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Image, AlertTriangle, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface ImageItem {
  src: string;
  alt: string;
  hasAlt: boolean;
  width: number;
  height: number;
  fileName: string;
}

interface CheckResult {
  url: string;
  totalImages: number;
  imagesWithAlt: number;
  imagesWithEmptyAlt: number;
  imagesWithoutAlt: number;
  images: ImageItem[];
}

const ImageAltChecker: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  // In a real app, this would make an actual API request
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // This is mock data. In a real app, this would come from scanning the actual page
      const mockResult: CheckResult = {
        url: url.startsWith('http') ? url : `https://${url}`,
        totalImages: 5,
        imagesWithAlt: 3,
        imagesWithEmptyAlt: 1,
        imagesWithoutAlt: 1,
        images: [
          {
            src: 'https://picsum.photos/id/1018/300/200',
            alt: 'A beautiful mountain landscape with a lake',
            hasAlt: true,
            width: 300,
            height: 200,
            fileName: 'mountain-landscape.jpg'
          },
          {
            src: 'https://picsum.photos/id/1015/300/200',
            alt: 'River flowing through a forest',
            hasAlt: true,
            width: 300,
            height: 200,
            fileName: 'river-forest.jpg'
          },
          {
            src: 'https://picsum.photos/id/1019/300/200',
            alt: '',
            hasAlt: false,
            width: 300,
            height: 200,
            fileName: 'empty-alt.jpg'
          },
          {
            src: 'https://picsum.photos/id/1020/300/200',
            alt: 'Logo of the website',
            hasAlt: true,
            width: 300,
            height: 200,
            fileName: 'logo.png'
          },
          {
            src: 'https://picsum.photos/id/1021/300/200',
            alt: '',
            hasAlt: false,
            width: 300,
            height: 200,
            fileName: 'no-alt.jpg'
          }
        ]
      };
      
      setResult(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  const getAltStatusIcon = (image: ImageItem) => {
    if (!image.hasAlt) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (image.alt === '') {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  const getAltStatusText = (image: ImageItem) => {
    if (!image.hasAlt) {
      return 'Missing ALT attribute';
    }
    if (image.alt === '') {
      return 'Empty ALT attribute';
    }
    return 'Valid ALT attribute';
  };

  const getAltStatusClass = (image: ImageItem) => {
    if (!image.hasAlt) {
      return 'text-red-500';
    }
    if (image.alt === '') {
      return 'text-yellow-500';
    }
    return 'text-green-500';
  };

  const getProgress = () => {
    if (!result) return 0;
    return (result.imagesWithAlt / result.totalImages) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Image ALT Checker
          </CardTitle>
          <CardDescription>
            Check for missing or empty ALT attributes on images to improve accessibility and SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  placeholder="Enter website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!url || isLoading}>
                  {isLoading ? 'Checking...' : 'Check Images'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the URL of the website you want to check for image ALT attributes
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
              
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4 border rounded-lg p-4">
                  <Skeleton className="h-32 w-32 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : result ? (
        <Card>
          <CardHeader>
            <CardTitle>Results for {result.url}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="bg-background border rounded-lg p-4 flex flex-col items-center justify-center min-w-[150px]">
                  <span className="text-3xl font-bold">{result.totalImages}</span>
                  <span className="text-sm text-muted-foreground">Total Images</span>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex flex-col items-center justify-center min-w-[150px]">
                  <span className="text-3xl font-bold text-green-500">{result.imagesWithAlt}</span>
                  <span className="text-sm text-green-500/80">With ALT Text</span>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex flex-col items-center justify-center min-w-[150px]">
                  <span className="text-3xl font-bold text-yellow-500">{result.imagesWithEmptyAlt}</span>
                  <span className="text-sm text-yellow-500/80">Empty ALT</span>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex flex-col items-center justify-center min-w-[150px]">
                  <span className="text-3xl font-bold text-red-500">{result.imagesWithoutAlt}</span>
                  <span className="text-sm text-red-500/80">Missing ALT</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">ALT Text Coverage</span>
                  <span className="text-sm font-medium">{Math.round(getProgress())}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${getProgress()}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="font-medium text-lg border-b pb-2">Image Details</h3>
              
              <div className="space-y-4">
                {result.images.map((image, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 border rounded-lg p-4">
                    <div className="w-full md:w-32 h-32 relative bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={image.src} 
                        alt={image.alt || "Image without proper ALT text"} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // If image fails to load, show placeholder
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium truncate max-w-xs">{image.fileName}</h4>
                        <div className={`flex items-center gap-1.5 ${getAltStatusClass(image)}`}>
                          {getAltStatusIcon(image)}
                          <span className="text-sm font-medium">{getAltStatusText(image)}</span>
                        </div>
                      </div>
                      
                      <div className="border rounded p-2 bg-muted/50">
                        <code className="text-sm break-all block">
                          {image.alt ? image.alt : <span className="text-muted-foreground italic">No ALT text</span>}
                        </code>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>Dimensions: {image.width}x{image.height}px</span>
                        <a 
                          href={image.src} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View Image</span>
                        </a>
                      </div>
                      
                      {!image.hasAlt && (
                        <div className="mt-2 text-sm text-red-500">
                          <strong>Recommendation:</strong> Add a descriptive ALT attribute to improve accessibility and SEO.
                        </div>
                      )}
                      
                      {image.hasAlt && image.alt === '' && (
                        <div className="mt-2 text-sm text-yellow-500">
                          <strong>Recommendation:</strong> Empty ALT attributes are appropriate for decorative images, 
                          but confirm this image is truly decorative.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-medium">Recommendations</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Use descriptive ALT text that accurately describes the image content</li>
                  <li>Keep ALT text concise, typically 125 characters or less</li>
                  <li>Use empty ALT attributes (alt="") for decorative images</li>
                  <li>Include keywords in ALT text where natural and relevant</li>
                  <li>Don't start ALT text with "Image of" or "Picture of" - screen readers already announce it's an image</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default ImageAltChecker;
