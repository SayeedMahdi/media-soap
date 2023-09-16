'use client'
import {useState} from 'react'
import dynamic from "next/dynamic"
import { nanoid } from 'nanoid'
import Link from 'next/link'



export default function Challenge() {
  const [roomId, setRoomId] = useState()
  const CopyClip = dynamic(() => import("./CopyClip"), { ssr: false })
  const generateRoom = () =>{
    const room = nanoid(10)
    setRoomId(room)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
    <figure className="mb-4 max-w-sm">
    <div className='flex gap-1'>

  <img src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" className="mb-4 h-23 w-2/3 rounded-tl-lg rounded-bl-lg align-middle leading-none shadow-lg" alt="Hollywood Sign on The Hill" />

  <img src="https://media.istockphoto.com/id/1200677760/photo/portrait-of-handsome-smiling-young-man-with-crossed-arms.jpg?b=1&s=612x612&w=0&k=20&c=t7Z7NBXf5t7jWqoFxsH7B3bgrO3_BznOOhqEXWywjOc=" className="mb-4 h-23 w-2/3 rounded-tr-lg rounded-br-lg align-middle leading-none shadow-lg" alt="Hollywood Sign on The Hill" />
    </div>
    <div className="flex justify-center">

<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full" onClick={generateRoom}>
Create Challenge
</button>

<Link  href={{
    pathname: '/room',
    query: { roomId: roomId },
  }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4">
Join Challenges
</Link>
</div>
{
  roomId && (<div className='flex gap-3 items-center'>
  <input
      type="text"
      class="peer block min-h-[auto] w-full rounded border-0 bg-neutral-100 px-1 py-[0.22rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
      id="exampleFormControlInput5"
      value={`localhost:3000/room?roomId=${roomId}`}
      aria-label="Disabled input example"
      disabled />
    
  <CopyClip content={`localhost:3000/room?roomId=${roomId}`}/>
  </div>)
}

</figure>
</div>
  )
}
