// Import for type checking - used in generated code strings
import { createStateMachine as _createStateMachine } from "../state/state-machine.js";

export interface StateMachinePrompt {
  description: string;
  context?: string;
  complexity?: "simple" | "medium" | "complex";
}

export interface GeneratedStateMachine {
  name: string;
  states: string[];
  events: string[];
  transitions: Array<{
    from: string;
    to: string;
    event: string;
    guard?: string;
    action?: string;
  }>;
  code: string;
  suggestions: string[];
}

/**
 * Generates state machines from natural language descriptions
 * Uses AI-like pattern matching to understand common state machine patterns
 */
export function createStateMachineFromPrompt(
  prompt: string | StateMachinePrompt,
): GeneratedStateMachine {
  const description = typeof prompt === "string" ? prompt : prompt.description;
  const context = typeof prompt === "string" ? undefined : prompt.context;
  const complexity =
    typeof prompt === "string" ? "medium" : prompt.complexity || "medium";

  // Parse the description to extract key information
  const parsed = parseNaturalLanguage(description);

  // Generate state machine based on parsed information
  const stateMachine = generateStateMachine(parsed, complexity);

  // Generate code
  const code = generateStateMachineCode(stateMachine);

  return {
    name: stateMachine.name,
    states: stateMachine.states,
    events: stateMachine.events,
    transitions: stateMachine.transitions,
    code,
    suggestions: generateSuggestions(stateMachine, context),
  };
}

/**
 * Parses natural language to extract state machine requirements
 */
function parseNaturalLanguage(description: string) {
  const lowerDesc = description.toLowerCase();

  // Extract states from common patterns
  const states = extractStates(lowerDesc);

  // Extract events from common patterns
  const events = extractEvents(lowerDesc);

  // Extract context and relationships
  const context = extractContext(lowerDesc);

  return {
    states,
    events,
    context,
    originalDescription: description,
  };
}

/**
 * Extracts states from natural language
 */
function extractStates(description: string): string[] {
  const states: string[] = [];

  // Common state patterns
  const statePatterns = [
    /(?:should handle|handles?|supports?|manages?)\s+([^,]+?)(?:\s+states?)?/gi,
    /(?:states?|modes?|phases?)\s+(?:like|such as|including)\s+([^,]+)/gi,
    /(?:idle|loading|success|error|pending|active|inactive|enabled|disabled)/gi,
  ];

  statePatterns.forEach((pattern) => {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const state = match
          .replace(
            /(?:should handle|handles?|supports?|manages?|states?|modes?|phases?|like|such as|including)/gi,
            "",
          )
          .trim();
        if (state && !states.includes(state)) {
          states.push(state);
        }
      });
    }
  });

  // Add common states if none found
  if (states.length === 0) {
    states.push("idle", "loading", "success", "error");
  }

  return states;
}

/**
 * Extracts events from natural language
 */
function extractEvents(description: string): string[] {
  const events: string[] = [];

  // Common event patterns
  const eventPatterns = [
    /(?:on|when|triggered by|responds to)\s+([^,]+)/gi,
    /(?:click|submit|change|focus|blur|load|unload|error|success)/gi,
    /(?:start|stop|pause|resume|reset|complete|fail)/gi,
  ];

  eventPatterns.forEach((pattern) => {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const event = match
          .replace(/(?:on|when|triggered by|responds to)/gi, "")
          .trim();
        if (event && !events.includes(event)) {
          events.push(event);
        }
      });
    }
  });

  // Add common events if none found
  if (events.length === 0) {
    events.push("start", "complete", "error", "reset");
  }

  return events;
}

/**
 * Extracts context from natural language
 */
function extractContext(description: string) {
  const context: Record<string, any> = {};

  // Extract user types
  if (description.includes("guest") || description.includes("logged-in user")) {
    context.userTypes = ["guest", "logged-in user"];
  }

  // Extract failure scenarios
  if (description.includes("failure") || description.includes("error")) {
    context.hasFailureHandling = true;
  }

  // Extract async operations
  if (description.includes("loading") || description.includes("pending")) {
    context.hasAsyncOperations = true;
  }

  return context;
}

/**
 * Generates state machine structure based on parsed information
 */
function generateStateMachine(parsed: any, complexity: string) {
  const { states, events, context } = parsed;

  // Generate name based on context
  const name = generateStateMachineName(parsed.originalDescription);

  // Generate transitions based on complexity and context
  const transitions = generateTransitions(states, events, context, complexity);

  return {
    name,
    states,
    events,
    transitions,
  };
}

/**
 * Generates a meaningful name for the state machine
 */
function generateStateMachineName(description: string): string {
  // Extract key words for naming
  const words = description
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        !["should", "handle", "states", "like", "such", "including"].includes(
          word.toLowerCase(),
        ),
    );

  if (words.length > 0) {
    const keyWord = words[0].replace(/[^a-zA-Z]/g, "");
    return `${keyWord.charAt(0).toUpperCase() + keyWord.slice(1)}StateMachine`;
  }

  return "StateMachine";
}

/**
 * Generates transitions between states
 */
