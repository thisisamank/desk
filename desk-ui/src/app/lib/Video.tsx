'use client'
import React, { useEffect, useRef } from "react"
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import Player from 'video.js/dist/types/player';
export default function Video({ options }: { options: {
  autoplay: boolean,
  controls: boolean,
  width:number,
  height:number,
  preload:'auto',
  sources: Array<{ src: string, type: string }>,
  playbackRates: Array<number>,
} }) {
  const videoRef = useRef(null)

  useEffect(() => {
    let player:Player|undefined
    
   function initializePlayer(){
    if (videoRef.current) {
      player = videojs(videoRef.current, options)
    }
   }
    
    const timer = setTimeout(initializePlayer, 0)

    return () => {
      clearTimeout(timer)
      if (player) {
        player.dispose()
      }
    }
  }, [options])

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  )
}
