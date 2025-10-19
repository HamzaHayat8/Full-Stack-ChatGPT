import React, { useEffect, useState } from "react";
import { dummyPublishedImages } from "../assets/assets";
import Loading from "./Loading";

function Community() {
  const [img, setImg] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("wewww", img);

  const fetchImg = () => {
    setImg(dummyPublishedImages);
    setLoading(false);
  };

  useEffect(() => {
    fetchImg();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className=" w-full  px-3 ">
      <div className=" overflow-y-scroll h-screen py-1">
        <h1 className="text-3xl mb-2">Community Images</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
          {img.length > 0 ? (
            img.map((item) => (
              <div className="rounded-xl overflow-hidden group w-full relative ">
                <img
                  className="w-full object-cover"
                  src={item.imageUrl}
                  alt=""
                />
                <div className="absolute bottom-0 left-0 px-1 hidden group-hover:block">
                  <h1 className="text-white">{item.userName}</h1>
                </div>
              </div>
            ))
          ) : (
            <h1>No images</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Community;
