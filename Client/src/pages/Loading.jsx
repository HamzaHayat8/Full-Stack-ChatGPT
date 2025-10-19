import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Loading() {
  useEffect(() => {
    setTimeout(() => {
      Navigate("/");
    }, 2000);
    return () => {
      clearTimeout();
    };
  }, []);

  return (
    <div>
      <h1>Loading</h1>
    </div>
  );
}

export default Loading;
