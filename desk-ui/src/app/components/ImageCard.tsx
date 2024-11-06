import React from 'react'
import { useState,useEffect } from 'react'
export default function ImageCard({sourcePath}:{sourcePath:string}) {
    const [imageURL, setImageURL] = useState<string | null>(null);
    useEffect(()=>{
        const fetchImage = async () => {
            try {
              const response = await fetch('/api/videos', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filePath: sourcePath }),
              });
        
              if (response.ok) {
                const blob = await response.blob();
                const imageObjectURL = URL.createObjectURL(blob);
                setImageURL(imageObjectURL);
              } else {
                console.error('Failed to fetch image:', response.statusText);
              }
            } catch (error) {
              console.error('Error:', error);
            }
          };
          fetchImage()

    },[sourcePath])
  return (
    <div className='w-full h-screen'>
      {imageURL && <img src={imageURL} alt='image'/>}
    </div>
  )
}
