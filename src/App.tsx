import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Button } from "antd";
import "antd/dist/reset.css";
import "./index.css";

const queryClient = new QueryClient();

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <div className="p-4">
        <Button type="primary">Ant Design Button</Button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  </QueryClientProvider>
);

export default App;
