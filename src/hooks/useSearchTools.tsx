
import { useState, useMemo, useCallback } from "react";
import { developerTools } from "@/data/categories/developerTools";
import { designMediaTools } from "@/data/categories/designMediaTools";
import { convertersCalculators } from "@/data/categories/convertersCalculators";
import { academicTools } from "@/data/categories/academicTools";
import { engineeringTools } from "@/data/categories/engineeringTools";
import { privacySecurityTools } from "@/data/categories/privacySecurityTools";
import { writingTools } from "@/data/categories/writingTools";
import { lifestyleTools } from "@/data/categories/lifestyleTools";
import { webSeoTools } from "@/data/categories/webSeoTools";
import { productivityTools } from "@/data/categories/productivityTools";
import { LucideIcon } from "lucide-react";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  slug: string;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}

export const useSearchTools = () => {
  const [results, setResults] = useState<Tool[]>([]);

  // Combine all tools into one array for searching and filter out duplicates
  const allTools = useMemo(() => {
    const toolsArray = [
      ...developerTools.tools,
      ...designMediaTools.tools,
      ...convertersCalculators.tools,
      ...academicTools.tools,
      ...engineeringTools.tools,
      ...privacySecurityTools.tools,
      ...writingTools.tools,
      ...lifestyleTools.tools,
      ...webSeoTools.tools,
      ...productivityTools.tools
    ].filter(tool => tool.slug) as Tool[];
    
    // Remove duplicates by slug and verify each tool has a title and description
    const uniqueToolsBySlug = toolsArray.reduce((acc, current) => {
      // Skip tools without valid properties
      if (!current.slug || !current.title || !current.description) {
        return acc;
      }
      
      const isDuplicate = acc.find(tool => tool.slug === current.slug);
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, [] as Tool[]);
    
    return uniqueToolsBySlug;
  }, []);

  // Normalize text by removing special characters and converting to lowercase
  const normalizeText = useCallback((text: string): string => {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')     // Replace multiple spaces with a single space
      .trim();
  }, []);

  // Calculate a similarity score between two strings
  const calculateSimilarity = useCallback((s1: string, s2: string): number => {
    // Simple fuzzy matching for similar terms
    s1 = normalizeText(s1);
    s2 = normalizeText(s2);
    
    // Exact match
    if (s1 === s2) return 1;
    
    // Check if one string contains the other
    if (s1.includes(s2)) return 0.9;
    if (s2.includes(s1)) return 0.9;
    
    // Calculate word overlap
    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    
    let matchCount = 0;
    for (const word1 of words1) {
      if (word1.length < 3) continue; // Skip very short words
      
      for (const word2 of words2) {
        if (word1 === word2 || 
            (word1.length > 4 && word2.length > 4 && 
             (word1.includes(word2) || word2.includes(word1)))) {
          matchCount++;
          break;
        }
      }
    }
    
    const maxWords = Math.max(words1.length, words2.length);
    return maxWords > 0 ? matchCount / maxWords : 0;
  }, [normalizeText]);

  const searchTools = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const term = normalizeText(searchTerm);
    
    // Special case handling for common search terms
    const specialCaseMatches = handleSpecialCases(term);
    if (specialCaseMatches.length > 0) {
      setResults(specialCaseMatches);
      return;
    }
    
    // Split search term into words for multi-word search
    const searchWords = term.split(' ').filter(word => word.length > 1);
    
    // Find all tools that match the search term
    const matchedTools = allTools.map(tool => {
      const titleNormalized = normalizeText(tool.title);
      const descriptionNormalized = normalizeText(tool.description);
      
      // Calculate relevance score based on title and description matches
      let score = 0;
      
      // Title matching
      const titleSimilarity = calculateSimilarity(titleNormalized, term);
      score += titleSimilarity * 100;
      
      // Description matching
      const descriptionSimilarity = calculateSimilarity(descriptionNormalized, term);
      score += descriptionSimilarity * 25;
      
      // Word matching (for multi-word searches)
      if (searchWords.length > 1) {
        for (const word of searchWords) {
          if (titleNormalized.includes(word)) {
            score += 10;
          }
          if (descriptionNormalized.includes(word)) {
            score += 5;
          }
        }
      }
      
      // Exact matches get big boosts
      if (titleNormalized === term) score += 200;
      if (titleNormalized.startsWith(term)) score += 50;
      
      // Boost score for new/popular items
      if (tool.isNew) score += 10;
      if (tool.isPopular) score += 15;
      
      return { tool, score };
    }).filter(item => item.score > 0);
    
    // Sort by score (highest first)
    matchedTools.sort((a, b) => b.score - a.score);
    
    // Extract just the tools from the scored results
    const sortedTools = matchedTools.map(item => item.tool);
    
    // Limit to top 20 results for performance
    setResults(sortedTools.slice(0, 20));
  }, [allTools, calculateSimilarity, normalizeText]);

  // Handle special case searches
  const handleSpecialCases = useCallback((term: string): Tool[] => {
    // Special cases for common synonyms and alternate names
    const specialCases: Record<string, string[]> = {
      'markdown': ['markdown-editor'],
      'markdown editor': ['markdown-editor'],
      'md': ['markdown-editor'],
      'text editor': ['markdown-editor'],
      'qr': ['qr-code-generator'],
      'qr code': ['qr-code-generator'],
      'qrcode': ['qr-code-generator'],
      'password': ['password-generator', 'password-security', 'password-strength-tester', 'password-game'],
      'color': ['color-palette-generator', 'hex-color-converter'],
      'colours': ['color-palette-generator'],
      'palette': ['color-palette-generator'],
      'hex': ['hex-color-converter'],
      'games': ['password-game', 'market-rush', 'dice-roller'],
      'gaming': ['password-game', 'market-rush', 'dice-roller'],
      'draw': ['drawing-board'],
      'paint': ['drawing-board'],
      'sketch': ['drawing-board'],
      'read': ['readability-score-checker'],
      'reading': ['readability-score-checker'],
      'readability': ['readability-score-checker'],
      'physics': ['physics-calculator'],
      'calculator': ['physics-calculator', 'statistical-calculator', 'loan-calculator']
    };
    
    const matches: Tool[] = [];
    
    // Check if the search term matches any special case
    for (const [key, slugs] of Object.entries(specialCases)) {
      if (key === term || calculateSimilarity(key, term) > 0.8) {
        for (const slug of slugs) {
          const tool = allTools.find(t => t.slug === slug);
          if (tool) matches.push(tool);
        }
        if (matches.length > 0) break;
      }
    }
    
    return matches;
  }, [allTools, calculateSimilarity]);

  return { searchTools, results };
};

export default useSearchTools;
