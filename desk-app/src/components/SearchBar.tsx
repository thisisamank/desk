import React from 'react'

type SearchBarProps = {
    search: string
    setSearch: (search: string) => void
}

const SearchBar = ({search , setSearch} : SearchBarProps) => {
  return (
    <div className='py-7 w-screen'>
      <form className='flex justify-center items-center'>
          <input
            type='text'
            className='w-5/12 border border-gray-[#E2E8F0] rounded-full px-7 py-4 bg-[#F8FAFC] focus:outline-none font-medium'
            placeholder='Search...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
    </div>
  )
}

export default SearchBar