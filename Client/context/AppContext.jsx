import { createContext, use, useContext, useEffect, useState } from "react";
import { dummyChats, dummyUserData } from "../src/assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();
axios.defaults.baseURL = "http://localhost:5000";

function AppContext({ children }) {
  const [user, setUser] = useState(null);
  const [chart, setChart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // console.log("chartchart", selected);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/api/v1/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        console.log("Error fetching user");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) {
        navigate("/");
      }
      await axios.get("/api/v2/createChat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (token) {
      fetchuserChart();
    }
  }, [token]);

  const fetchuserChart = async () => {
    try {
      const { data } = await axios.get("/api/v2/getChat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setChart(data.chat);
        if (data.chat.length === 0) {
          // await createNewChat();
          return fetchuserChart();
        }
      } else {
        console.warn("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching charts:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const value = {
    fetchUser,
    user,
    setUser,
    chart,
    setChart,
    selected,
    setSelected,
    navigate,
    // New
    token,
    setToken,
    createNewChat,
    fetchuserChart,
    axios,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default AppContext;

export const useAppContext = () => useContext(UserContext);
