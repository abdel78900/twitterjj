import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { BsThreeDots } from 'react-icons/bs'
import { FiUserPlus } from 'react-icons/fi'
import { TbPlaylistAdd } from 'react-icons/tb'
import { TiVolumeMute } from 'react-icons/ti'
import { MdBlock } from 'react-icons/md'
import { BsCodeSlash } from 'react-icons/bs'
import { FiFlag } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { TrashIcon } from '@heroicons/react/outline'
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import { useRouter } from 'next/router'
import ModalDelete from './ModalDelete'
import { useRecoilState } from 'recoil'
import { modalDeleteState, postIdState } from '../atoms/modalAtom'




const Popup = ({post, id}) =>  {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useRecoilState(modalDeleteState);
  const [postId, setPostId] = useRecoilState(postIdState);
  
  // console.log('mds:', isOpen);
  // useEffect(() => {
  //   setPostId(postId1)
  // }, [postId1])

  return (
    <div 
    onClick={(e) => {
        e.stopPropagation();
        setPostId(id)
      }}
    className="  w-56 text-right ">
      
      <Menu as="div" className="relative inline-block text-left ">
        <div>
          <Menu.Button className=" inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            
            <div className="icon group flex-shrink-0 ml-auto">
            <BsThreeDots className="z-20 h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className=" z-30 absolute right-0 pt-2 w-96  top-0 px-2 mt-3 rounded-md   bg-black shadow-lg shadow-white/30 focus:outline-none">
          <div className="px-1 py-1  ">
          {session.user.uid === post?.id ? (

              <Menu.Item>
                  <button
                  onClick={(e) => {
                    setIsOpen(true)
                    e.stopPropagation();
                  }}
                    className='text-red-600 group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
                   <p className='text-red-600'>Supprimer</p> 
                  </button>
              </Menu.Item>
          ) : ("")}
              <Menu.Item>
                  <button
                    className='text-white group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <FiUserPlus
                        className="mr-3 h-8 w-6 text-gray-500/60"
                        aria-hidden="true"
                      />
                    S'abonner à {post?.username}
                  </button>
              </Menu.Item>
              <Menu.Item>
              <button
                    className='text-white group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <TbPlaylistAdd
                        className="mr-3 h-8 w-6 text-gray-500/60"
                        aria-hidden="true"
                      />
                    Ajouter @{post?.tag} à des Listes
                  </button>
              </Menu.Item>
              <Menu.Item>
              <button
                    className='text-white group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <TiVolumeMute
                        className="mr-3 h-8 w-6 text-gray-500/60"
                        aria-hidden="true"
                      />
                    Masquer @{post?.tag}
                  </button>
              </Menu.Item>
              <Menu.Item>
              <button
                    className='text-white group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <MdBlock
                        className="mr-3 h-8 w-6 text-gray-500/60"
                        aria-hidden="true"
                      />
                    Quitter cette conversation
                  </button>
              </Menu.Item>
              <Menu.Item>
              <button
                    className='text-white group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <MdBlock
                        className="mr-3 h-8 w-6 text-gray-500/60"
                        aria-hidden="true"
                      />
                    Bloquer @{post?.tag}
                  </button>
              </Menu.Item>
              <Menu.Item>
              <button
                    className='text-white group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <BsCodeSlash
                        className="mr-3 h-8 w-6 text-gray-500/60"
                        aria-hidden="true"
                      />
                    Intégrer le Tweet
                  </button>
              </Menu.Item>
              <Menu.Item>
              <button
                    className='text-white group flex w-full items-center rounded-md  py-5 text-sm hover:bg-gray-900/20'
                  >
                      <FiFlag
                        className="mr-3 h-8 w-6 text-gray-500/60"
                        aria-hidden="true"
                      />
                    Signaler le Tweet
                  </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default Popup