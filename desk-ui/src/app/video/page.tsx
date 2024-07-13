import React from "react";
import Video from "../lib/Video";
import FolderStructure from "../components/FolderStructure";

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="w-[70%] h-full">
        <Video
          options={{
            sources: [
              {
                src: "https://res.cloudinary.com/dzkldv06d/video/upload/v1720251300/Welcome_Dance_-_Meme_Template_gmxdmi.mp4",
                type: "video/mp4",
              },
            ],
            controls: true,
            autoplay: true,
            preload: "auto",
            width: 1010,
            height: 600,
            playbackRates: [0.5, 1, 1.5, 2],
          }}
        />
      </div>
      <div className="w-[30%] h-[600px]">
        <FolderStructure />
      </div>
    </div>
  );
}
