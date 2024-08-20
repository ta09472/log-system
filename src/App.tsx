import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import "antd/dist/reset.css";
import "./index.css";
import Dashboard from "./page/Dashboard";
import { ConfigProvider, message } from "antd";
import Results from "./page/Results";
import NotFound from "./page/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import AggregationResult from "./components/AggregationResult";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      message.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      message.error(error.message);
    },
  }),
});

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
            <Route path="/aggResults" element={<AggregationResult />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
