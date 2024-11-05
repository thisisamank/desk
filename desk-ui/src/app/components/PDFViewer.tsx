import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { BiChevronLeft,BiChevronRight } from 'react-icons/bi';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ filePath }: { filePath: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }), 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the PDF file');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        console.log(url)
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF content:', error);
        setPdfUrl(null);
      }
    };

    fetchPdf();
  }, [filePath]); 

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };
  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(newPageNumber, numPages));
    });
  }
  return (
    <div className=" h-full bg-indigo-400   flex flex-col">
    <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      
      <div className="   mx-auto flex justify-center space-x-4 ">
      <button
      
        onClick={() => changePage(-1)}
        disabled={pageNumber <= 1}
        className="bg-transparent hover:bg-indigo-100"
      >
        <BiChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => changePage(1)}
        disabled={pageNumber >= numPages}
        className="bg-transparent hover:bg-indigo-100"
      >
        <BiChevronRight className="h-4 w-4" />
      </button>
    </div>
      <div className="text-sm  text-right font-medium">
        Page {pageNumber} of {numPages}
      </div>
    </div>

    <div className="flex-grow relative flex items-center justify-center bg-indigo-100 overflow-auto">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-200 bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="absolute inset-0"
      >
        <Page
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={980} 
          className="mt-4"
        />
      </Document>
    </div>
    
    
  </div>
  );
}
