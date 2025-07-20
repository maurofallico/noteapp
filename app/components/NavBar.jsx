
import CreateNote from './CreateNote'


export default function NavBar({selected, setSelected, reload, setReload}){

    return(
        <div className='w-screen flex justify-center text-gray-50'>
        <div className="bg-slate-700 w-screen sm:h-24 py-3 flex sm:flex-row flex-col sm:items-center sm:px-64 px-5 sm:justify-between ">
        <p className='sm:text-5xl text-3xl self-center sm:mb-1 mb-5'>NoteApp</p>
        <div className='flex justify-center sm:gap-20 gap-8 text-base sm:text-xl '>
        <CreateNote reload={reload} setReload={setReload}/>
        </div>
        </div>
        </div>
    )
}
  