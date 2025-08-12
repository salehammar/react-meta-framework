import { describe, it, expect } from 'vitest';
import { createStateMachine, createToggleMachine, createLoadingMachine } from '../../src/state/state-machine';

describe('State Machine System', () => {
  it('should create basic state machine config', () => {
    const machine = createStateMachine({
      initial: 'idle',
      states: {
        idle: {
          on: { START: 'loading' }
        },
        loading: {
          on: { SUCCESS: 'success', ERROR: 'error' }
        },
        success: {
          on: { RESET: 'idle' }
        },
        error: {
          on: { RETRY: 'loading', RESET: 'idle' }
        }
      }
    });

    expect(machine).toBeDefined();
    expect(typeof machine).toBe('object');
  });

  it('should create toggle machine config', () => {
    const toggle = createToggleMachine();
    
    expect(toggle).toBeDefined();
    expect(typeof toggle).toBe('object');
  });

  it('should create loading machine config', () => {
    const loading = createLoadingMachine();
    
    expect(loading).toBeDefined();
    expect(typeof loading).toBe('object');
  });

  it('should handle state machine configuration', () => {
    const machine = createStateMachine({
      initial: 'A',
      states: {
        A: { on: { NEXT: 'B' } },
        B: { on: { NEXT: 'C' } },
        C: { on: { RESET: 'A' } }
      }
    });

    expect(machine).toBeDefined();
    expect(typeof machine).toBe('object');
  });
});
