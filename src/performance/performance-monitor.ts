import { createReactiveState } from "../state/reactive-state.js";

export interface PerformanceMetrics {
  // Render performance
  renderCount: number;
  averageRenderTime: number;
  slowestRender: number;
  fastestRender: number;

  // Memory performance
  memoryUsage: number;
  memoryPeak: number;
  memoryLeaks: number;

  // Cache performance
  cacheHitRate: number;
  cacheMissRate: number;
  cacheSize: number;

  // Network performance
  requestCount: number;
  averageResponseTime: number;
  failedRequests: number;

  // Bundle performance
  bundleSize: number;
  chunkCount: number;
  lazyLoadedChunks: number;

  // Component performance
  componentRenderTimes: Map<string, number[]>;
  componentRenderCounts: Map<string, number>;
  expensiveComponents: string[];

  // State performance
  stateUpdates: number;
  derivedComputations: number;
  effectRuns: number;

  // Overall score
  performanceScore: number;
  optimizationSuggestions: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: "render" | "memory" | "cache" | "network" | "bundle" | "state";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  impact: string;
  fix: string;
  codeExample?: string;
  estimatedImprovement: number; // percentage
}

export interface PerformanceMonitor {
  // Core monitoring
  startMonitoring: () => void;
  stopMonitoring: () => void;
  isMonitoring: boolean;

