'use client';
import React, { useEffect, useState } from "react";
import Video from "../lib/Video";
import FolderStructure from "../components/FolderStructure";
import { useSearchParams } from "next/navigation";
import ImageCard from "../components/ImageCard";
import PDFViewer from "../components/PDFViewer"; 
import TextComponent from "../components/TextComponent"; 
import HTMLViewer from "../components/HTMLViewer";
interface File {
  id: string;
  path: string;
  paused_at: string;
  name: string;
  type: "PDF" | "IMAGE" | "VIDEO" | "TEXT" | "folder" | "HTML"; 
  video_duration: string;
  children?: File[];
}

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [folderData, setFolderData] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/Folders/${course_id}`);
        const datas = await response.json();
        setFolderData(datas.courseData.data[0].lessons.children);
        console.log(datas.courseData.data[0].lessons.children);
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };

    fetchData();
  }, [course_id]);

  if (folderData.length === 0) return <div className="">Loading...</div>;

  const renderContent = () => {
    if (!selectedFile) return null;

    switch (selectedFile.type) {
      case "VIDEO":
        return <Video videoPath={selectedFile.path} />;
      case "IMAGE":
        return <ImageCard sourcePath={selectedFile.path} />;
      case "PDF":
        return <PDFViewer filePath={selectedFile.path} />;
      case "TEXT":
        return <TextComponent filePath={selectedFile.path} />;
      case "HTML":
        return <HTMLViewer filePath={selectedFile.path}/>
      default:
        return <div className="">Unsupported file type</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-[70%]">
        {renderContent()}
      </div>
      <div className="w-[30%] h-[580px] overflow-auto">
        <FolderStructure
          selectedFile={selectedFile!}
          setSelectedFile={setSelectedFile}
          folderData={folderData}
        />
      </div>
    </div>
  );
}
