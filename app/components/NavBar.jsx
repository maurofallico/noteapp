
import CreateNote from './CreateNote'


export default function NavBar({selected, setSelected, reload, setReload}){

    return(
        <div className='w-screen flex justify-center'>
        <div className="bg-blue-300 w-[1240px] sm:h-24 py-3 sm:mt-8 flex sm:flex-row flex-col sm:rounded-xl sm:items-center px-5 sm:justify-between ">
        <p className='sm:text-5xl text-3xl self-center sm:mb-1 mb-5'>NoteApp</p>
        <div className='flex justify-center sm:gap-24 gap-8 text-sm sm:text-2xl '>
        <button onClick={() => setSelected('active')} className={`${selected==='active' ? 'text-orange-700 underline ' : ''}`}>Active Notes</button>
        <button onClick={() => setSelected('archived')} className={`${selected==='archived' ? 'text-orange-700 underline ' : ''}`}>Archived Notes</button>
        <CreateNote reload={reload} setReload={setReload}/>
        </div>
        </div>
        </div>
    )
}
  