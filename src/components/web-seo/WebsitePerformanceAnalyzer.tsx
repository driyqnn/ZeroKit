
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { LineChart, Activity, Clock, Zap, Globe, Smartphone, Monitor, BarChart4 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceMetric {
  name: string;
  value: number;
  score: 'good' | 'needs-improvement' | 'poor';
  icon: React.ReactNode;
  description: string;
}

interface PerformanceResult {
  overallScore: number;
  metrics: {
    mobile: PerformanceMetric[];
    desktop: PerformanceMetric[];
  };
}

const WebsitePerformanceAnalyzer: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PerformanceResult | null>(null);
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('mobile');
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Here we would call an actual API to analyze the website
    // For now, we'll simulate it with a timeout and mock data
    setTimeout(() => {
      const mockResult: PerformanceResult = {
        overallScore: 76,
        metrics: {
          mobile: [
            {
              name: 'First Contentful Paint',
              value: 2.3,
              score: 'needs-improvement',
              icon: <Clock className="h-5 w-5" />,
              description: 'Time until the first content is painted on screen'
            },
            {
              name: 'Speed Index',
              value: 3.8,
              score: 'needs-improvement',
              icon: <Activity className="h-5 w-5" />,
              description: 'How quickly content is visibly populated'
            },
            {
              name: 'Largest Contentful Paint',
              value: 3.2,
              score: 'needs-improvement',
              icon: <Zap className="h-5 w-5" />,
              description: 'Largest content element rendered on screen'
            },
            {
              name: 'Time to Interactive',
              value: 4.7,
              score: 'poor',
              icon: <Clock className="h-5 w-5" />,
              description: 'Time until the page becomes fully interactive'
            },
            {
              name: 'Total Blocking Time',
              value: 720,
              score: 'poor',
              icon: <Clock className="h-5 w-5" />,
              description: 'Sum of all time periods blocking the main thread'
            },
            {
              name: 'Cumulative Layout Shift',
              value: 0.12,
              score: 'good',
              icon: <Activity className="h-5 w-5" />,
              description: 'Measures visual stability of the page'
            }
          ],
          desktop: [
            {
              name: 'First Contentful Paint',
              value: 1.1,
              score: 'good',
              icon: <Clock className="h-5 w-5" />,
              description: 'Time until the first content is painted on screen'
            },
            {
              name: 'Speed Index',
              value: 2.3,
              score: 'good',
              icon: <Activity className="h-5 w-5" />,
              description: 'How quickly content is visibly populated'
            },
            {
              name: 'Largest Contentful Paint',
              value: 1.8,
              score: 'good',
              icon: <Zap className="h-5 w-5" />,
              description: 'Largest content element rendered on screen'
            },
            {
              name: 'Time to Interactive',
              value: 2.1,
              score: 'good',
              icon: <Clock className="h-5 w-5" />,
              description: 'Time until the page becomes fully interactive'
            },
            {
              name: 'Total Blocking Time',
              value: 340,
              score: 'needs-improvement',
              icon: <Clock className="h-5 w-5" />,
              description: 'Sum of all time periods blocking the main thread'
            },
            {
              name: 'Cumulative Layout Shift',
              value: 0.08,
              score: 'good', 
              icon: <Activity className="h-5 w-5" />,
              description: 'Measures visual stability of the page'
            }
          ]
        }
      };
      
      setResult(mockResult);
      setIsLoading(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMetricColor = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
    }
  };

  const getMetricBackgroundColor = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
    }
  };

  const formatMetricValue = (metric: PerformanceMetric) => {
    if (metric.name.includes('Time') && !metric.name.includes('Interactive')) {
      return `${metric.value} ms`;
    } else if (metric.name.includes('Paint') || metric.name.includes('Index') || metric.name.includes('Interactive')) {
      return `${metric.value} s`;
    }
    return metric.value.toString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Performance Analyzer</CardTitle>
          <CardDescription>
            Analyze website performance metrics and get recommendations for improvement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="Enter website URL (e.g., example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!url || isLoading}>
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>
            </div>
          </form>
          
          {isLoading && (
            <div className="py-8 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Analyzing Website Performance</h3>
                <p className="text-muted-foreground">This may take a minute...</p>
              </div>
              <Progress value={33} className="mx-auto max-w-md" />
            </div>
          )}
        </CardContent>
      </Card>

      {result && !isLoading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart4 className="h-5 w-5" />
                Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative rounded-full w-32 h-32 flex items-center justify-center border-8 border-muted mb-4">
                <div 
                  className="absolute inset-0 rounded-full" 
                  style={{ 
                    background: `conic-gradient(${getScoreBackgroundColor(result.overallScore)} ${result.overallScore}%, transparent ${result.overallScore}%)`,
                    clipPath: 'circle(50%)'
                  }}
                ></div>
                <span className={`text-4xl font-bold z-10 ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}
                </span>
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button 
                  variant={activeDevice === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setActiveDevice('mobile')}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Button>
                <Button 
                  variant={activeDevice === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setActiveDevice('desktop')}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                {activeDevice === 'mobile' ? 'Mobile device metrics' : 'Desktop metrics'} for {url}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.metrics[activeDevice].map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <h3 className="font-medium">{metric.name}</h3>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getMetricColor(metric.score)} bg-opacity-20 ${getMetricBackgroundColor(metric.score).replace('bg-', 'bg-opacity-10 bg-')}`}>
                        {metric.score === 'good' ? 'Good' : metric.score === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{formatMetricValue(metric)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">1</span>
                  <span>Optimize images to reduce page load time</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">2</span>
                  <span>Minimize render-blocking resources by deferring non-critical JavaScript</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">3</span>
                  <span>Implement browser caching to improve repeat visits</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">4</span>
                  <span>Reduce server response time (TTFB) for better performance</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary">5</span>
                  <span>Minify CSS and JavaScript files to reduce file sizes</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WebsitePerformanceAnalyzer;
