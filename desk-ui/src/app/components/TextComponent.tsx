import React, { useState, useEffect } from 'react';

export default function TextComponent({ filePath }: { filePath: string }) {
  const [textContent, setTextContent] = useState<string>('');


  useEffect(() => {
    const fetchText = async () => {
      try {
       
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }), 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the text file');
        }

        const text = await response.text();
        setTextContent(text);
      } catch (error) {
        console.error('Error fetching text content:', error);
        setTextContent('Unable to load text content.');
      }
    };

    fetchText();
  }, [filePath]); 

  return (
    <div className="bg-[#f8f8f8] border p-2 overflow-y-auto h-full w-full whitespace-pre-wrap">
      <pre className="whitespace-pre-wrap text-sm p-4">{textContent}</pre>
    </div>
  );
}
