import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import ChartBox from "../src/components/ChartBox";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import { useAppContext } from "../context/AppContext";

function App() {
  const { pathname } = useLocation();

  if (pathname === "/loading") return <Loading />;

  const { user } = useAppContext();

  return (
    <>
      {user ? (
        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path="/" element={<ChartBox />} />
            <Route path="/community" element={<Community />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
