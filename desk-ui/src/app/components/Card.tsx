"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import dotLogo from "@/../public/assets/dot-grid-logo.svg";
import { exceedWords } from "../utils/helper";
import trashCan from "@/../public/assets/trash-can-simple-logo.svg";
import pinLogo from "@/../public/assets/pin-logo.svg";
import { BASE_URL } from "../constants/api";

interface CardProps {
  name: string;
  author: string;
  id: string;
  updateCourses: () => void;
}

const Card = ({ name, author, id, updateCourses }: CardProps) => {
  const [isGridOpen, setIsGridOpen] = useState(false);

  const handleGridClick: React.MouseEventHandler<HTMLImageElement> = (e) => {
    e.stopPropagation();
    setIsGridOpen(!isGridOpen);
  };
  const handleDelete: React.MouseEventHandler<HTMLImageElement> = async (e) => {
    try {
      e.stopPropagation();
      const response = await fetch(`${BASE_URL}/course/:id?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data);
      updateCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  return (
    <div className="h-full py-4 flex flex-col justify-between px-3 border-[#E2E8F0] border-2 rounded-lg border-b-4 cursor-pointer">
      <div className="flex justify-between space-x-2">
        <h1 className="text-[#64748B] text-sm max-w-60">
          {exceedWords(name, 40)}
        </h1>
        <div className="relative">
          <Image
            src={dotLogo}
            alt="dotLogo"
            className="cursor-pointer hidden sm:block min-w-5 min-h-5"
            onClick={handleGridClick}
          />
          {isGridOpen && (
            <div className="absolute bg-white border-[#E2E8F0] border-2 rounded-lg w-36 h-fit top-4 -left-16 z-10">
              <ul className="space-y-2 py-2">
                <li className="flex items-center px-3 space-x-3">
                  <Image src={pinLogo} alt="pin-logo" />
                  <span className="text-[#64748B] text-sm font-medium">
                    Pin Course
                  </span>
                </li>
                <li className="flex items-center px-3 space-x-3">
                  <Image src={trashCan} alt="pin-logo" />
                  <span
                    className="text-[#64748B] text-sm font-medium"
                    onClick={handleDelete}
                  >
                    Delete
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className="text-[#475669] text-sm pt-3 font-medium">
        {exceedWords(author, 20)}
      </p>
    </div>
  );
};

export default Card;
