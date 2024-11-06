import { useState,useEffect } from "react"

export default function HTMLViewer({ filePath }: { filePath: string }) {
    const [htmlContent, setHtmlContent] = useState<string>('');
   
  
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
          setHtmlContent(text);
        } catch (error) {
          console.error('Error fetching text content:', error);
          setHtmlContent('Unable to load text content.');
        }
      };
  
      fetchText();
    }, [filePath]);
  return (
    <div
    className="html-viewer"
    dangerouslySetInnerHTML={{ __html: htmlContent }}
  />
  )
}
