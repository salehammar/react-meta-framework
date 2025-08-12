import React from 'react';
import { createReactiveState, createStateMachine } from 'react-meta-framework';

// Example of reactive state
const counter = createReactiveState(0);
const loadingMachine = createStateMachine('idle', {}, [
  { from: 'idle', to: 'loading', event: 'start' },
  { from: 'loading', to: 'success', event: 'complete' }
]);

function App() {
  const handleIncrement = () => {
    counter.setValue(prev => prev + 1);
  };

  const handleStartLoading = () => {
    loadingMachine.send('start');
    setTimeout(() => loadingMachine.send('complete'), 2000);
  };

  return (
    <div className="App">
      <h1>React Meta Framework Demo</h1>
      
      <div className="counter-section">
        <h2>Counter: {counter.value()}</h2>
        <button onClick={handleIncrement}>Increment</button>
      </div>
      
      <div className="state-machine-section">
        <h2>State Machine: {loadingMachine.currentState}</h2>
        <button 
          onClick={handleStartLoading}
          disabled={loadingMachine.currentState === 'loading'}
        >
          {loadingMachine.currentState === 'loading' ? 'Loading...' : 'Start Loading'}
        </button>
      </div>
    </div>
  );
}

export default App;