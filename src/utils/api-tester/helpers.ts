
// Helper functions for the API Tester component

/**
 * Parses header string into a record object
 * Format expected: key: value (one per line)
 */
export const parseHeaders = (headersStr: string): Record<string, string> => {
  if (!headersStr.trim()) return {};
  
  const headers: Record<string, string> = {};
  headersStr.split('\n').forEach(line => {
    if (!line.trim()) return;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    
    if (key && value) {
      headers[key] = value;
    }
  });
  
  return headers;
};

/**
 * Parses URL parameter string into a record object
 * Format expected: key=value (one per line)
 */
export const parseParams = (paramsStr: string): Record<string, string> => {
  if (!paramsStr.trim()) return {};
  
  const params: Record<string, string> = {};
  paramsStr.split('\n').forEach(line => {
    if (!line.trim()) return;
    
    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) return;
    
    const key = line.substring(0, equalsIndex).trim();
    const value = line.substring(equalsIndex + 1).trim();
    
    if (key && value) {
      params[key] = value;
    }
  });
  
  return params;
};

/**
 * Builds a URL with query parameters
 */
export const buildUrl = (baseUrl: string, params: Record<string, string>): string => {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};

/**
 * Formats a response object for display
 */
export const formatResponse = (response: any): string => {
  if (typeof response === 'object') {
    try {
      return JSON.stringify(response, null, 2);
    } catch (e) {
      return String(response);
    }
  }
  
  try {
    const parsed = JSON.parse(response);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return response;
  }
};

/**
 * Formats a timestamp for display in the request history
 */
export const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Less than a minute ago
  if (diffMs < 60000) {
    return 'Just now';
  }
  
  // Less than an hour ago
  if (diffMs < 3600000) {
    const minutes = Math.floor(diffMs / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than a day ago
  if (diffMs < 86400000) {
    const hours = Math.floor(diffMs / 3600000);
    return `${hours}h ago`;
  }
  
  // Default: formatted date
  return formatDate(date);
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

/**
 * Formats the size of a response in a human-readable format
 */
export const formatSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};