function generateTransitions(
  states: string[],
  events: string[],
  context: any,
  complexity: string,
) {
  const transitions: Array<{
    from: string;
    to: string;
    event: string;
    guard?: string;
    action?: string;
  }> = [];

  // Generate basic transitions
  if (complexity === "simple") {
    // Simple linear flow
    for (let i = 0; i < states.length - 1; i++) {
      transitions.push({
        from: states[i],
        to: states[i + 1],
        event: events[i] || `next`,
      });
    }
  } else if (complexity === "medium") {
    // Medium complexity with some branching
    states.forEach((state, _index) => {
      if (state === "idle") {
        transitions.push({ from: state, to: "loading", event: "start" });
      } else if (state === "loading") {
        transitions.push({ from: state, to: "success", event: "complete" });
        transitions.push({ from: state, to: "error", event: "error" });
      } else if (state === "success" || state === "error") {
        transitions.push({ from: state, to: "idle", event: "reset" });
      }
    });
  } else {
    // Complex with full connectivity
    states.forEach((fromState) => {
      states.forEach((toState) => {
        if (fromState !== toState) {
          const event = generateEventName(fromState, toState);
          transitions.push({ from: fromState, to: toState, event });
        }
      });
    });
  }

  // Add context-specific transitions
  if (context.userTypes) {
    transitions.push({
      from: "idle",
      to: "guest",
      event: "guestMode",
      guard: 'userType === "guest"',
    });
    transitions.push({
      from: "idle",
      to: "authenticated",
      event: "login",
      guard: 'userType === "logged-in user"',
    });
  }

  return transitions;
}

/**
 * Generates event names for transitions
 */
function generateEventName(fromState: string, toState: string): string {
  const from = fromState.toLowerCase();
  const to = toState.toLowerCase();

  if (from === "idle" && to === "loading") return "start";
  if (from === "loading" && to === "success") return "complete";
  if (from === "loading" && to === "error") return "error";
  if (from === "success" && to === "idle") return "reset";
  if (from === "error" && to === "idle") return "reset";

  return `to${to.charAt(0).toUpperCase() + to.slice(1)}`;
}

/**
 * Generates TypeScript code for the state machine
 */
function generateStateMachineCode(stateMachine: any): string {
  const { name, states, transitions } = stateMachine;

  const statesType = states.map((s: string) => `'${s}'`).join(" | ");
  const eventsType = transitions
    .map((t: any) => `'${t.event}'`)
    .filter((e: string, i: number, arr: string[]) => arr.indexOf(e) === i)
    .map((e: string) => `'${e}'`)
    .join(" | ");

  const transitionsCode = transitions
    .map((t: any) => {
      let code = `  { from: '${t.from}', to: '${t.to}', event: '${t.event}'`;
      if (t.guard) code += `, guard: (context) => ${t.guard}`;
      if (t.action) code += `, action: (context) => ${t.action}`;
      code += " }";
      return code;
    })
    .join(",\n");

  return `import { createStateMachine } from 'react-meta-framework';

// Generated state machine: ${name}
export const ${name} = createStateMachine<'${statesType}', '${eventsType}', any>(
  'idle', // Initial state
  {}, // Initial context
  [
${transitionsCode}
  ],
  (from, to, context) => {
    console.log(\`State transition: \${from} -> \${to}\`);
  }
);

// Usage example:
// ${name}.send('start');
// console.log('Current state:', ${name}.currentState);
`;
}

/**
 * Generates suggestions for improving the state machine
 */
function generateSuggestions(stateMachine: any, context?: string): string[] {
  const suggestions: string[] = [];

  if (stateMachine.states.length < 3) {
    suggestions.push("Consider adding more states for better state management");
  }

  if (stateMachine.transitions.length < stateMachine.states.length) {
    suggestions.push("Some states may not have clear transition paths");
  }

  if (context?.includes("user")) {
    suggestions.push("Consider adding user authentication states");
  }

  if (context?.includes("async")) {
    suggestions.push(
      "Consider adding loading and error states for async operations",
    );
  }

  suggestions.push("Add guards to prevent invalid state transitions");
  suggestions.push(
    "Consider adding actions for side effects during transitions",
  );

  return suggestions;
}

/**
 * Batch generate multiple state machines from descriptions
 */
export function generateMultipleStateMachines(
  descriptions: string[],
): GeneratedStateMachine[] {
  return descriptions.map((desc) => createStateMachineFromPrompt(desc));
}

/**
 * Validate generated state machine
 */
export function validateStateMachine(stateMachine: GeneratedStateMachine): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for orphaned states
  const reachableStates = new Set(["idle"]);
  stateMachine.transitions.forEach((t) => {
    reachableStates.add(t.to);
  });

  stateMachine.states.forEach((state) => {
    if (!reachableStates.has(state)) {
      warnings.push(`State '${state}' may not be reachable`);
    }
  });

  // Check for missing initial state
  if (!stateMachine.states.includes("idle")) {
    errors.push("Missing initial state (idle)");
  }

  // Check for unreachable states
  const hasIncomingTransitions = new Set();
  stateMachine.transitions.forEach((t) => {
    hasIncomingTransitions.add(t.to);
  });

  stateMachine.states.forEach((state) => {
    if (!hasIncomingTransitions.has(state) && state !== "idle") {
      errors.push(`State '${state}' has no incoming transitions`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
