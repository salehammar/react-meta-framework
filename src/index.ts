// Core state management
export {
  createReactiveState,
  createComputed,
  createReactiveEffect,
  createSelector,
  createMemoizedSelector,
  createDerivedState,
  batch,
} from "./state/reactive-state.js";
export {
  createStateMachine,
  createToggleMachine,
  createLoadingMachine,
} from "./state/state-machine.js";

// Routing
export {
  createRouter,
  createRouteConfig,
  generateRoutes,
} from "./routing/router.js";
export type { Route, RouteConfig } from "./routing/router.js";

// Data fetching
export {
  createDataFetcher,
  createQueryClient,
  useQuery,
  invalidateTag,
  getCacheStats,
} from "./data/data-fetcher.js";
export type { FetchResult, CacheStats } from "./data/data-fetcher.js";

// DevTools
export {
  createDevTools,
  createDevToolsPanel,
  performanceMonitor,
  initializeDevTools,
} from "./devtools/devtools.js";
export type {
  DevTools,
  DevToolsPanel,
  StateSnapshot,
  ReactiveStateInfo,
  DerivedStateInfo,
  DependencyGraph,
  PerformanceMetrics,
  RouteInfo,
  RouteTreeNode,
} from "./devtools/devtools.js";

// Performance monitoring
export {
  createPerformanceMonitor,
  globalPerformanceMonitor,
  performanceUtils,
} from "./performance/performance-monitor.js";
export type {
  PerformanceMonitor,
  PerformanceMetrics as PerformanceMetricsType,
  OptimizationSuggestion,
  PerformanceReport,
} from "./performance/performance-monitor.js";

// Compiler
export { createCompiler } from "./compiler/compiler.js";
export type {
  Compiler,
  CompileOptions,
  CompilationResult,
  AnalysisResult,
  ComponentInfo,
  HookInfo,
  DependencyInfo,
  EffectInfo,
  MemoizationInfo,
  RenderOptimization,
  PerformanceIssue,
  Optimization,
} from "./compiler/compiler.js";

// Advanced Compiler
export { createAdvancedCompiler } from "./compiler/advanced-compiler.js";
export type {
  CodeTransform,
  BundlePhysics,
  AdvancedCompilationResult,
} from "./compiler/advanced-compiler.js";

// AI Codegen
export { createAICodegen } from "./ai/codegen.js";
export type {
  CodegenOptions,
  DesignElement,
  Interaction,
  APISpec,
  GeneratedCode,
  CodegenResult,
} from "./ai/codegen.js";

// Enhanced AI Features
export {
  createStateMachineFromPrompt,
  generateMultipleStateMachines,
  validateStateMachine,
} from "./ai/state-machine-generator.js";
export type {
  StateMachinePrompt,
  GeneratedStateMachine,
} from "./ai/state-machine-generator.js";

export { createPerformanceProfiler } from "./performance/performance-profiler.js";
export type {
  PerformanceProfile,
  RerenderCascade,
  PerformancePrediction,
} from "./performance/performance-profiler.js";

export { createOptimizationPatches } from "./ai/optimization-patches.js";
export type {
  OptimizationPatch,
  PatchSuggestion,
} from "./ai/optimization-patches.js";

// CLI utilities
export { createProject } from "./cli/project-creator.js";
export { generateTemplate, listTemplates } from "./cli/template-generator.js";

// Cross-Stack Features
export {
  createReactiveBackendBinding,
  useSharedState,
  batchBackendOperations,
  createCRDTBackendBinding,
} from "./cross-stack/reactive-backend.js";
export type {
  BackendConfig,
  SharedState,
  ReactiveBackendBinding,
} from "./cross-stack/reactive-backend.js";
