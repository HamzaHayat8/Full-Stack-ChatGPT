import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Prism from "prismjs";

function Messages({ item }) {
  const isUser = item.role === "user";
  const time = moment(item.timestamp).fromNow();

  useEffect(() => {
    Prism.highlightAll();
  }, [item.content]);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 px-4`}
    >
      <div
        className={`max-w-[75%] px-4 py-1 rounded-lg shadow-md ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {/* Content (text or image) */}
        {item.isImage ? (
          <>
            <img
              src={item.content}
              alt="sent content"
              className="rounded-md max-w-[400px] h-auto"
            />
            <span className="text-xs">{time}</span>
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{item.content}</p>
            <span className="text-xs">{time}</span>
          </>
        )}
      </div>
      {/* Timestamp and User Icon */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        {isUser && (
          <img
            src={assets.user_icon}
            alt="user icon"
            className="w-6 h-6 rounded-full ml-2"
          />
        )}
      </div>
    </div>
  );
}

export default Messages;
