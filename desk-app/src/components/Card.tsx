import { useState } from "react";
import {exceedWords} from "../../utils/helper";



interface CardProps {
    name: string;
    author: string;
}

const Card = ({name , author} : CardProps) => {
  const [isGridOpen , setIsGridOpen] = useState(false)

 const handleGridClick = () => {
    setIsGridOpen(!isGridOpen)
 }

  return (
    <div className='w-fit h-fit py-4 px-3 border-[#E2E8F0] border-2 rounded-lg border-b-4 cursor-pointer'>
      <div className='flex space-x-2'>
        <h1 className='text-[#64748B] text-sm max-w-60'>
          {exceedWords(name, 40)}
        </h1>
        <div className='relative'>
     <img src={"../assets/dot-grid-logo.svg"} alt='dotLogo' className='cursor-pointer' onClick={handleGridClick} />
     {isGridOpen && (
  <div className='absolute bg-white border-[#E2E8F0] border-2 rounded-lg w-36 h-fit top-4 -left-16 z-10'>
    <ul className='space-y-2 py-2'>
      <li className='flex items-center px-3 space-x-3'>
        <img src={"../assets/pin-logo.svg"} alt='pin-logo' />
        <span className='text-[#64748B] text-sm font-medium'>Pin Course</span>
      </li>
      <li className='flex items-center px-3 space-x-3'>
        <img src={"../assets/trash-can-simple-logo.svg"} alt='pin-logo' />
        <span className='text-[#64748B] text-sm font-medium'>Delete</span>
      </li>
    </ul>
  </div>
)}
      </div>
      </div>
      <p className='text-[#475669] text-sm pt-3 font-medium'>
        {exceedWords(author, 20)}
      </p>
    </div>
  )
}

export default Card;