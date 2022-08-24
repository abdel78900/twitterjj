import Image from 'next/image';
import * as React from 'react';
import SidebarLink from './SidebarLink'
import { HomeIcon } from "@heroicons/react/solid";
import { getProviders, getSession, signOut, useSession } from "next-auth/react";
import {
    HashtagIcon,
    BellIcon,
    InboxIcon,
    BookmarkIcon,
    UsersIcon,
    UserIcon,
    DotsCircleHorizontalIcon,
    DotsHorizontalIcon,
  } from "@heroicons/react/outline";
  import { BsThreeDots } from 'react-icons/bs';
  import { BiHomeCircle } from 'react-icons/bi';
  import { RiHashtag } from 'react-icons/ri';
  import { VscBell } from 'react-icons/vsc';
  import { HiOutlineMail } from 'react-icons/hi';
  
  
import { useRouter } from 'next/router';



const Sidebar= () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="ml-10 sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div
      onClick={()=>{
        router.push("/")}}
      className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
          <Image
          src='https://rb.gy/ogau5a'
          width={30}
          height={30}
          />
          </div>
          <div className='space-y-2.5 mt-4 mb-2.5 xl:ml-24'>
        <SidebarLink 
        
        text="Accueil" Icon={BiHomeCircle} active />
        <SidebarLink text="Explorer" Icon={RiHashtag} />
        <SidebarLink text="Communautés" Icon={UsersIcon} />
        <SidebarLink text="Notifications" Icon={VscBell} />
        <SidebarLink text="Messages" Icon={HiOutlineMail} />
        <SidebarLink text="Signets" Icon={BookmarkIcon} />
        <SidebarLink text="Profil" Icon={UserIcon} />
        <SidebarLink text="Plus" Icon={DotsCircleHorizontalIcon} />

          </div>
          <button className='hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56 h-[52px] text-lg font-bold  shadow-cyan-300 hover:bg-[#1a8cd8]'>Tweeter</button>
          <button className=' flex xl:hidden  bg-[#1d9bf0] text-white rounded-full w-12 h-12 font-bold  shadow-cyan-300 hover:bg-[#1a8cd8]'>
            <svg viewBox="0 0 36 32" fill="#fff" className='mt-3 ml-2 '>
              <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H9c.4 0 .8-.3.8-.8s-.5-.7-1-.7zm15-4.9v-.1h-.1c-.1 0-9.2 1.2-14.4 11.7-3.8 7.6-3.6 9.9-3.3 9.9.3.1 3.4-6.5 6.7-9.2 5.2-1.1 6.6-3.6 6.6-3.6s-1.5.2-2.1.2c-.8 0-1.4-.2-1.7-.3 1.3-1.2 2.4-1.5 3.5-1.7.9-.2 1.8-.4 3-1.2 2.2-1.6 1.9-5.5 1.8-5.7z">

              </path>
            </svg>

          </button>
          <div className='text-[#d9d9d9] flex items-center justify-center hoverAnimation xl:ml-auto xl:-mr-5 mt-auto'
          onClick={signOut}
          >
              <img src={session?.user?.image} alt="" 
              className="h-10 w-10 rounded-full xl:mr-2.5 "
              />
              <div className='hidden xl:inline leading-5'>
                <h4 className='font-bold' >{session.user.name}</h4>
                <p className='text-[#6e767d]'>@{session.user.tag}</p>
              </div>
              <BsThreeDots className="h-5 w-5 hidden xl:inline ml-10" />
          </div>

      
    </div>
  );
}

export default Sidebar

