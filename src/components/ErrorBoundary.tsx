// src/ErrorBoundary.tsx
import { Component, ReactNode } from "react";
import { Result } from "antd";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // 다음 렌더링에서 폴백 UI가 표시되도록 상태를 업데이트합니다.
    return { hasError: true };
  }

  componentDidCatch() {
    // 에러 보고 서비스를 통해 에러를 기록할 수 있습니다.
    // message.error(``);
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스터마이징 할 수 있습니다.
      return (
        <div className="w-full h-[95vh] flex items-center justify-center ">
          <Result
            status="error"
            title={
              <span className=" text-neutral-600">
                Critical error occurred.
              </span>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
