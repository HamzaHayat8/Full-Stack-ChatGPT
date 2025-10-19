import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../assets/assets";
import Messages from "./Messages";

function ChartBox() {
  const { selected, user, axios, token, fetchuserChart } = useAppContext();
  const [msg, setMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [published, setPublished] = useState(false);

  const ref = useRef();

  useEffect(() => {
    if (selected) {
      setMsg(selected.messages || []);
    }
  }, [selected]);

  useEffect(() => {
    if (selected) {
      fetchuserChart(selected._id);
    }
  }, [selected]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [msg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !prompt.trim()) return;

    setLoading(true);

    const userMessage = {
      role: "user",
      message: prompt,
      isImage: mode === "image",
      timestamp: Date.now(),
    };

    setMsg((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const { data } = await axios.post(
        `/api/v2/${mode}`,
        {
          chatId: selected._id,
          message: prompt,
          ispublished: published,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        const assistantMessage = {
          role: "assistant",
          message: data.response,
          isImage: mode === "image",
          timestamp: Date.now(),
        };

        setMsg((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen p-3 items-center justify-between">
      <div ref={ref} className="flex-1 mb-5 overflow-y-scroll w-full">
        {msg.length === 0 ? (
          <div className="h-full flex flex-col gap-3 items-center justify-center">
            <img className="w-96" src={assets.logo_full_dark} alt="logo" />
            <h1 className="text-5xl text-zinc-400">Ask me anything</h1>
          </div>
        ) : (
          msg.map((item, index) => (
            <Messages key={index} item={item} idx={index} />
          ))
        )}
      </div>

      {mode === "image" && (
        <label className="flex gap-1 items-center mb-2 text-sm">
          <p>Publish Generated Image to Community</p>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        </label>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[700px] bg-blue-500/20 py-1 rounded-full border border-[#99A1AF] flex items-center gap-3 px-3"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="outline-none text-sm bg-transparent"
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Type your prompt here..."
          className="w-full flex-1 outline-none text-sm bg-transparent"
          required
        />

        <button type="submit" disabled={loading} className="p-1">
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="send"
            className="w-5 h-5"
          />
        </button>
      </form>
    </div>
  );
}

export default ChartBox;
