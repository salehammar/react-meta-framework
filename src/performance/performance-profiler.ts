import { createReactiveState } from '../state/reactive-state.js';

export interface PerformanceProfile {
  componentId: string;
  renderCount: number;
  renderTime: number;
  dependencies: string[];
  children: string[];
  parent: string | null;
  lastRender: number;
  averageRenderTime: number;
  reRenderProbability: number;
}

export interface RerenderCascade {
  trigger: string;
  affectedComponents: string[];
  estimatedImpact: 'low' | 'medium' | 'high';
  probability: number;
  suggestions: string[];
}

export interface PerformancePrediction {
  componentId: string;
  willReRender: boolean;
  confidence: number;
  reason: string;
  estimatedTime: number;
  cascadeRisk: 'low' | 'medium' | 'high';
}

/**
 * Real-time performance profiler that predicts re-render cascades
 * Uses machine learning-like patterns to identify performance issues
 */
export function createPerformanceProfiler() {
  // Performance data storage
  const componentProfiles = new Map<string, PerformanceProfile>();
  const renderHistory = new Map<string, number[]>();
  const dependencyGraph = new Map<string, Set<string>>();
  
  // Reactive state for real-time updates
  const isProfiling = createReactiveState(false);
  const currentProfile = createReactiveState<PerformanceProfile | null>(null);
  const predictions = createReactiveState<PerformancePrediction[]>([]);
  const cascades = createReactiveState<RerenderCascade[]>([]);

  /**
   * Start profiling a component
   */
  const startProfiling = (componentId: string, dependencies: string[] = []) => {
    if (!componentProfiles.has(componentId)) {
      componentProfiles.set(componentId, {
        componentId,
        renderCount: 0,
        renderTime: 0,
        dependencies,
        children: [],
        parent: null,
        lastRender: Date.now(),
        averageRenderTime: 0,
        reRenderProbability: 0
      });
    }
    
    const profile = componentProfiles.get(componentId)!;
    profile.lastRender = Date.now();
    
    // Update dependency graph
    dependencies.forEach(dep => {
      if (!dependencyGraph.has(dep)) {
        dependencyGraph.set(dep, new Set());
      }
      dependencyGraph.get(dep)!.add(componentId);
    });
    
    currentProfile.setValue(profile);
  };

  /**
   * End profiling and record render metrics
   */
  const endProfiling = (componentId: string, renderTime: number) => {
    const profile = componentProfiles.get(componentId);
    if (!profile) return;

    // Update render metrics
    profile.renderCount++;
    profile.renderTime = renderTime;
    
    // Calculate average render time
    if (!renderHistory.has(componentId)) {
      renderHistory.set(componentId, []);
    }
    const history = renderHistory.get(componentId)!;
    history.push(renderTime);
    
    // Keep only last 10 renders for average calculation
    if (history.length > 10) {
      history.shift();
    }
    
    profile.averageRenderTime = history.reduce((a, b) => a + b, 0) / history.length;
    
    // Update re-render probability
    profile.reRenderProbability = calculateReRenderProbability(profile);
    
    // Check for potential cascades
    const cascade = detectRerenderCascade(componentId);
    if (cascade) {
      const currentCascades = cascades.value();
      cascades.setValue([...currentCascades, cascade]);
    }
    
    // Generate predictions
    const newPredictions = generatePredictions();
    predictions.setValue(newPredictions);
  };

  /**
   * Calculate the probability of a component re-rendering
   */
  const calculateReRenderProbability = (profile: PerformanceProfile): number => {
    let probability = 0;
    
    // Factor 1: Dependency count (more dependencies = higher probability)
    probability += Math.min(profile.dependencies.length * 0.1, 0.3);
    
    // Factor 2: Render frequency (frequent renders = higher probability)
    const timeSinceLastRender = Date.now() - profile.lastRender;
    if (timeSinceLastRender < 1000) probability += 0.2;
    else if (timeSinceLastRender < 5000) probability += 0.1;
    
    // Factor 3: Render time (slow renders = higher probability of cascades)
    if (profile.averageRenderTime > 16) probability += 0.2;
    else if (profile.averageRenderTime > 8) probability += 0.1;
    
    // Factor 4: Parent-child relationships
    if (profile.children.length > 0) probability += 0.1;
    
    return Math.min(probability, 1.0);
  };

  /**
   * Detect potential re-render cascades
   */
  const detectRerenderCascade = (triggerComponentId: string): RerenderCascade | null => {
    const profile = componentProfiles.get(triggerComponentId);
    if (!profile) return null;

    // Find components that depend on this component
    const affectedComponents: string[] = [];
    dependencyGraph.forEach((dependents, dependency) => {
      if (dependency === triggerComponentId) {
        dependents.forEach(dependent => {
          if (dependent !== triggerComponentId) {
            affectedComponents.push(dependent);
          }
        });
      }
    });

    if (affectedComponents.length === 0) return null;

    // Calculate cascade impact
    const estimatedImpact = calculateCascadeImpact(affectedComponents);
    const probability = calculateCascadeProbability(profile, affectedComponents);
    
    // Generate suggestions
    const suggestions = generateCascadeSuggestions(profile, affectedComponents);

    return {
      trigger: triggerComponentId,
      affectedComponents,
      estimatedImpact,
      probability,
      suggestions
    };
  };

  /**
   * Calculate the impact of a potential cascade
   */
  const calculateCascadeImpact = (affectedComponents: string[]): 'low' | 'medium' | 'high' => {
    let totalImpact = 0;
    
    affectedComponents.forEach(componentId => {
      const profile = componentProfiles.get(componentId);
      if (profile) {
        // Factor in render time and frequency
        totalImpact += profile.averageRenderTime * 0.1;
        totalImpact += profile.renderCount * 0.01;
      }
    });
    
    if (totalImpact < 5) return 'low';
    if (totalImpact < 15) return 'medium';
    return 'high';
  };

  /**
   * Calculate the probability of a cascade occurring
   */
  const calculateCascadeProbability = (trigger: PerformanceProfile, affected: string[]): number => {
    let probability = trigger.reRenderProbability;
    
    // Factor in affected components' characteristics
    affected.forEach(componentId => {
      const profile = componentProfiles.get(componentId);
      if (profile) {
        // Higher probability if affected components are already prone to re-renders
        probability += profile.reRenderProbability * 0.3;
      }
    });
    
    return Math.min(probability, 1.0);
  };

  /**
   * Generate suggestions to prevent cascades
   */
  const generateCascadeSuggestions = (trigger: PerformanceProfile, affected: string[]): string[] => {
    const suggestions: string[] = [];
    
    if (trigger.dependencies.length > 3) {
      suggestions.push('Consider grouping related dependencies to reduce re-render triggers');
    }
    
    if (trigger.averageRenderTime > 16) {
      suggestions.push('Optimize render performance to reduce cascade impact');
    }
    
    if (affected.length > 5) {
      suggestions.push('Consider using React.memo or useMemo to prevent unnecessary re-renders');
    }
    
    suggestions.push('Review dependency relationships to minimize cascade effects');
    suggestions.push('Consider implementing shouldComponentUpdate or React.memo for affected components');
    
    return suggestions;
  };

  /**
   * Generate performance predictions for all components
   */
  const generatePredictions = (): PerformancePrediction[] => {
    const predictions: PerformancePrediction[] = [];
    
    componentProfiles.forEach((profile, componentId) => {
      const willReRender = profile.reRenderProbability > 0.5;
      const confidence = Math.abs(profile.reRenderProbability - 0.5) * 2; // 0 to 1
      
      let reason = 'Normal render cycle';
      if (profile.dependencies.length > 3) reason = 'Many dependencies';
      if (profile.averageRenderTime > 16) reason = 'Slow render time';
      if (profile.children.length > 0) reason = 'Parent component changes';
      
      const estimatedTime = profile.averageRenderTime;
      const cascadeRisk = profile.reRenderProbability > 0.7 ? 'high' : 
                          profile.reRenderProbability > 0.4 ? 'medium' : 'low';
      
      predictions.push({
        componentId,
        willReRender,
        confidence,
        reason,
        estimatedTime,
        cascadeRisk
      });
    });
    
    return predictions.sort((a, b) => b.confidence - a.confidence);
  };

  /**
   * Predict re-render cascades before they happen
   */
  const predictRerenderCascade = (componentTree: any[]): RerenderCascade[] => {
    const potentialCascades: RerenderCascade[] = [];
    
    // Analyze component tree for potential cascade patterns
    componentTree.forEach(component => {
      const profile = componentProfiles.get(component.id);
      if (profile && profile.reRenderProbability > 0.6) {
        const cascade = detectRerenderCascade(component.id);
        if (cascade && cascade.probability > 0.5) {
          potentialCascades.push(cascade);
        }
      }
    });
    
    return potentialCascades;
  };

  /**
   * Get performance insights and recommendations
   */
  const getPerformanceInsights = () => {
    const insights = {
      totalComponents: componentProfiles.size,
      highRiskComponents: Array.from(componentProfiles.values())
        .filter(p => p.reRenderProbability > 0.7).length,
      averageRenderTime: Array.from(componentProfiles.values())
        .reduce((sum, p) => sum + p.averageRenderTime, 0) / componentProfiles.size,
      potentialCascades: cascades.value().length,
      recommendations: generateRecommendations()
    };
    
    return insights;
  };

  /**
   * Generate performance recommendations
   */
  const generateRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    // Analyze component profiles for patterns
    const slowComponents = Array.from(componentProfiles.values())
      .filter(p => p.averageRenderTime > 16);
    
    const frequentRenderers = Array.from(componentProfiles.values())
      .filter(p => p.renderCount > 10);
    
    const highDependencyComponents = Array.from(componentProfiles.values())
      .filter(p => p.dependencies.length > 5);
    
    if (slowComponents.length > 0) {
      recommendations.push(`Optimize ${slowComponents.length} slow components (render time > 16ms)`);
    }
    
    if (frequentRenderers.length > 0) {
      recommendations.push(`Review ${frequentRenderers.length} frequently rendering components`);
    }
    
    if (highDependencyComponents.length > 0) {
      recommendations.push(`Simplify dependencies for ${highDependencyComponents.length} components`);
    }
    
    if (cascades.value().length > 0) {
      recommendations.push('Implement React.memo to prevent re-render cascades');
    }
    
    recommendations.push('Consider using React DevTools Profiler for detailed analysis');
    recommendations.push('Review component dependency relationships');
    
    return recommendations;
  };

  /**
   * Start/stop profiling
   */
  const toggleProfiling = () => {
    isProfiling.setValue(!isProfiling.value());
  };

  /**
   * Clear all profiling data
   */
  const clearProfilingData = () => {
    componentProfiles.clear();
    renderHistory.clear();
    dependencyGraph.clear();
    currentProfile.setValue(null);
    predictions.setValue([]);
    cascades.setValue([]);
  };

  return {
    // Core profiling functions
    startProfiling,
    endProfiling,
    toggleProfiling,
    clearProfilingData,
    
    // Prediction and analysis
    predictRerenderCascade,
    getPerformanceInsights,
    
    // Reactive state
    isProfiling: isProfiling.value,
    currentProfile: currentProfile.value,
    predictions: predictions.value,
    cascades: cascades.value,
    
    // Data access
    getComponentProfile: (id: string) => componentProfiles.get(id),
    getAllProfiles: () => Array.from(componentProfiles.values()),
    getDependencyGraph: () => dependencyGraph
  };
}
