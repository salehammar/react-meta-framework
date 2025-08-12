import { describe, it, expect } from 'vitest';
import { createReactiveState, createDerivedState } from '../../src/state/reactive-state';

describe('Reactive State System', () => {
  it('should create reactive state with initial value', () => {
    const state = createReactiveState(42);
    expect(state.value()).toBe(42);
  });

  it('should update reactive state', () => {
    const state = createReactiveState(0);
    state.setValue(100);
    expect(state.value()).toBe(100);
  });

  it('should create derived state', () => {
    const baseState = createReactiveState(10);
    const derived = createDerivedState(
      (value) => value * 3,
      baseState
    );
    
    expect(derived.value()).toBe(30);
  });

  it('should have subscribe function', () => {
    const state = createReactiveState('test');
    expect(typeof state.subscribe).toBe('function');
  });

  it('should have derive function', () => {
    const state = createReactiveState('test');
    expect(typeof state.derive).toBe('function');
  });
});
