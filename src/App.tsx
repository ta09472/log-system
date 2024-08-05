import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "antd/dist/reset.css";
import "./index.css";
import Dashboard from "./page/Dashboard";
import About from "./page/Report";
import History from "./page/History";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report" element={<About />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  </QueryClientProvider>
);

export default App;
