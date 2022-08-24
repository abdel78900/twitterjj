import React from 'react'
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { modalDeleteState, postIdState } from "../atoms/modalAtom";
import { useRecoilState } from 'recoil';
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
  } from "@firebase/firestore";

  import { db, storage } from "../firebase";
import { useRouter } from 'next/router';

const ModalDelete = ({id}) => {
    const [isOpen, setIsOpen] = useRecoilState(modalDeleteState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();
console.log(postId);




    return (
        <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-50 inset-0 top-1/3 " onClose={setIsOpen}>
          <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
            </Transition.Child>
  
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="!w-96 inline-block align-bottom bg-black rounded-2xl h-auto  text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                <div className="w-full flex items-center justify-center px-1.5 py-2  ">
                <div className=' text-white flex flex-col items-center px-10 mt-6 justify-center'>
            <div className=''>
                <h3 className='text-xl font-bold py-2'>Supprimer le Tweet ?</h3>
                <p className='text-base text-white/50'>Il n'est pas possible d'annuler cette opération. Ce Tweet sera supprimé de votre profil, du fil des comptes qui vous suivent et des résultats de recherche Twitter. </p>
                <div className='flex flex-col space-y-4 my-5'>

                <button 
                  onClick={(e) => {
                    setIsOpen(true)
                    e.stopPropagation();
                    deleteDoc(doc(db, "posts", postId));
                    setIsOpen(false)
                    router.push("/");
                  }}
                className='text-base font-bold bg-red-600 px-4 py-4 rounded-full'>Supprimer</button>
                <button 
                onClick={(e) => {
                    setIsOpen(false)
                    e.stopPropagation();
                   
                  }}
                className='text-base font-bold bg-transparent border px-4 py-4 rounded-full'>Annuler</button>
                </div>

            </div>
            </div>
        </div> 
                
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
        
    )
}

export default ModalDelete
