"use client";

import folder from "@/../public/assets/folder-logo.svg";
import video from "@/../public/assets/videos-logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../constants/api";
import Card from "./Card";
import SearchBar from "./SearchBar";
import { UploadYoutubePlaylist } from "./YoutubeUpload";
interface ExtendedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}
export interface CourseGET {
  author: string;
  id: string;
  name: string;
  path: string;
}
const HomePage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [paths, setPaths] = useState<string[]>([]);
  const [courses, setCourses] = useState<CourseGET[]>([]);

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

  async function uploadPlaylist(url: string, CourseName: string) {
    try {
      const uploadPlaylist = await fetch(
        `${BASE_URL}/course/youtube/${CourseName}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playlist_url: url }),
        }
      );

      console.log(uploadPlaylist);
      fetchCourses();
    } catch (err) {
      console.log("Error uploading playlist", err);
    }
  }
  const uploadCourse = async (filePath: string) => {
    try {
      const url = new URL(`${BASE_URL}/course`);
      url.searchParams.append("path", filePath);

      const uploadCourse = await fetch(url, {
        method: "POST",
      });

      const data = await uploadCourse.json();

      setCourses(data);
      fetchCourses();
    } catch (error) {
      console.error("Error uploading folder:", error);
    }
  };
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/course`);
      const data = await response.json();

      setCourses(data?.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    if (paths.length > 0) {
      uploadCourse(paths[0]);
    }
  }, [paths]);
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <div className="w-screen">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="flex mx-auto w-fit">
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

        <UploadYoutubePlaylist uploadPlaylist={uploadPlaylist}/>
      </div>
      {courses?.length > 0 && (
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
            <div className="w-full grid grid-cols-3 pt-5 h-full place-content-between auto-rows-fr gap-5">
              {courses?.map((data) => (
                <div
                  key={data?.id}
                  onClick={() =>
                    router.push(`/video?course_id=${data?.id}`)
                  }
                  className="h-full"
                >
                  <Card
                    name={data?.name}
                    author={data?.author}
                    id={data?.id}
                    updateCourses={fetchCourses}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
