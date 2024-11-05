"use client";

import React, { useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { exceedWords } from "../utils/helper";
interface File {
  id: string;
  path: string;
  paused_at: string;
  name: string;
  type: "PDF" | "IMAGE" | "VIDEO" | "TEXT" | "folder" | "HTML"; 
  video_duration: string;
  children?: File[];
}
interface FolderProps {
  data: File;
  idx: number;
  selectedFile: any;
  setSelectedFile: any;
}
const Folder: React.FC<FolderProps> = ({
  data,
  idx,
  selectedFile,
  setSelectedFile,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  if (data.type === "folder") {
    return (
      <div className="border-b border-gray-200  last:border-b-0">
        <div
          onClick={toggleFolder}
          className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 bg-white  transition-colors duration-150 ease-in-out cursor-pointer"
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
          <div className="bg-gray-50 px-4 py-4">
            <div className="text-sm text-gray-600 pb-2">11/16 | 27hr 30min</div>
            {data.children.map((child, idx) => (
              <Folder
                key={child.id || child.name}
                data={child}
                idx={idx}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`py-2 cursor-pointer ${
        selectedFile && selectedFile.id === data.id ? "bg-blue-100" : ""
      }`}
      onClick={() => {
        setSelectedFile(data);
      }}
    >
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
          <span className="ml-1">{data.video_duration}</span>
        </span>
      </div>
    </div>
  );
};

const FolderStructure = ({
  selectedFile,
  setSelectedFile,
  folderData,
}: {
  selectedFile: File;
  folderData: File[];
  setSelectedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
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
          <div className="h-[calc(100%-64px)] overflow-y-auto">
            {folderData.length > 0 ? (
              folderData.map((item, idx) => (
                <div key={idx} className=" border-b border-gray-200  ">
                  <Folder
                    key={item.id || item.name}
                    data={item}
                    idx={idx}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                  />
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
