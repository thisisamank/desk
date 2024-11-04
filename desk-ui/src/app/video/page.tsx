'use client'
import React, { useEffect, useState } from "react";
import Video from "../lib/Video";
import FolderStructure from "../components/FolderStructure";
import { useSearchParams } from "next/navigation";
interface File {
  id: string;
  path: string;
  paused_at: string;
  name: string;
  type: "PDF" | "IMAGE" | "folder";
  children?: File[];
}
export default function Page() {
  const [selectedFile,setSelectedFile]=useState<File>()
  const [folderData, setFolderData] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/Folders/${course_id}`);
        const datas = await response.json();
        setFolderData(datas.courseData.data[0].lessons.children);
      } catch (error) {
        console.error("Error fetching folder data:", error);
      }
    };

    fetchData();
  }, []);
  if (folderData.length === 0) return <div className="">loading...</div>;

  return (
    <div className="flex h-screen">
      <div className="w-[70%]">
        <Video videoPath={selectedFile?.path?selectedFile.path:folderData[0].path}/>
      </div>
      <div className="w-[30%] h-[580px]">
        <FolderStructure selectedFile={selectedFile!} setSelectedFile={setSelectedFile} folderData={folderData} />
      </div>
    </div>
  );
}
