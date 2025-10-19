import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

function Sidebar() {
  const {
    chart,
    user,
    setSelected,
    navigate,
    createNewChat,
    setUser,
    setToken,
    setChart,
    axios,
    token,
    fetchuserChart,
  } = useAppContext();


  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    alert("Logout Successfully");
    setUser(null);
    localStorage.removeItem("token");
    setToken(null);
  };

  const filter = chart.filter((item) => {
    const content = item.messages[0]?.content || "";
    const name = item.name || "";
    return (
      content.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const hamdleonDel = async (e, chatId) => {
    try {
      e.stopPropagation();
      const { data } = await axios.delete(`/api/v2/deleteChat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          chatId: chatId,
        },
      });
      if (data.success) {
        await fetchuserChart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-70 p-4 flex  flex-col  gap-4 shadow-md h-screen">
        <img src={assets.logo_full_dark} alt="" />

        <button
          onClick={createNewChat}
          className=" w-full bg-gradient-to-r from-[#A456F7] to-[#3D81F6]  p-1 flex items-center justify-center rounded-sm text-white"
        >
          <span className="mr-2 text-2xl">+</span> New Chart
        </button>

        <div className=" flex gap-3 items-center border border-[#99A1AF] px-4 py-2 rounded relative w-full">
          <img src={assets.search_icon} className="invert" alt="" />
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            value={search}
            className="w-full outline-none"
            placeholder="Search"
          />
        </div>

        <h1 className="text-[#2F2F2F]">Recents Charts </h1>

        <div className="flex-1 overflow-y-scroll text-sm space-y-3">
          {filter.length > 0 ? (
            filter.map((item, index) => (
              <div
                onClick={() => setSelected(item)}
                key={index}
                className="border cursor-pointer group flex justify-between items-start border-zinc-400 p-2 rounded"
              >
                <div>
                  <p>
                    {item.messages.length > 0
                      ? item.messages[0].content.slice(0, 32)
                      : item.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {moment(item.updatedAt).fromNow()}
                  </p>
                </div>
                <img
                  onClick={(e) => hamdleonDel(e, item._id)}
                  src={assets.bin_icon}
                  className="invert w-4 hidden group-hover:block cursor-pointer"
                  alt="bin"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No matching chats found</p>
          )}
        </div>

        <div
          onClick={() => navigate("/community")}
          className="border cursor-pointer group flex gap-2  items-center border-zinc-400 p-3 rounded"
        >
          <img src={assets.gallery_icon} className="invert w-5" alt="" />
          <p className="text-sm">Community Images</p>
        </div>
        <div
          onClick={() => navigate("/credits")}
          className="border cursor-pointer group flex gap-2  items-center border-zinc-400 px-3 py-1 rounded"
        >
          <img src={assets.diamond_icon} className="w-5" alt="" />
          <div>
            <p className="text-sm">{user?.credits}</p>
            <p className="text-[10px]">Purchase credits to use quickgpt</p>
          </div>
        </div>
        {/* LOgout */}
        <div className="border cursor-pointer group flex gap-2 justify-between  items-center border-zinc-400 px-3 py-1 rounded">
          <img src={assets.user_icon} className="w-8" alt="" />
          <p className="text-sm flex-1">{user?.name}</p>

          <img
            onClick={handleLogout}
            src={assets.logout_icon}
            className="w-5 invert hidden group-hover:block cursor-pointer"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
