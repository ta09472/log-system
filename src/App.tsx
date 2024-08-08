import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "antd/dist/reset.css";
import "./index.css";
import Dashboard from "./page/Dashboard";
import About from "./page/Results";
import History from "./page/History";
import { ConfigProvider } from "antd";
import Results from "./page/Results";

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="/report" element={<About />} />
          <Route path="/history" element={<History />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
