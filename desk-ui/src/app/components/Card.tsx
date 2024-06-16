import React from 'react'
import { mockData } from '../utils/mockData'
import Image from 'next/image';
import dotLogo from '@/../public/assets/dot-grid-logo.svg'
import { exceedWords } from '../utils/helper';

interface CardProps {
    name: string;
    author: string;
}

const Card = ({name , author} : CardProps) => {
  return (
    <div className='w-fit h-fit py-4 px-3 border-[#E2E8F0] border-2 rounded-lg border-b-4'>
      <div className='flex space-x-2'>
        <h1 className='text-[#64748B] text-sm max-w-60'>
          {exceedWords(name, 40)}
        </h1>
        <Image src={dotLogo} alt='dotLogo' style={{cursor : "pointer"}} />
      </div>
      <p className='text-[#475669] text-sm pt-3 font-medium'>
        {exceedWords(author, 20)}
      </p>
    </div>
  )
}

export default Card