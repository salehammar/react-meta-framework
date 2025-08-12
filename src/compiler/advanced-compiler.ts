// import { createCompiler } from "./compiler.js"; // Unused but kept for future use

export interface CodeTransform {
  id: string;
  type:
    | "layout-shift"
    | "useState-to-useReducer"
    | "memoization"
    | "dependency"
    | "bundle";
  description: string;
  before: string;
  after: string;
  impact: "low" | "medium" | "high";
  confidence: number;
  applied: boolean;
}

export interface BundlePhysics {
  packageName: string;
  estimatedSize: number; // in KB
  estimatedTTI: number; // in milliseconds
  estimatedFCP: number; // First Contentful Paint
  estimatedLCP: number; // Largest Contentful Paint
  recommendation: "recommended" | "caution" | "not-recommended";
  reasoning: string[];
}

export interface AdvancedCompilationResult {
  originalCode: string;
  transformedCode: string;
  transforms: CodeTransform[];
  bundleAnalysis: BundlePhysics[];
  performanceScore: number; // 0-100
  suggestions: string[];
}

/**
 * Advanced compiler with context-aware code transforms
 * Detects performance issues and automatically applies optimizations
 */
export function createAdvancedCompiler() {
  // const baseCompiler = createCompiler(); // Unused but kept for future use
  const appliedTransforms = new Map<string, CodeTransform>();
  const transformHistory: CodeTransform[] = [];

  /**
   * Compile code with advanced optimizations
   */
  const compile = async (
    code: string,
    context?: {
      target?: "web" | "mobile" | "desktop";
      performanceBudget?: number;
      bundleSize?: number;
    },
  ): Promise<AdvancedCompilationResult> => {
    const transforms: CodeTransform[] = [];
    let transformedCode = code;

    // Apply context-aware transforms
    transforms.push(...detectLayoutShiftRisks(code));
    transforms.push(...detectUseStateToUseReducer(code));
    transforms.push(...detectMemoizationOpportunities(code));
    transforms.push(...detectDependencyIssues(code));

    // Apply transforms based on context
    transforms.forEach((transform) => {
      if (shouldApplyTransform(transform, context)) {
        transformedCode = applyTransform(transformedCode, transform);
        transform.applied = true;
        appliedTransforms.set(transform.id, transform);
        transformHistory.push(transform);
      }
    });

    // Analyze bundle impact
    const bundleAnalysis = analyzeBundleImpact(code, context);

    // Calculate performance score
    const performanceScore = calculatePerformanceScore(
      transforms,
      bundleAnalysis,
    );

    // Generate suggestions
    const suggestions = generateSuggestions(
      transforms,
      bundleAnalysis,
      performanceScore,
    );

    return {
      originalCode: code,
      transformedCode,
      transforms,
      bundleAnalysis,
      performanceScore,
      suggestions,
    };
  };

  /**
   * Detect layout shift risks and inject CSS containment
   */
  const detectLayoutShiftRisks = (code: string): CodeTransform[] => {
    const transforms: CodeTransform[] = [];

    // Look for dynamic content that could cause layout shifts
    const patterns = [
      {
        regex: /<img[^>]*src=\{([^}]+)\}[^>]*>/g,
        description: "Dynamic image loading without dimensions",
        risk: "high",
      },
      {
        regex: /<div[^>]*>\s*\{([^}]+)\s*\?\s*([^}]+)\s*:\s*([^}]+)\}/g,
        description: "Conditional rendering without stable dimensions",
        risk: "medium",
      },
      {
        regex: /\.map\([^)]*\)\s*=>\s*<[^>]*>/g,
        description: "Dynamic list rendering without virtualization",
        risk: "medium",
      },
    ];

    patterns.forEach((pattern, index) => {
      const matches = code.match(pattern.regex);
      if (matches) {
        matches.forEach((match) => {
          const transform: CodeTransform = {
            id: `layout-shift-${index}`,
            type: "layout-shift",
            description: `Prevent layout shift: ${pattern.description}`,
            before: match,
            after: injectCSSContainment(match),
            impact: pattern.risk as "low" | "medium" | "high",
            confidence: 0.8,
            applied: false,
          };

          transforms.push(transform);
        });
      }
    });

    return transforms;
  };

  /**
   * Inject CSS containment to prevent layout shifts
   */
  const injectCSSContainment = (element: string): string => {
    if (element.includes("style=")) {
      return element.replace(
        /style=\{([^}]+)\}/,
        'style={{ ...$1, contain: "layout" }}',
      );
    } else {
      return element.replace(/<(\w+)/, '<$1 style={{ contain: "layout" }}');
    }
  };

  /**
   * Detect when useState should be converted to useReducer
   */
  const detectUseStateToUseReducer = (code: string): CodeTransform[] => {
    const transforms: CodeTransform[] = [];

    // Look for multiple useState calls that could be consolidated
    const useStateMatches = code.match(
      /const\s+\[([^,]+),\s*set([^]]+)\]\s*=\s*useState/g,
    );

    if (useStateMatches && useStateMatches.length > 2) {
      const transform: CodeTransform = {
        id: "useState-to-useReducer",
        type: "useState-to-useReducer",
        description:
          "Convert multiple useState to useReducer for better state management",
        before: "// Multiple useState calls detected",
        after: "// Consider using useReducer for complex state",
        impact: "medium",
        confidence: 0.7,
        applied: false,
      };

      transforms.push(transform);
    }

    // Look for complex state updates
    const complexUpdates = code.match(/set\w+\([^)]*=>\s*\{[^}]*\}/g);
    if (complexUpdates && complexUpdates.length > 1) {
      const transform: CodeTransform = {
        id: "complex-state-updates",
        type: "useState-to-useReducer",
        description: "Complex state updates detected - consider useReducer",
        before: "// Complex state updates detected",
        after: "// Use useReducer for complex state logic",
        impact: "medium",
        confidence: 0.8,
        applied: false,
      };

      transforms.push(transform);
    }

    return transforms;
  };

  /**
   * Detect memoization opportunities
   */
  const detectMemoizationOpportunities = (code: string): CodeTransform[] => {
    const transforms: CodeTransform[] = [];

    // Look for expensive computations without memoization
    const expensivePatterns = [
      {
        regex: /\.map\([^)]*\)\.filter\([^)]*\)/g,
        description: "Chained array operations without memoization",
        impact: "high",
      },
      {
        regex: /\.reduce\([^)]*\)/g,
        description: "Array reduction without memoization",
        impact: "high",
      },
      {
        regex: /Object\.keys\([^)]*\)\.map\(/g,
        description: "Object iteration without memoization",
        impact: "medium",
      },
    ];

    expensivePatterns.forEach((pattern, index) => {
      const matches = code.match(pattern.regex);
      if (matches) {
        matches.forEach((match) => {
          const transform: CodeTransform = {
            id: `memoization-${index}`,
            type: "memoization",
            description: `Memoize expensive operation: ${pattern.description}`,
            before: match,
            after: `useMemo(() => ${match}, [dependencies])`,
            impact: pattern.impact as "low" | "medium" | "high",
            confidence: 0.9,
            applied: false,
          };

          transforms.push(transform);
        });
      }
    });

    return transforms;
  };

  /**
   * Detect dependency issues
   */
  const detectDependencyIssues = (code: string): CodeTransform[] => {
    const transforms: CodeTransform[] = [];

    // Look for missing dependency arrays
    const missingDeps = code.match(/useEffect\([^)]*\)/g);
    if (missingDeps) {
      missingDeps.forEach((match, index) => {
        if (!match.includes("[")) {
          const transform: CodeTransform = {
            id: `dependency-${index}`,
            type: "dependency",
            description: "Missing dependency array in useEffect",
            before: match,
            after: match.replace(/\)$/, ", [])"),
            impact: "high",
            confidence: 0.9,
            applied: false,
          };

          transforms.push(transform);
        }
      });
    }

    // Look for unstable dependencies
    const unstableDeps = code.match(/const\s+(\w+)\s*=\s*\{[^}]*\}/g);
    if (unstableDeps) {
      unstableDeps.forEach((match, index) => {
        const varMatch = match.match(/const\s+(\w+)/);
        if (varMatch) {
          const variable = varMatch[1];
          if (code.includes(`useEffect`) && code.includes(variable)) {
            const transform: CodeTransform = {
              id: `unstable-dep-${index}`,
              type: "dependency",
              description: `Unstable dependency: ${variable}`,
              before: match,
              after: match.replace(/=\s*/, "= useMemo(() => "),
              impact: "medium",
              confidence: 0.8,
              applied: false,
            };

            transforms.push(transform);
          }
        }
      });
    }

    return transforms;
  };

  /**
   * Determine if a transform should be applied
   */
  const shouldApplyTransform = (
    transform: CodeTransform,
    context?: any,
  ): boolean => {
    // Always apply high-impact transforms
    if (transform.impact === "high") return true;

    // Apply medium-impact transforms if performance budget allows
    if (transform.impact === "medium" && context?.performanceBudget > 50)
      return true;

    // Apply low-impact transforms only if explicitly requested
    if (transform.impact === "low" && context?.applyLowImpact) return true;

    return false;
  };

  /**
   * Apply a transform to the code
   */
  const applyTransform = (code: string, transform: CodeTransform): string => {
    if (transform.applied) return code;

    // Simple string replacement (in real implementation, use AST manipulation)
    if (code.includes(transform.before)) {
      return code.replace(transform.before, transform.after);
    }

    return code;
  };

  /**
   * Analyze bundle impact of dependencies
   */
  const analyzeBundleImpact = (
    code: string,
    context?: any,
  ): BundlePhysics[] => {
    const analysis: BundlePhysics[] = [];

    // Common packages and their estimated impact
    const packageEstimates: Record<
      string,
      {
        size: number;
        tti: number;
        fcp: number;
        lcp: number;
      }
    > = {
      lodash: { size: 70, tti: 150, fcp: 50, lcp: 200 },
      moment: { size: 65, tti: 120, fcp: 40, lcp: 180 },
      "date-fns": { size: 15, tti: 30, fcp: 10, lcp: 50 },
      ramda: { size: 45, tti: 80, fcp: 25, lcp: 120 },
      rxjs: { size: 35, tti: 60, fcp: 20, lcp: 100 },
      axios: { size: 12, tti: 25, fcp: 8, lcp: 40 },
      "react-query": { size: 25, tti: 45, fcp: 15, lcp: 70 },
      zustand: { size: 8, tti: 15, fcp: 5, lcp: 25 },
    };

    // Check for package usage in code
    Object.entries(packageEstimates).forEach(([packageName, estimates]) => {
      if (code.includes(packageName)) {
        const recommendation = getRecommendation(estimates, context);
        const reasoning = getReasoning(estimates, recommendation);

        analysis.push({
          packageName,
          estimatedSize: estimates.size,
          estimatedTTI: estimates.tti,
          estimatedFCP: estimates.fcp,
          estimatedLCP: estimates.lcp,
          recommendation,
          reasoning,
        });
      }
    });

    return analysis;
  };

  /**
   * Get recommendation based on estimates and context
   */
  const getRecommendation = (
    estimates: any,
    _context?: any,
  ): "recommended" | "caution" | "not-recommended" => {
    const { tti, size } = estimates;

    if (tti > 100 || size > 50) return "caution";
    if (tti > 150 || size > 70) return "not-recommended";
    return "recommended";
  };

  /**
   * Get reasoning for recommendation
   */
  const getReasoning = (estimates: any, recommendation: string): string[] => {
    const reasoning: string[] = [];

    if (estimates.size > 50) {
      reasoning.push(`Large bundle size: ${estimates.size}KB`);
    }

    if (estimates.tti > 100) {
      reasoning.push(`High TTI impact: +${estimates.tti}ms`);
    }

    if (estimates.fcp > 30) {
      reasoning.push(`FCP impact: +${estimates.fcp}ms`);
    }

    if (recommendation === "not-recommended") {
      reasoning.push("Consider lighter alternatives");
    }

    return reasoning;
  };

  /**
   * Calculate overall performance score
   */
  const calculatePerformanceScore = (
    transforms: CodeTransform[],
    bundleAnalysis: BundlePhysics[],
  ): number => {
    let score = 100;

    // Deduct points for applied transforms
    transforms.forEach((transform) => {
      if (transform.applied) {
        switch (transform.impact) {
          case "high":
            score -= 15;
            break;
          case "medium":
            score -= 10;
            break;
          case "low":
            score -= 5;
            break;
        }
      }
    });

    // Deduct points for bundle issues
    bundleAnalysis.forEach((analysis) => {
      if (analysis.recommendation === "not-recommended") {
        score -= 20;
      } else if (analysis.recommendation === "caution") {
        score -= 10;
      }
    });

    return Math.max(0, score);
  };

  /**
   * Generate optimization suggestions
   */
  const generateSuggestions = (
    transforms: CodeTransform[],
    bundleAnalysis: BundlePhysics[],
    performanceScore: number,
  ): string[] => {
    const suggestions: string[] = [];

    if (performanceScore < 50) {
      suggestions.push(
        "Critical performance issues detected - immediate action required",
      );
    } else if (performanceScore < 75) {
      suggestions.push(
        "Performance improvements needed - review high-impact transforms",
      );
    } else if (performanceScore < 90) {
      suggestions.push(
        "Good performance - consider applying medium-impact optimizations",
      );
    } else {
      suggestions.push(
        "Excellent performance - maintain current optimization level",
      );
    }

    // Add specific suggestions based on transforms
    const highImpactTransforms = transforms.filter(
      (t) => t.impact === "high" && !t.applied,
    );
    if (highImpactTransforms.length > 0) {
      suggestions.push(
        `Apply ${highImpactTransforms.length} high-impact optimizations`,
      );
    }

    // Add bundle suggestions
    const notRecommended = bundleAnalysis.filter(
      (a) => a.recommendation === "not-recommended",
    );
    if (notRecommended.length > 0) {
      suggestions.push(
        `Replace ${notRecommended.length} heavy dependencies with lighter alternatives`,
      );
    }

    return suggestions;
  };

  /**
   * Get transform history
   */
  const getTransformHistory = (): CodeTransform[] => {
    return [...transformHistory];
  };

  /**
   * Get applied transforms
   */
  const getAppliedTransforms = (): CodeTransform[] => {
    return Array.from(appliedTransforms.values());
  };

  return {
    compile,
    getTransformHistory,
    getAppliedTransforms,
  };
}
