import { createCompiler } from '../compiler/compiler.js';
import { createReactiveState } from '../state/reactive-state.js';

// AI Codegen System for React Meta Framework

export interface CodegenOptions {
  target: 'react' | 'react-ts' | 'react-meta';
  style: 'css' | 'tailwind' | 'styled-components';
  framework: 'react' | 'next' | 'remix';
  generateTests: boolean;
  generateDocs: boolean;
}

export interface DesignElement {
  type: 'component' | 'layout' | 'button' | 'input' | 'card' | 'modal' | 'navigation';
  name: string;
  props: Record<string, any>;
  children?: DesignElement[];
  styles: Record<string, any>;
  interactions?: Interaction[];
}

export interface Interaction {
  type: 'click' | 'hover' | 'focus' | 'submit';
  action: string;
  target?: string;
}

export interface APISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
  };
}

export interface GeneratedCode {
  components: string[];
  types: string[];
  hooks: string[];
  tests?: string[];
  docs?: string[];
}

export interface CodegenResult {
  success: boolean;
  code: GeneratedCode;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

/**
 * AI-Assisted Code Generation System
 * Generates React components from designs and APIs
 */
export function createAICodegen() {
  const compiler = createCompiler();
  
  // State for tracking generation progress
  const generationProgress = createReactiveState(0);
  const currentStep = createReactiveState('');
  const generatedFiles = createReactiveState<string[]>([]);

  /**
   * Generate React components from Figma-like design data
   */
  const generateFromDesign = async (
    designData: DesignElement[],
    options: CodegenOptions = {
      target: 'react-meta',
      style: 'tailwind',
      framework: 'react',
      generateTests: false,
      generateDocs: false
    }
  ): Promise<CodegenResult> => {
    const result: CodegenResult = {
      success: true,
      code: { components: [], types: [], hooks: [] },
      warnings: [],
      errors: [],
      suggestions: []
    };

    try {
      generationProgress.setValue(0);
      currentStep.setValue('Analyzing design elements...');

      // Analyze design structure
      const analysis = analyzeDesign(designData);
      
      generationProgress.setValue(20);
      currentStep.setValue('Generating component types...');

      // Generate TypeScript interfaces
      result.code.types = generateTypeDefinitions(analysis, options);
      
      generationProgress.setValue(40);
      currentStep.setValue('Generating React components...');

      // Generate React components
      result.code.components = generateReactComponents(analysis, options);
      
      generationProgress.setValue(60);
      currentStep.setValue('Generating custom hooks...');

      // Generate custom hooks for interactions
      result.code.hooks = generateCustomHooks(analysis, options);
      
      generationProgress.setValue(80);
      currentStep.setValue('Optimizing code...');

      // Apply compiler optimizations
      result.code.components = result.code.components.map(component => {
        const compiled = compiler.compile(component, {
          target: 'es2022',
          optimize: true,
          analyzeDependencies: true,
          generateSourceMaps: false,
          minify: false
        });
        return compiled.code;
      });

      if (options.generateTests) {
        generationProgress.setValue(90);
        currentStep.setValue('Generating tests...');
        result.code.tests = generateTests(result.code, options);
      }

      if (options.generateDocs) {
        currentStep.setValue('Generating documentation...');
        result.code.docs = generateDocumentation(result.code, analysis);
      }

      generationProgress.setValue(100);
      currentStep.setValue('Code generation complete!');

      // Update generated files list
      const files = [
        ...result.code.components.map((_, i) => `Component${i + 1}.tsx`),
        ...result.code.types.map((_, i) => `types${i + 1}.ts`),
        ...result.code.hooks.map((_, i) => `hooks${i + 1}.ts`)
      ];
      generatedFiles.setValue(files);

      result.suggestions = generateComponentSuggestions(analysis);

    } catch (error) {
      result.success = false;
      result.errors.push(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  };

  /**
   * Generate API client from OpenAPI specification
   */
  const generateFromAPI = async (
    apiSpec: APISpec,
    options: CodegenOptions = {
      target: 'react-meta',
      style: 'tailwind',
      framework: 'react',
      generateTests: false,
      generateDocs: false
    }
  ): Promise<CodegenResult> => {
    const result: CodegenResult = {
      success: true,
      code: { components: [], types: [], hooks: [] },
      warnings: [],
      errors: [],
      suggestions: []
    };

    try {
      generationProgress.setValue(0);
      currentStep.setValue('Parsing OpenAPI specification...');

      // Parse OpenAPI spec
      const parsedAPI = parseOpenAPISpec(apiSpec);
      
      generationProgress.setValue(25);
      currentStep.setValue('Generating TypeScript interfaces...');

      // Generate TypeScript interfaces
      result.code.types = generateAPITypes(parsedAPI, options);
      
      generationProgress.setValue(50);
      currentStep.setValue('Generating API client...');

      // Generate API client with React Meta Framework integration
      result.code.hooks = generateAPIClient(parsedAPI, options);
      
      generationProgress.setValue(75);
      currentStep.setValue('Generating example components...');

      // Generate example components that use the API
      result.code.components = generateAPIComponents(parsedAPI, options);

      generationProgress.setValue(100);
      currentStep.setValue('API code generation complete!');

      result.suggestions = generateAPISuggestions(parsedAPI);

    } catch (error) {
      result.success = false;
      result.errors.push(`API code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  };

  /**
   * Generate intelligent code suggestions and refactoring
   */
  const generateSuggestions = (
    code: string,
    context: 'component' | 'hook' | 'api' | 'performance'
  ): string[] => {
    const suggestions: string[] = [];
    
    // Analyze code with compiler
    const analysis = compiler.analyze(code);
    
    // Generate context-specific suggestions
    switch (context) {
      case 'component':
        suggestions.push(...generateComponentSuggestions(analysis));
        break;
      case 'hook':
        suggestions.push(...generateHookSuggestions(analysis));
        break;
      case 'api':
        suggestions.push(...generateAPISuggestions(analysis));
        break;
      case 'performance':
        suggestions.push(...generatePerformanceSuggestions(analysis));
        break;
    }
    
    return suggestions;
  };

  /**
   * Intelligent code refactoring
   */
  const refactorCode = (
    code: string,
    refactoring: 'extract-component' | 'extract-hook' | 'optimize-performance' | 'modernize-syntax'
  ): string => {
    switch (refactoring) {
      case 'extract-component':
        return extractComponent(code);
      case 'extract-hook':
        return extractHook(code);
      case 'optimize-performance':
        return optimizePerformance(code);
      case 'modernize-syntax':
        return modernizeSyntax(code);
      default:
        return code;
    }
  };

  // Helper functions for design analysis
  const analyzeDesign = (designData: DesignElement[]) => {
    const analysis = {
      components: designData.filter(el => el.type === 'component'),
      layouts: designData.filter(el => el.type === 'layout'),
      interactions: designData.flatMap(el => el.interactions || []),
      styles: designData.map(el => el.styles),
      complexity: calculateComplexity(designData)
    };
    return analysis;
  };

  const calculateComplexity = (elements: DesignElement[]): 'low' | 'medium' | 'high' => {
    const totalElements = elements.length;
    const totalInteractions = elements.flatMap(el => el.interactions || []).length;
    
    if (totalElements > 20 || totalInteractions > 10) return 'high';
    if (totalElements > 10 || totalInteractions > 5) return 'medium';
    return 'low';
  };

  // Helper functions for code generation
  const generateTypeDefinitions = (analysis: any, options: CodegenOptions): string[] => {
    const types: string[] = [];
    
    // Generate component prop types
    analysis.components.forEach((component: DesignElement) => {
      const typeDef = `export interface ${component.name}Props {
  ${Object.entries(component.props).map(([key, value]) => 
    `${key}: ${typeof value === 'string' ? 'string' : typeof value};`
  ).join('\n  ')}
}`;
      types.push(typeDef);
    });
    
    return types;
  };

  const generateReactComponents = (analysis: any, options: CodegenOptions): string[] => {
    const components: string[] = [];
    
    analysis.components.forEach((component: DesignElement) => {
      const componentCode = generateComponentCode(component, options);
      components.push(componentCode);
    });
    
    return components;
  };

  const generateComponentCode = (component: DesignElement, options: CodegenOptions): string => {
    const { name, props, children, styles } = component;
    
    const propsInterface = Object.keys(props).length > 0 
      ? `{ ${Object.keys(props).join(', ')} }: ${name}Props`
      : '{}';
    
    const styleCode = generateStyleCode(styles, options.style);
    
    return `import React from 'react';
import { createReactiveState } from 'react-meta-framework';
import type { ${name}Props } from './types';

export function ${name}(${propsInterface}) {
  ${generateStateCode(component)}
  
  return (
    <div className="${styleCode}">
      ${generateChildrenCode(children)}
    </div>
  );
}`;
  };

  const generateStyleCode = (styles: Record<string, any>, styleType: string): string => {
    if (styleType === 'tailwind') {
      return Object.entries(styles).map(([key, value]) => {
        // Convert CSS properties to Tailwind classes
        if (key === 'backgroundColor') return `bg-${value.replace('#', '')}`;
        if (key === 'color') return `text-${value.replace('#', '')}`;
        if (key === 'padding') return `p-${value}`;
        if (key === 'margin') return `m-${value}`;
        return '';
      }).filter(Boolean).join(' ');
    }
    
    return 'component-styles';
  };

  const generateStateCode = (component: DesignElement): string => {
    const interactions = component.interactions || [];
    const hasState = interactions.some(i => i.type === 'click' || i.type === 'submit');
    
    if (hasState) {
      return `const [isActive, setIsActive] = createReactiveState(false);
  const [data, setData] = createReactiveState(null);`;
    }
    
    return '';
  };

  const generateChildrenCode = (children?: DesignElement[]): string => {
    if (!children || children.length === 0) {
      return '{/* Component content */}';
    }
    
    return children.map(child => {
      if (child.type === 'button') {
        return `<button className="btn btn-primary">${child.name}</button>`;
      }
      if (child.type === 'input') {
        return `<input type="text" placeholder="${child.name}" />`;
      }
      return `<div>${child.name}</div>`;
    }).join('\n      ');
  };

  const generateCustomHooks = (analysis: any, options: CodegenOptions): string[] => {
    const hooks: string[] = [];
    
    // Generate hooks for interactions
    const interactions = analysis.interactions;
    if (interactions.length > 0) {
      const hookCode = `import { createReactiveState, createStateMachine } from 'react-meta-framework';

export function use${analysis.components[0]?.name || 'Component'}Interactions() {
  const [state, setState] = createReactiveState('idle');
  
  const handleClick = () => {
    setState('active');
  };
  
  const handleSubmit = (data: any) => {
    setState('loading');
    // API call logic here
    setState('success');
  };
  
  return {
    state,
    handleClick,
    handleSubmit
  };
}`;
      hooks.push(hookCode);
    }
    
    return hooks;
  };

  // Helper functions for API generation
  const parseOpenAPISpec = (apiSpec: APISpec) => {
    const endpoints: any[] = [];
    const schemas: any[] = [];
    
    // Parse paths
    Object.entries(apiSpec.paths).forEach(([path, methods]) => {
      Object.entries(methods as any).forEach(([method, details]: [string, any]) => {
        endpoints.push({
          path,
          method: method.toUpperCase(),
          operationId: details.operationId,
          parameters: details.parameters || [],
          responses: details.responses || {},
          requestBody: details.requestBody
        });
      });
    });
    
    // Parse schemas
    if (apiSpec.components?.schemas) {
      Object.entries(apiSpec.components.schemas).forEach(([name, schema]: [string, any]) => {
        schemas.push({ name, ...schema });
      });
    }
    
    return { endpoints, schemas, info: apiSpec.info };
  };

  const generateAPITypes = (parsedAPI: any, options: CodegenOptions): string[] => {
    const types: string[] = [];
    
    // Generate types from schemas
    parsedAPI.schemas.forEach((schema: any) => {
      const typeDef = `export interface ${schema.name} {
  ${Object.entries(schema.properties || {}).map(([key, value]: [string, any]) => 
    `${key}${schema.required?.includes(key) ? '' : '?'}: ${mapOpenAPITypeToTS(value.type)};`
  ).join('\n  ')}
}`;
      types.push(typeDef);
    });
    
    return types;
  };

  const mapOpenAPITypeToTS = (openAPIType: string): string => {
    const typeMap: Record<string, string> = {
      string: 'string',
      integer: 'number',
      number: 'number',
      boolean: 'boolean',
      array: 'any[]',
      object: 'Record<string, any>'
    };
    return typeMap[openAPIType] || 'any';
  };

  const generateAPIClient = (parsedAPI: any, options: CodegenOptions): string[] => {
    const hooks: string[] = [];
    
    // Generate hooks for each endpoint
    parsedAPI.endpoints.forEach((endpoint: any) => {
      const hookCode = `import { createReactiveState, createStateMachine } from 'react-meta-framework';

export function use${endpoint.operationId || 'API'}() {
  const [data, setData] = createReactiveState(null);
  const [loading, setLoading] = createReactiveState(false);
  const [error, setError] = createReactiveState(null);
  
  const ${endpoint.operationId || 'fetchData'} = async (params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('${endpoint.path}', {
        method: '${endpoint.method}',
        headers: {
          'Content-Type': 'application/json',
        },
        body: params ? JSON.stringify(params) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    data,
    loading,
    error,
    ${endpoint.operationId || 'fetchData'}
  };
}`;
      hooks.push(hookCode);
    });
    
    return hooks;
  };

  const generateAPIComponents = (parsedAPI: any, options: CodegenOptions): string[] => {
    const components: string[] = [];
    
    // Generate example components that use the API
    parsedAPI.endpoints.slice(0, 3).forEach((endpoint: any) => {
      const componentCode = `import React from 'react';
import { use${endpoint.operationId || 'API'} } from './hooks';

export function ${endpoint.operationId || 'API'}Example() {
  const { data, loading, error, ${endpoint.operationId || 'fetchData'} } = use${endpoint.operationId || 'API'}();
  
  React.useEffect(() => {
    ${endpoint.operationId || 'fetchData'}();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>${endpoint.operationId || 'API'} Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}`;
      components.push(componentCode);
    });
    
    return components;
  };

  // Helper functions for suggestions and refactoring
  const generateComponentSuggestions = (analysis: any): string[] => {
    const suggestions: string[] = [];
    
    if (analysis.components.length > 5) {
      suggestions.push('Consider breaking down large components into smaller, reusable ones');
    }
    
    if (analysis.interactions.length > 10) {
      suggestions.push('Consider using a state management solution for complex interactions');
    }
    
    return suggestions;
  };

  const generateHookSuggestions = (analysis: any): string[] => {
    return ['Consider extracting reusable logic into custom hooks'];
  };

  const generateAPISuggestions = (parsedAPI: any): string[] => {
    return ['Consider implementing caching for API responses', 'Add error boundaries for API calls'];
  };

  const generatePerformanceSuggestions = (analysis: any): string[] => {
    return ['Consider using React.memo for expensive components', 'Implement virtualization for large lists'];
  };

  const extractComponent = (code: string): string => {
    // Implementation for extracting components
    return code;
  };

  const extractHook = (code: string): string => {
    // Implementation for extracting hooks
    return code;
  };

  const optimizePerformance = (code: string): string => {
    // Use existing compiler for performance optimization
    const compiled = compiler.compile(code, {
      target: 'es2022',
      optimize: true,
      analyzeDependencies: true,
      generateSourceMaps: false,
      minify: false
    });
    return compiled.code;
  };

  const modernizeSyntax = (code: string): string => {
    // Implementation for modernizing syntax
    return code;
  };

  const generateTests = (code: GeneratedCode, options: CodegenOptions): string[] => {
    const tests: string[] = [];
    
    // Generate basic tests for components
    code.components.forEach((component, index) => {
      const testCode = `import { render, screen } from '@testing-library/react';
import { ${component.match(/export function (\w+)/)?.[1] || 'Component'} } from './Component${index + 1}';

describe('${component.match(/export function (\w+)/)?.[1] || 'Component'}', () => {
  it('renders without crashing', () => {
    render(<${component.match(/export function (\w+)/)?.[1] || 'Component'} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});`;
      tests.push(testCode);
    });
    
    return tests;
  };

  const generateDocumentation = (code: GeneratedCode, analysis: any): string[] => {
    const docs: string[] = [];
    
    // Generate component documentation
    const componentDocs = `# Generated Components

This documentation was automatically generated from design specifications.

## Components

${code.components.map((component, index) => {
  const componentName = component.match(/export function (\w+)/)?.[1] || `Component${index + 1}`;
  return `### ${componentName}

A React component generated from design specifications.

**Props:**
- \`props\`: Component properties

**Usage:**
\`\`\`tsx
import { ${componentName} } from './Component${index + 1}';

<${componentName} />
\`\`\`
`;
}).join('\n')}`;
    
    docs.push(componentDocs);
    
    return docs;
  };

  return {
    generateFromDesign,
    generateFromAPI,
    generateSuggestions,
    refactorCode,
    generationProgress: generationProgress.value,
    currentStep: currentStep.value,
    generatedFiles: generatedFiles.value
  };
}
