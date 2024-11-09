'use client';
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from "video.js/dist/types/player";
import "videojs-youtube";
import "../../../styles/VideoPlayer.scss";


interface VideoJSProps {
  options: any; 
  onReady?: (player: Player) => void;
}

export const VideoJS: React.FC<VideoJSProps> = (props) => {
  const videoRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<Player | null>(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });

    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, onReady]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}

export default VideoJS;