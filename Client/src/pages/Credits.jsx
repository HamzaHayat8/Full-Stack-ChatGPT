import React, { useState, useEffect } from "react";
import { dummyPlans } from "../assets/assets";

function Credits() {
  const [card, setCard] = useState([]);

  const fetchCard = () => {
    setCard(dummyPlans);
  };

  useEffect(() => {
    fetchCard();
  }, []);

  return (
    <div className="flex flex-wrap  w-full justify-center gap-6 p-4 items-center">
      {card.length > 0 &&
        card.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between p-6 rounded-lg h-86 shadow min-w-[300px] max-w-[320px] ${
              item.name === "Pro" ? "bg-zinc-200" : "bg-zinc-100"
            }`}
          >
            <div>
              <p className="text-2xl font-semibold">{item.name}</p>
              <p className="text-gray-900 text-xl font-semibold mt-2">
                <span className="text-blue-700">${item.price}</span>
                <span className="text-gray-500 text-sm">/{item.credits}</span>
              </p>
              <ul className="list-disc list-inside mt-4">
                {item.features.map((feature, fIndex) => (
                  <li key={fIndex} className="mt-2">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className={`bg-indigo-600 ${
                item.name === "Pro" && "bg-zinc-900"
              } mt-6 w-full  px-6 py-2 font-medium rounded text-white`}
            >
              Buy Now
            </button>
          </div>
        ))}
    </div>
  );
}

export default Credits;
