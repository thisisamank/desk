"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import SearchBar from './SearchBar';
import folder from '@/../public/assets/folder-logo.svg';
import video from '@/../public/assets/videos-logo.svg';
import Card from './Card';
import { mockData } from '../utils/mockData';
import { BASE_URL } from '../constants/api';
import { Course } from '../utils/FolderMap';

interface ExtendedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    webkitdirectory?: string;
    directory?: string;
}

const HomePage = () => {
    const [search, setSearch] = useState('');
    const [courses, setCourses] = useState<Course>();

    // const handleFolderClick = () => {
    //     const folderSelector = document.getElementById('folderSelector') as HTMLInputElement;
    //     if (folderSelector) {
    //         folderSelector.click();
    //     }
    // };

    // const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files;
    //     if (files && files.length) {
    //         const folderPath = files[0].webkitRelativePath.split('/')[0];
    //         console.log('Selected folder path:', folderPath);

            
    //         const formData = new FormData();
    //         for (let i = 0; i < files.length; i++) {
    //             formData.append('files', files[i]);
    //         }

    //         try {
    //             const uploadCourse = await fetch(`${BASE_URL}/course`, {
    //                 method: 'POST',
    //                 body: formData
    //             });
    //             const data = await uploadCourse.json();
    //             setCourses(data);
    //         } catch (error) {
    //             console.error('Error uploading folder:', error);
    //         }
    //     }
    // };

    const handleFolderClick = async () => {
        //@ts-ignore
        const dirHandle = await window.showDirectoryPicker({ startIn: 'downloads' });
        console.log(dirHandle);
    };
    return (
        <div className='w-screen'>
            <SearchBar search={search} setSearch={setSearch} />
            <div className='container-center w-screen pt-3'>
                <div className='py-3 px-5 space-x-2 bg-[#F8FAFC] rounded-full container-center w-auto cursor-pointer' onClick={handleFolderClick}>
                    <Image src={folder} alt='folder-logo' />
                    <h1 className='font-semibold text-[#475569] text-sm'>Add a course</h1>
                    {/* <input
                        type="file"
                        id="folderSelector"
                        style={{ display: "none" }}
                        webkitdirectory="true"
                        directory="true"
                        onChange={handleFolderChange}
                        {...({ webkitdirectory: "true", directory: "true" } as ExtendedInputProps)}
                    /> */}
                    <button onClick={handleFolderClick}>Upload</button>
                </div>
            </div>
            {mockData?.length > 0 && (
                <div className="container-center w-screen pt-8">
                    <div className='w-7/12'>
                        <h1 className='font-medium text-lg text-[#475569] pb-6'>
                            Added Courses
                        </h1>
                        <div className='space-x-2 flex'>
                            <Image src={video} alt='video-logo' />
                            <h1 className='font-medium text-[#475569] text-sm'>Played last time</h1>
                        </div>
                        <div className='w-full grid grid-cols-3 pt-5 h-full place-content-between gap-5'>
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
