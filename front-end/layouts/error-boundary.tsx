import { useDisconnect } from "@thirdweb-dev/react";
import React from "react";

class ErrorBoundaryClass extends React.Component<
  {
    children: React.ReactNode;
    disconnect: () => Promise<void>;
  },
  {
    hasError: boolean;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    this.props.disconnect();
    console.error(`[ErrorBoundary]`, { error, errorInfo });
  }
  render() {
    return this.props.children;
  }
}

const ErrorBoundary = (props: any) => {
  const disconnect = useDisconnect();
  return <ErrorBoundaryClass disconnect={disconnect} {...props} />;
};

export default ErrorBoundary;
