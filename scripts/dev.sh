#!/bin/bash

# React Meta Framework Development Script

echo "🚀 React Meta Framework Development Environment"
echo "=============================================="

# Function to show help
show_help() {
    echo "Available commands:"
    echo "  build     - Build the project"
    echo "  watch     - Watch mode for development"
    echo "  test      - Run tests"
    echo "  create    - Create a new project"
    echo "  demo      - Run the demo"
    echo "  clean     - Clean build artifacts"
    echo "  help      - Show this help"
}

# Function to build the project
build_project() {
    echo "🔨 Building project..."
    npm run build
    echo "✅ Build complete!"
}

# Function to watch for changes
watch_project() {
    echo "👀 Starting watch mode..."
    npm run dev
}

# Function to create a new project
create_project() {
    if [ -z "$1" ]; then
        echo "❌ Please provide a project name"
        echo "Usage: ./scripts/dev.sh create <project-name>"
        exit 1
    fi
    
    echo "🏗️  Creating new project: $1"
    node dist/cli.js create "$1"
}

# Function to run demo
run_demo() {
    echo "🎯 Running demo..."
    node -e "
import('./dist/index.js').then(({ createReactiveState, createStateMachine }) => {
    console.log('=== Reactive State Demo ===');
    
    const counter = createReactiveState(0);
    const doubled = counter.derive(value => value * 2);
    
    console.log('Initial values:');
    console.log('Counter:', counter.value());
    console.log('Doubled:', doubled.value());
    
    counter.subscribe(value => {
        console.log('Counter changed to:', value);
    });
    
    console.log('\\nUpdating counter...');
    counter.setValue(5);
    
    console.log('\\n=== Demo Complete ===');
});
"
}

# Function to clean build artifacts
clean_project() {
    echo "🧹 Cleaning build artifacts..."
    rm -rf dist/
    rm -rf test-project/
    echo "✅ Clean complete!"
}

# Main script logic
case "$1" in
    "build")
        build_project
        ;;
    "watch")
        watch_project
        ;;
    "create")
        create_project "$2"
        ;;
    "demo")
        run_demo
        ;;
    "clean")
        clean_project
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        show_help
        exit 1
        ;;
esac
