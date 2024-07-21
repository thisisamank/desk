"use client";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "../../../styles/VideoPlayer.scss";
// import '@digitaltheatre/videojs-theme-dt/dist/theme/index.css';
// import '../../../styles/try.scss'
import Player from "video.js/dist/types/player";
export default function Video() {
  const videoRef = useRef(null);

  useEffect(() => {
    let player: Player | undefined;

    function initializePlayer() {
      if (videoRef.current) {
        player = videojs(videoRef.current, {
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
              "ShareButton",
              "hlsQualitySelector",
              "QualitySelector",
              "pictureInPictureToggle",
              "fullscreenToggle",
            ],
            skipButtons: {
              forward: 10,
              backward: 10,
            },
            currentTimeDisplay: true,
          },
          inactivityTimeout: 3000,
          preload: "auto",
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: true,
          liveui: true,
          language: "",
          sources: [
            {
              src: "https://res.cloudinary.com/dzkldv06d/video/upload/v1720251300/Welcome_Dance_-_Meme_Template_gmxdmi.mp4",
              type: "video/mp4",
            },
          ],
          width: 600,
          height: 300,

          playbackRates: [0.5, 1, 1.5, 2],
          poster:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
          techOrder: ["html5"],
          html5: {},
        });
      }
    }

    const timer = setTimeout(initializePlayer, 0);

    return () => {
      clearTimeout(timer);
      if (!player || player.isDisposed()) return;
      player.dispose();
      videoRef.current = null;
    };
  }, [videoRef]);

  return (
    <div data-vjs-player className="">
      <video ref={videoRef} className="video-js " />
    </div>
  );
}
