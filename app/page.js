'use client'

import SearchBar from './components/SearchBar.jsx'
import Note from './components/Note.jsx'
import NavBar from './components/NavBar.jsx'
import {useState} from 'react'


export default function Home() {

  const [selected, setSelected] = useState('active')
  const [filters, setFilters] = useState([]);
   const [reload, setReload] = useState(false)

  

   return (
    <div className= 'overflow-x-hidden bg-gray-50 h-fit'>
     <div className='flex flex-col max-h-0'>
        <div className="flex flex-col gap-8 ">
      <NavBar setSelected={setSelected} selected={selected} reload={reload} setReload={setReload}/>
      <SearchBar setFilters={setFilters} reload={reload} />
    </div>
    
    <div className='sm:w-fit sm:self-center sm:grid md:grid-cols-2 xl:grid-cols-3 mt-8 flex flex-col gap-x-4 gap-y-8 pb-16 '>
         <Note selected={selected} setSelected={setSelected} filter={filters} reload={reload} setReload={setReload} />
      </div>

      </div>
    <div className='h-screen w-screen '>
    </div>
    </div>
  );
}
