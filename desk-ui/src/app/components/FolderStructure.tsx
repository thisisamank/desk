"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseAndAddLessons } from "../utils/FolderMap";
const FolderStructure = () => {
  interface subdirectories {
    name: string;
    fullPath: string;
  }
  interface expandedSectionData {
    name: string;
    fullPath: string;
    duration?: string;
  }
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [courseDirectory, setCourseDirectory] = useState<subdirectories[]>();
  const [courseMap, setCourseMap] = useState<any>();
  const [expandedSectionData, setExpandedSectionData] =
    useState<expandedSectionData[]>();
  const searchParams = useSearchParams();
  const course_id = searchParams.get("course_id");

  useEffect(() => {
    const getCourse = async () => {
      if (!course_id) return;

      try {
        const response = await fetch(`/api/Folders/${course_id}`);
        const data = await response.json();

        const courseMap = parseAndAddLessons(data.courseData.data[0]);
        setCourseMap(courseMap);

        const subDirectory = courseMap.root().subdirectories;
        setCourseDirectory(subDirectory);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      }
    };
    getCourse();
  }, []);

  const toggleSection = (sectionIndex: number) => {
    if (expandedSection === sectionIndex) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionIndex);
      fetchSectionData(sectionIndex);
    }
  };

  const fetchSectionData = (sectionIndex: number) => {
    try {
      const section = courseMap.root().subdirectories[sectionIndex].fullPath;
      const data = courseMap.get(section).subdirectories;
      setExpandedSectionData(data);
    } catch (error) {
      console.error("Error fetching section data:", error);
    }
  };
  return (
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
        <div className="flex-grow overflow-y-auto">
          {courseDirectory?.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                className="w-full px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                onClick={() => toggleSection(sectionIndex)}
              >
                <span className="font-medium text-gray-700">
                  {section.name}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-150 ${
                    expandedSection === sectionIndex ? "rotate-180" : ""
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
              </button>
              {expandedSection === sectionIndex && (
                <div className="bg-gray-50 px-4 py-2">
                  <div className="text-sm text-gray-600 mb-2">
                    11/16 | 27hr 30min
                  </div>
                  {expandedSectionData?.map(
                    (item: expandedSectionData, itemIndex: number) => (
                      <div
                        key={itemIndex}
                        className="py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-grow">
                            <input
                              type="checkbox"
                              checked={itemIndex < 1}
                              readOnly
                              className="mr-3 form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700 mr-2">
                              {itemIndex + 19}.
                            </span>
                            <span className="text-sm text-gray-700 flex-grow">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                              {item.duration || "27min"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderStructure;
