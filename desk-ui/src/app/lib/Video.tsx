"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import "../../../styles/VideoPlayer.scss";

export default function Video({ videoPath }: { videoPath: string }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("course_id");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function getStream() {
      try {
        const response = await fetch("/api/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
               "range": "bytes=0-"
          },
          body: JSON.stringify({
            filePath:videoPath,
          
          }),
        });
    console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('Content-Type');
        console.log(contentType)
        if (!contentType || !contentType.includes('video') && !contentType.includes('application')) {
          throw new Error('Invalid Content-Type');
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

  const initializePlayer = useCallback(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
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
      sources: [
        {
          src: videoUrl,
          type: "video/mp4",
        },
      ],
      width: 600,
      height: 300,
      playbackRates: [0.5, 1, 1.5, 2],
      poster:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    });

    player.on("error", function () {
      const error = player.error();
      console.error("Video.js Error:", error);
    });

    playerRef.current = player;
  }, [videoUrl]);

  useEffect(() => {
    if (!videoUrl || !isVideoReady || !videoRef.current || !containerRef.current) return;

    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }


    const timeoutId = setTimeout(() => {
      initializePlayer();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, isVideoReady, initializePlayer]);

 
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container">
      {!isVideoReady && <p className="text-black">Loading video...</p>}
      {videoUrl && isVideoReady && (
        <div ref={containerRef} className="video-wrapper">
          <div data-vjs-player>
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
          </div>
        </div>
      )}
    </div>
  );
}