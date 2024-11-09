"use client";
import VideoJS from "../lib/VideoJs"; 
import React, { useState, useRef, useCallback, useEffect } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
export default function Page({ videoPath }: { videoPath: string }) {
  const playerRef = useRef<Player | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const isYouTubeUrl = useCallback((url: string): boolean => {
    return YOUTUBE_REGEX.test(url);
  }, []);
  useEffect(() => {
    async function getStream() {
        console.log('path changed')
      try {
        if (isYouTubeUrl(videoPath)) {
          setVideoUrl(videoPath);
          setIsVideoReady(true);
          return;
        }
        const response = await fetch("/api/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            range: "bytes=0-",
          },
          body: JSON.stringify({
            filePath: videoPath,
          }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("Content-Type");
        console.log(contentType);
        if (
          !contentType ||
          (!contentType.includes("video") &&
            !contentType.includes("application"))
        ) {
          throw new Error("Invalid Content-Type");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        console.log(url);
        setVideoUrl(url);
        setIsVideoReady(true);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    }

    setIsVideoReady(false);
    getStream();

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoPath]);
  const videoJsOptions = {
    controlBar: {
      children: [
        "playToggle",
        "skipBackward",
        "skipForward",
        "volumePanel",
        "currentTimeDisplay",
        "timeDivider",
        "durationDisplay",
        "progressControl",
        "liveDisplay",
        "seekToLive",
        "remainingTimeDisplay",
        "customControlSpacer",
        "playbackRateMenuButton",
        "chaptersButton",
        "descriptionsButton",
        "subsCapsButton",
        "audioTrackButton",
        "pictureInPictureToggle",
        "fullscreenToggle",
      ],
      skipButtons: {
        forward: 10,
        backward: 10,
      },
    },
    inactivityTimeout: 3000,
    preload: "auto",
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    techOrder: isYouTubeUrl(videoPath) ? ["youtube", "html5"] : ["html5"],
    sources: [
      {
        src: videoUrl,
        type: isYouTubeUrl(videoPath) ? "video/youtube" : "video/mp4",
      },
    ],
    width: 600,
    height: 300,
    playbackRates: [0.5, 1, 1.5, 2],
    poster:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
  };

  const handlePlayerReady = (player: Player | null) => {
    playerRef.current = player;

    player?.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player?.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      {!isVideoReady && <p className="text-black">Loading video...</p>}
      {
        isVideoReady &&  <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
     }
    </>
  );
}
