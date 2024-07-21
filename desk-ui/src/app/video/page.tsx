import React from "react";
import Video from "../lib/Video";
import FolderStructure from "../components/FolderStructure";

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="w-[70%]">
        <Video />
      </div>
      <div className="w-[30%] h-[580px]">
        <FolderStructure />
      </div>
    </div>
  );
}
