
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
  className?: string;
  children?: React.ReactNode;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  height = '1rem',
  width = '100%',
  className = '',
  ...props
}) => {
  return (
    <Skeleton 
      className={`${className}`}
      style={{ 
        height,
        width,
        ...props.style 
      }}
      {...props}
    />
  );
};

interface SkeletonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const SkeletonWrapper: React.FC<SkeletonProps> = ({
  isLoading = true,
  children
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {React.Children.map(children, (child) => {
          if (!child || typeof child !== 'object' || !('type' in child)) return null;
          
          if (typeof child.type === 'string') {
            switch (child.type) {
              case 'h1':
                return <SkeletonBox height="2.5rem" width="60%" className="mb-4" />;
              case 'h2':
                return <SkeletonBox height="2rem" width="50%" className="mb-3" />;
              case 'h3':
                return <SkeletonBox height="1.75rem" width="40%" className="mb-2" />;
              case 'p':
                return <SkeletonBox height="1rem" className="mb-2" />;
              case 'img':
                return <SkeletonBox height="200px" className="mb-4 rounded-md" />;
              case 'button':
                return <SkeletonBox height="2.5rem" width="120px" className="rounded-md" />;
              case 'input':
                return <SkeletonBox height="2.5rem" className="rounded-md mb-2" />;
              default:
                return <SkeletonBox height="1rem" className="mb-2" />;
            }
          }
          
          return <SkeletonBox height="1rem" className="mb-2" />;
        })}
      </div>
    );
  }
  
  return <>{children}</>;
};

// Custom hook to determine if we need to show skeleton based on connection speed
export const useSkeletonLoading = (initialLoadingState = true, minDuration = 500) => {
  const [isLoading, setIsLoading] = useState(initialLoadingState);
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow' | 'unknown'>('unknown');
  
  useEffect(() => {
    // Use the Navigation Timing API to determine connection speed
    const checkConnectionSpeed = () => {
      if (window.navigator && 'connection' in window.navigator) {
        const conn = (window.navigator as any).connection;
        
        if (conn) {
          // Check connection type if available
          if (conn.effectiveType) {
            const effectiveType = conn.effectiveType;
            
            if (['slow-2g', '2g', '3g'].includes(effectiveType)) {
              setConnectionSpeed('slow');
              // For slow connections, show loading for at least minDuration
              setTimeout(() => setIsLoading(false), minDuration);
            } else {
              setConnectionSpeed('fast');
              // For fast connections, minimum loading time
              setTimeout(() => setIsLoading(false), 200);
            }
            return;
          }
        }
      }
      
      // Fallback: use performance timing
      if (window.performance && window.performance.timing) {
        const navStart = window.performance.timing.navigationStart;
        const responseEnd = window.performance.timing.responseEnd;
        const loadTime = responseEnd - navStart;
        
        if (loadTime > 1000) {
          setConnectionSpeed('slow');
          setTimeout(() => setIsLoading(false), minDuration);
        } else {
          setConnectionSpeed('fast');
          setTimeout(() => setIsLoading(false), 200);
        }
        return;
      }
      
      // Default fallback
      setConnectionSpeed('unknown');
      setTimeout(() => setIsLoading(false), minDuration / 2);
    };
    
    // Start checking loading status
    const timer = setTimeout(checkConnectionSpeed, 100);
    
    return () => clearTimeout(timer);
  }, [minDuration]);
  
  return { isLoading, connectionSpeed, setIsLoading };
};

export default SkeletonWrapper;