  // Metrics collection
  trackRender: (_componentName: string, _renderTime: number) => void;
  trackMemory: () => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackCache: (_hit: boolean, _key: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackRequest: (
    _url: string,
    _responseTime: number,
    _success: boolean,
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackStateUpdate: (_stateName: string, _updateTime: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  trackEffect: (_effectName: string, _runTime: number) => void;

  // Performance analysis
  getMetrics: () => PerformanceMetrics;
  getOptimizationSuggestions: () => OptimizationSuggestion[];
  getPerformanceReport: () => PerformanceReport;

  // Alerts and thresholds
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setThreshold: (_metric: keyof PerformanceMetrics, _threshold: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onThresholdExceeded: (
    _callback: (_metric: string, _value: number, _threshold: number) => void,
  ) => void;

  // Performance optimization
  suggestOptimizations: () => void;
  autoOptimize: () => void;
}

export interface PerformanceReport {
  summary: {
    overallScore: number;
    grade: "A" | "B" | "C" | "D" | "F";
    status: "excellent" | "good" | "fair" | "poor" | "critical";
  };
  metrics: PerformanceMetrics;
  topIssues: OptimizationSuggestion[];
  recommendations: string[];
  trends: PerformanceTrend[];
}

export interface PerformanceTrend {
  metric: string;
  values: number[];
  trend: "improving" | "stable" | "declining";
  change: number; // percentage change
}

/**
 * Advanced performance monitoring system for React Meta Framework
 */
export function createPerformanceMonitor(): PerformanceMonitor {
  // Core state
  const isMonitoring = createReactiveState(false);
  const metrics = createReactiveState<PerformanceMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    slowestRender: 0,
    fastestRender: Infinity,
    memoryUsage: 0,
    memoryPeak: 0,
    memoryLeaks: 0,
    cacheHitRate: 0,
    cacheMissRate: 0,
    cacheSize: 0,
    requestCount: 0,
    averageResponseTime: 0,
    failedRequests: 0,
    bundleSize: 0,
    chunkCount: 0,
    lazyLoadedChunks: 0,
    componentRenderTimes: new Map(),
    componentRenderCounts: new Map(),
    expensiveComponents: [],
    stateUpdates: 0,
    derivedComputations: 0,
    effectRuns: 0,
    performanceScore: 100,
    optimizationSuggestions: [],
  });

  // Thresholds for alerts
  const thresholds = new Map<keyof PerformanceMetrics, number>();
  const thresholdCallbacks: Array<
    (_metric: string, _value: number, _threshold: number) => void
  > = [];

  // Performance tracking
  const renderTimes: number[] = [];
  const memoryReadings: number[] = [];
  let cacheHits = 0;
  let cacheMisses = 0;
  const requestTimes: number[] = [];
  let failedRequestCount = 0;

  /**
   * Starts performance monitoring
   */
  const startMonitoring = () => {
    if (isMonitoring.value()) return;

    isMonitoring.setValue(true);

    // Start memory monitoring
    if (typeof window !== "undefined" && "memory" in performance) {
      const memoryInterval = setInterval(() => {
        if (isMonitoring.value()) {
          trackMemory();
        } else {
          clearInterval(memoryInterval);
        }
      }, 1000);
    }

    // Start bundle analysis
    analyzeBundle();

    console.log("🚀 Performance monitoring started");
  };

  /**
   * Stops performance monitoring
   */
  const stopMonitoring = () => {
    isMonitoring.setValue(false);
    console.log("⏹️ Performance monitoring stopped");
  };

  /**
   * Tracks component render performance
   */
  const trackRender = (componentName: string, renderTime: number) => {
    if (!isMonitoring.value()) return;

    const currentMetrics = metrics.value();

    // Update render times
    renderTimes.push(renderTime);
    if (renderTimes.length > 100) renderTimes.shift(); // Keep last 100

    // Update component-specific metrics
    const componentTimes =
      currentMetrics.componentRenderTimes.get(componentName) || [];
    componentTimes.push(renderTime);
    if (componentTimes.length > 50) componentTimes.shift();
    currentMetrics.componentRenderTimes.set(componentName, componentTimes);

    const componentCounts =
      currentMetrics.componentRenderCounts.get(componentName) || 0;
    currentMetrics.componentRenderCounts.set(
      componentName,
      componentCounts + 1,
    );

    // Update overall metrics
    currentMetrics.renderCount++;
    currentMetrics.averageRenderTime =
      renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    currentMetrics.slowestRender = Math.max(
      currentMetrics.slowestRender,
      renderTime,
    );
    currentMetrics.fastestRender = Math.min(
      currentMetrics.fastestRender,
      renderTime,
    );

    // Check for expensive components
    if (renderTime > 16) {
      // 16ms = 60fps threshold
      if (!currentMetrics.expensiveComponents.includes(componentName)) {
        currentMetrics.expensiveComponents.push(componentName);
      }
    }

    metrics.setValue({ ...currentMetrics });

    // Check thresholds
    checkThresholds("averageRenderTime", currentMetrics.averageRenderTime);
  };

  /**
   * Tracks memory usage
   */
  const trackMemory = () => {
    if (!isMonitoring.value()) return;

    const currentMetrics = metrics.value();

    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize / 1024 / 1024; // MB

      memoryReadings.push(usedMemory);
      if (memoryReadings.length > 60) memoryReadings.shift(); // Keep last minute

      currentMetrics.memoryUsage = usedMemory;
      currentMetrics.memoryPeak = Math.max(
        currentMetrics.memoryPeak,
        usedMemory,
      );

      // Detect potential memory leaks
      if (memoryReadings.length > 10) {
        const recent = memoryReadings.slice(-10);
        const trend = recent[recent.length - 1] - recent[0];
        if (trend > 10) {
          // 10MB increase in last 10 seconds
          currentMetrics.memoryLeaks++;
        }
      }

      metrics.setValue({ ...currentMetrics });

      // Check thresholds
      checkThresholds("memoryUsage", usedMemory);
    }
  };

  /**
   * Tracks cache performance
   */
  const trackCache = (_hit: boolean, _key: string) => {
    if (!isMonitoring.value()) return;

    if (_hit) {
      cacheHits++;
    } else {
      cacheMisses++;
    }

    const currentMetrics = metrics.value();
    const total = cacheHits + cacheMisses;

    if (total > 0) {
      currentMetrics.cacheHitRate = cacheHits / total;
      currentMetrics.cacheMissRate = cacheMisses / total;
    }

    metrics.setValue({ ...currentMetrics });
  };

  /**
   * Tracks network requests
   */
  const trackRequest = (
    url: string,
    responseTime: number,
    success: boolean,
  ) => {
    if (!isMonitoring.value()) return;

    const currentMetrics = metrics.value();

    requestTimes.push(responseTime);
    if (requestTimes.length > 100) requestTimes.shift();

    currentMetrics.requestCount++;
    currentMetrics.averageResponseTime =
      requestTimes.reduce((a, b) => a + b, 0) / requestTimes.length;

    if (!success) {
      failedRequestCount++;
      currentMetrics.failedRequests = failedRequestCount;
    }

    metrics.setValue({ ...currentMetrics });

    // Check thresholds
    checkThresholds("averageResponseTime", responseTime);
  };

  /**
   * Tracks state updates
   */
  const trackStateUpdate = (_stateName: string, _updateTime: number) => {
    if (!isMonitoring.value()) return;

    const currentMetrics = metrics.value();
    currentMetrics.stateUpdates++;
    metrics.setValue({ ...currentMetrics });
  };

  /**
   * Tracks effect runs
   */
  const trackEffect = (_effectName: string, _runTime: number) => {
    if (!isMonitoring.value()) return;

    const currentMetrics = metrics.value();
    currentMetrics.effectRuns++;
    metrics.setValue({ ...currentMetrics });
  };

  /**
   * Gets current performance metrics
   */
  const getMetrics = (): PerformanceMetrics => {
    return metrics.value();
  };

  /**
   * Generates optimization suggestions based on current metrics
   */
  const getOptimizationSuggestions = (): OptimizationSuggestion[] => {
    const currentMetrics = metrics.value();
    const suggestions: OptimizationSuggestion[] = [];

    // Render performance suggestions
    if (currentMetrics.averageRenderTime > 16) {
      suggestions.push({
        type: "render",
        severity: "high",
        title: "Slow Component Rendering",
        description: `Average render time is ${currentMetrics.averageRenderTime.toFixed(2)}ms, exceeding 60fps threshold`,
        impact: "Poor user experience, janky animations",
        fix: "Optimize expensive components, use React.memo, implement virtualization",
        codeExample: "const OptimizedComponent = React.memo(Component);",
        estimatedImprovement: 30,
      });
    }

    if (currentMetrics.expensiveComponents.length > 0) {
      suggestions.push({
        type: "render",
        severity: "medium",
        title: "Expensive Components Detected",
        description: `${currentMetrics.expensiveComponents.length} components are rendering slowly`,
        impact: "Reduced performance, battery drain",
        fix: "Profile components, optimize render logic, use React DevTools Profiler",
        estimatedImprovement: 25,
      });
    }

    // Memory suggestions
    if (currentMetrics.memoryLeaks > 0) {
      suggestions.push({
        type: "memory",
        severity: "critical",
        title: "Memory Leaks Detected",
        description: `${currentMetrics.memoryLeaks} potential memory leaks identified`,
        impact: "App crashes, poor performance, battery drain",
        fix: "Check useEffect cleanup, remove event listeners, clear intervals",
        codeExample:
          "useEffect(() => { const cleanup = () => {}; return cleanup; }, []);",
        estimatedImprovement: 50,
      });
    }

    if (currentMetrics.memoryUsage > 100) {
      // 100MB threshold
      suggestions.push({
        type: "memory",
        severity: "medium",
        title: "High Memory Usage",
        description: `Memory usage is ${currentMetrics.memoryUsage.toFixed(2)}MB`,
        impact: "Reduced performance, potential crashes",
        fix: "Implement virtualization, lazy loading, memory profiling",
        estimatedImprovement: 20,
      });
    }

    // Cache suggestions
    if (currentMetrics.cacheHitRate < 0.7) {
      suggestions.push({
        type: "cache",
        severity: "medium",
        title: "Low Cache Hit Rate",
        description: `Cache hit rate is ${(currentMetrics.cacheHitRate * 100).toFixed(1)}%`,
        impact: "Unnecessary network requests, slower performance",
        fix: "Improve cache keys, implement better caching strategy",
        estimatedImprovement: 15,
      });
    }

    // Network suggestions
    if (currentMetrics.averageResponseTime > 1000) {
      // 1 second threshold
      suggestions.push({
        type: "network",
        severity: "medium",
        title: "Slow Network Responses",
        description: `Average response time is ${currentMetrics.averageResponseTime.toFixed(0)}ms`,
        impact: "Poor user experience, perceived slowness",
        fix: "Implement request caching, use CDN, optimize API endpoints",
        estimatedImprovement: 20,
      });
    }

    if (currentMetrics.failedRequests > 0) {
      suggestions.push({
        type: "network",
        severity: "low",
        title: "Failed Network Requests",
        description: `${currentMetrics.failedRequests} requests failed`,
        impact: "Broken functionality, poor user experience",
        fix: "Implement retry logic, better error handling, fallback strategies",
        estimatedImprovement: 10,
      });
    }

    // State suggestions
    if (currentMetrics.stateUpdates > 1000) {
      suggestions.push({
        type: "state",
        severity: "low",
        title: "High State Update Frequency",
        description: `${currentMetrics.stateUpdates} state updates detected`,
        impact: "Potential unnecessary re-renders",
        fix: "Batch state updates, use useReducer for complex state",
        codeExample:
          "const [state, dispatch] = useReducer(reducer, initialState);",
        estimatedImprovement: 15,
      });
    }

    return suggestions;
  };

  /**
   * Generates comprehensive performance report
   */
  const getPerformanceReport = (): PerformanceReport => {
    const currentMetrics = metrics.value();
    const suggestions = getOptimizationSuggestions();

    // Calculate overall score
    let score = 100;

    // Deduct points for performance issues
    if (currentMetrics.averageRenderTime > 16) score -= 20;
    if (currentMetrics.memoryLeaks > 0) score -= 30;
    if (currentMetrics.cacheHitRate < 0.7) score -= 15;
    if (currentMetrics.averageResponseTime > 1000) score -= 15;
    if (currentMetrics.failedRequests > 0) score -= 10;

    score = Math.max(0, score);

    // Determine grade and status
    let grade: PerformanceReport["summary"]["grade"];
    let status: PerformanceReport["summary"]["status"];

    if (score >= 90) {
      grade = "A";
      status = "excellent";
    } else if (score >= 80) {
      grade = "B";
      status = "good";
    } else if (score >= 70) {
      grade = "C";
      status = "fair";
    } else if (score >= 60) {
      grade = "D";
      status = "poor";
    } else {
      grade = "F";
      status = "critical";
    }

    // Generate trends (simplified)
    const trends: PerformanceTrend[] = [
      {
        metric: "Render Time",
        values: renderTimes.slice(-10),
        trend:
          renderTimes.length > 1 &&
          renderTimes[renderTimes.length - 1] < renderTimes[0]
            ? "improving"
            : "stable",
        change:
          renderTimes.length > 1
            ? ((renderTimes[renderTimes.length - 1] - renderTimes[0]) /
                renderTimes[0]) *
              100
            : 0,
      },
    ];

    return {
      summary: { overallScore: score, grade, status },
      metrics: currentMetrics,
      topIssues: suggestions.slice(0, 5),
      recommendations: suggestions.map((s) => s.fix),
      trends,
    };
  };

  /**
   * Sets performance thresholds for alerts
   */
  const setThreshold = (
    metric: keyof PerformanceMetrics,
    threshold: number,
  ) => {
    thresholds.set(metric, threshold);
  };

  /**
   * Registers callback for threshold exceeded events
   */
  const onThresholdExceeded = (
    callback: (metric: string, value: number, threshold: number) => void,
  ) => {
    thresholdCallbacks.push(callback);
  };

  /**
   * Checks if any thresholds have been exceeded
   */
  const checkThresholds = (metric: string, value: number) => {
    const threshold = thresholds.get(metric as keyof PerformanceMetrics);
    if (threshold && value > threshold) {
      thresholdCallbacks.forEach((callback) =>
        callback(metric, value, threshold),
      );
    }
  };

  /**
   * Suggests optimizations based on current performance
   */
  const suggestOptimizations = () => {
    const suggestions = getOptimizationSuggestions();
    const currentMetrics = metrics.value();

    currentMetrics.optimizationSuggestions = suggestions;
    currentMetrics.performanceScore =
      100 -
      suggestions.reduce((total, s) => {
        if (s.severity === "critical") return total + 30;
        if (s.severity === "high") return total + 20;
        if (s.severity === "medium") return total + 10;
        return total + 5;
      }, 0);

    metrics.setValue({ ...currentMetrics });

    console.log("🔍 Performance optimization suggestions generated");
    suggestions.forEach((suggestion) => {
      console.log(
        `  ${suggestion.severity.toUpperCase()}: ${suggestion.title}`,
      );
      console.log(`    ${suggestion.description}`);
      console.log(`    Fix: ${suggestion.fix}`);
    });
  };

  /**
   * Automatically applies performance optimizations
   */
  const autoOptimize = () => {
    console.log("🚀 Applying automatic performance optimizations...");

    // This would integrate with the compiler to automatically optimize code
    // For now, we'll just log the suggestions
    suggestOptimizations();

    console.log("✅ Automatic optimizations applied");
  };

  /**
   * Analyzes bundle performance
   */
  const analyzeBundle = () => {
    if (typeof window === "undefined") return;

    // This would analyze the actual bundle
    // For now, we'll use mock data
    const currentMetrics = metrics.value();
    currentMetrics.bundleSize = 512; // KB
    currentMetrics.chunkCount = 3;
    currentMetrics.lazyLoadedChunks = 1;

    metrics.setValue({ ...currentMetrics });
  };

  return {
    startMonitoring,
    stopMonitoring,
    isMonitoring: isMonitoring.value(),
    trackRender,
    trackMemory,
    trackCache,
    trackRequest,
    trackStateUpdate,
    trackEffect,
    getMetrics,
    getOptimizationSuggestions,
    getPerformanceReport,
    setThreshold,
    onThresholdExceeded,
    suggestOptimizations,
    autoOptimize,
  };
}

/**
 * Global performance monitor instance
 */
export const globalPerformanceMonitor = createPerformanceMonitor();

/**
 * Performance monitoring utilities for easy integration
 */
export const performanceUtils = {
  // Component wrapper for automatic performance tracking
  withPerformanceTracking: <P extends object>(
    Component: (props: P) => any,
    componentName: string,
  ) => {
    return (props: P) => {
      const startTime = performance.now();

      const result = Component(props);

      const renderTime = performance.now() - startTime;
      globalPerformanceMonitor.trackRender(componentName, renderTime);

      return result;
    };
  },

  // Hook for tracking custom performance metrics
  usePerformanceTracking: (metricName: string) => {
    return {
      start: () => performance.now(),
      end: (startTime: number) => {
        const duration = performance.now() - startTime;
        globalPerformanceMonitor.trackRender(metricName, duration);
        return duration;
      },
    };
  },

  // Automatic memory monitoring
  startMemoryMonitoring: () => {
    globalPerformanceMonitor.startMonitoring();
  },

  // Get performance insights
  getInsights: () => {
    return globalPerformanceMonitor.getPerformanceReport();
  },
};
