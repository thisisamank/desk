"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SearchBar from "./SearchBar";
import folder from "@/../public/assets/folder-logo.svg";
import video from "@/../public/assets/videos-logo.svg";
import Card from "./Card";
import { mockData } from "../utils/mockData";
import { BASE_URL } from "../constants/api";
import { Course } from "../utils/FolderMap";

interface ExtendedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [paths, setPaths] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course>();

  const handleFolderClick = () => {
    const folderSelector = document.getElementById(
      "folderSelector"
    ) as HTMLInputElement;
    if (folderSelector) {
      folderSelector.click();
    }
  };

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      const folderPath = files[0].webkitRelativePath.split("/")[0];
      try {
        const response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folderName: folderPath }),
        });
        const data = await response.json();
        console.log("Full paths:", data.paths);
        setPaths(data.paths);
      } catch (error) {
        console.error("Error scanning directory:", error);
      }

      //   const formData = new FormData();
      //   for (let i = 0; i < files.length; i++) {
      //     formData.append("files", files[i]);
      //   }
    }
  };
  const uploadCourse = async (filePath: string) => {
    try {
      const url = new URL(`${BASE_URL}/course`);
      url.searchParams.append("path", filePath);

      const uploadCourse = await fetch(url, {
        method: "POST",
      });

      const data = await uploadCourse.json();
      console.log("Uploaded course:", data);
      setCourses(data);
    } catch (error) {
      console.error("Error uploading folder:", error);
    }
  };

  useEffect(() => {
    if (paths.length > 0) {
      uploadCourse(paths[0]);
    }
  }, [paths]);
  return (
    <div className="w-screen">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="container-center w-screen pt-3">
        <div
          className="py-3 px-5 space-x-2 bg-[#F8FAFC] rounded-full container-center w-auto cursor-pointer"
          onClick={handleFolderClick}
        >
          <Image src={folder} alt="folder-logo" />
          <h1 className="font-semibold text-[#475569] text-sm">Add a course</h1>
          <input
            type="file"
            id="folderSelector"
            style={{ display: "none" }}
            webkitdirectory="true"
            directory="true"
            onChange={handleFolderChange}
            {...({
              webkitdirectory: "true",
              directory: "true",
            } as ExtendedInputProps)}
          />
        </div>
      </div>
      {mockData?.length > 0 && (
        <div className="container-center w-screen pt-8">
          <div className="w-7/12">
            <h1 className="font-medium text-lg text-[#475569] pb-6">
              Added Courses
            </h1>
            <div className="space-x-2 flex">
              <Image src={video} alt="video-logo" />
              <h1 className="font-medium text-[#475569] text-sm">
                Played last time
              </h1>
            </div>
            <div className="w-full grid grid-cols-3 pt-5 h-full place-content-between gap-5">
              {mockData?.map((data) => (
                <Card key={data?.id} name={data?.name} author={data?.author} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
