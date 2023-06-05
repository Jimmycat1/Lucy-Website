import React, {Component} from 'react';
import reportError from '../utils/reportError';

class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
     static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
       return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      reportError(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (<>
            <div className='errorBoundary'>
                <h1 className='heading-big'>Oops, an error occurred...</h1>
                <h2 className='heading-sub'>It would be great if you could report this! ( A brief message will do)</h2>
                <a className='button-regular' href='/'>
                  Back to home page
                </a>
                <a className='button-regular' href='/contact'>
                  Report Error
                </a>
            </div>
        </>)
      } else {
        return this.props.children; 
      }
    }
  }

  export default ErrorBoundary;