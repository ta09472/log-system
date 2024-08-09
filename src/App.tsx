import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "antd/dist/reset.css";
import "./index.css";
import Dashboard from "./page/Dashboard";
import { ConfigProvider } from "antd";
import Results from "./page/Results";
import NotFound from "./page/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Setting from "./page/Setting";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#000000",
          },
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/setting" element={<Setting />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
