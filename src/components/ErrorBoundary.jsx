import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div style={{ 
          padding: '20px', 
          margin: '20px auto',
          maxWidth: '600px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '10px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2>Something went wrong.</h2>
          <p>We're having trouble loading this content. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: '#6200ee',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
