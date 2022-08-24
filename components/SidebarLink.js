import { useRouter } from 'next/router';
import * as React from 'react';

const SidebarLink = ({active, text, Icon}) => {
  const router = useRouter();

  return (
    <div className={`relative text-[#D9D9D9] flex items-center justify-center  xl:justify-start text-xl space-x-3 hoverAnimation  ${ active && "font-bold"}`}
    onClick={()=>{ active &&
      router.push("/")}}
    >

      <div className='relative'>

      <div className={active && 'absolute -top-1 right-0 w-2 h-2 rounded-full bg-cyan-500'}></div>
      <Icon className='h-7 w-7'/>
      </div>
      <span className='hidden xl:inline'>{text}</span>
    </div>
  );
}

export default SidebarLink
