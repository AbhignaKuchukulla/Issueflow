import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
          <div className="card-header" style={{ background: 'var(--danger)', color: 'white' }}>
            ⚠️ Something went wrong
          </div>
          <div className="card-body">
            <p style={{ marginBottom: 16 }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details style={{ marginTop: 16 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, marginBottom: 8 }}>
                  Error Details
                </summary>
                <pre style={{ 
                  background: 'var(--card)', 
                  padding: 12, 
                  borderRadius: 8, 
                  fontSize: 12,
                  overflow: 'auto',
                  border: '1px solid var(--border)'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button 
              className="btn" 
              style={{ marginTop: 16 }}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
