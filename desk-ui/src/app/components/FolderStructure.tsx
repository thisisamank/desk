"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { exceedWords } from "../utils/helper";
import { MdAccessTime } from "react-icons/md";
interface File {
  id: string;
  path: string;
  paused_at: string;
  name: string;
  type: "PDF" | "IMAGE" | "folder";
  children?: File[];
}
interface FolderProps {
  data: File;
  idx: number;
}
const Folder: React.FC<FolderProps> = ({ data, idx }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  if (data.type === "folder") {
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <div
          onClick={toggleFolder}
          className="w-full px-4 py-2 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
        >
          {data.name}
          <svg
            className={`w-5 h-5 text-gray-500 transform transition-transform duration-150 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {isOpen && data.children && (
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm text-gray-600 mb-2">11/16 | 27hr 30min</div>
            {data.children.map((child, idx) => (
              <Folder key={child.id || child.name} data={child} idx={idx} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center  flex-grow ">
        <input
          type="checkbox"
          checked={idx < 2 ? true : false}
          readOnly
          className="mr-2 ml-2 form-checkbox h-4 w-4 text-blue-600"
        />

        <span className="text-sm text-gray-700 flex-grow">
          {" "}
          {exceedWords(data.name, 40)}
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-gray-500 ml-8 mr-2 flex items-center ">
          <MdAccessTime />
          <span className="ml-1">{"27min"}</span>
        </span>
      </div>
    </div>
  );
};

const FolderStructure = () => {
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

  return (
    <>
      <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Course content
            </h2>
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </div>
          <div className="h-[calc(100%-64px)] mt-3 overflow-y-auto">
            {folderData.length > 0 ? (
              folderData.map((item, idx) => (
                <div className=" border-b border-gray-200 py-2 ">
                  <Folder key={item.id || item.name} data={item} idx={idx} />
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FolderStructure;
