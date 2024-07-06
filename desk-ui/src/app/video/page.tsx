import React from 'react'
import Video from '../lib/Video'
export default function page() {
  return (
    <div>
      <Video
        options={{
          sources: [
          {
            src:'https://res.cloudinary.com/dzkldv06d/video/upload/v1720251300/Welcome_Dance_-_Meme_Template_gmxdmi.mp4',
            type:'video/mp4'
          }

          ],
          controls: true,
          autoplay:true,
          preload:'auto',
        
          width: 600,
          height: 300,
          
          
          playbackRates: [0.5, 1, 1.5, 2],
         
        }}
      />
    </div>
  )
}
