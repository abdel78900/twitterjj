

import { useRecoilState } from "recoil";
import { modalState, modalTweetState, postIdState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { db, storage } from "../firebase";
import { useSession } from "next-auth/react";
import {
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { MdGif } from 'react-icons/md';
  import { BiBarChartAlt2 } from 'react-icons/bi';
  import { TbCalendarTime } from 'react-icons/tb';
  import { BiWorld } from 'react-icons/bi';
  
  import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useRouter } from "next/router";
import Moment from "react-moment";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getDownloadURL, ref, uploadString } from "@firebase/storage";


const ModalTweet =() => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [isOpenTweet, setIsOpenTweet] = useRecoilState(modalTweetState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post, setPost] = useState();
  const [input, setInput] = useState("");
  const [comment, setComment] = useState("");
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null)
  const PickerRef = useRef(null)
  const emojiRef = useRef(null)

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if(!PickerRef?.current?.contains(e.target) && !emojiRef?.current?.contains(e.target) ){
       setShowEmojis(false);
      }
    });
  }, []);

  useEffect(
    () =>{

      isOpen &&
        onSnapshot(doc(db, "posts", postId), (snapshot) => {
          setPost(snapshot.data());
        }),
      [isOpen, db]
    }
  );
  const addImageToPost= (e) =>{
    const reader = new FileReader();
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent)=>{
        setSelectedFile(readerEvent.target.result)
    }
  }

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  const sendPost = async () =>{
    
    if (loading) return;
    setLoading(true)
    const docRef= await addDoc(collection(db, 'posts'), {
        id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    })
    const imageRef = ref(storage, `posts/${docRef.id}/image`)
    if (selectedFile) {
        await uploadString(imageRef, selectedFile, "data_url").then (async ()=>{
            const downloadURL = await getDownloadURL(imageRef)
            await updateDoc(doc(db, "posts", docRef.id), {
                image: downloadURL
            })
        })
    }
    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setIsOpenTweet(false)
    router.push("/");
  }

  return (
    <Transition.Root show={isOpenTweet} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setIsOpenTweet}>
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
            <div className="inline-block align-bottom bg-black rounded-2xl text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="flex items-center px-1.5 py-2  ">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => setIsOpenTweet(false)}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex px-4 pt-1 pb-2.5 sm:px-6">
                <div className="w-full">
                  {/* <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    <img
                      src={post?.userImg}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div>
                      <div className="inline-block group">
                        <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base">
                          {post?.username}
                        </h4>
                        <span className="ml-1.5 text-sm sm:text-[15px]">
                          @{post?.tag}{" "}
                        </span>
                      </div>{" "}
                      ??{" "}
                      <span className="hover:underline text-sm sm:text-[15px]">
                        <Moment  fromNow ago>{post?.timestamp?.toDate()}</Moment>
                      </span>
                      <p className="text-[#d9d9d9] text-[15px] mb-12 sm:text-base">
                        {post?.text}
                      </p>
                    </div>
                  </div> */}

                   {/* <p className='text-white/50 ml-14  text-sm '>En r??ponse ?? <span className='text-[#1d9bf0]'>@{post?.tag}</span> </p> */}
                  <div className="mt-1 flex space-x-3 w-full">
                    <img
                      src={session.user.image}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div className="flex-grow mt-2">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Quoi de neuf ?"
                        rows="2"
                        className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                      />
                      <div className="flex items-center space-x-2 mb-3">
                        <BiWorld className="h-5 w-5 text-[#1d9bf0]"/>
                        <p className="text-[#1d9bf0] text-xs font-bold">Tout le monde peut r??pondre </p>
                      </div>
                      <div className="w-full h-0.5 bg-gray-800"/>
                      {selectedFile && (
            <div className="relative">
              <div className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
              onClick={() => setSelectedFile(null)}
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}

                      <div className="flex items-center  justify-between pt-2.5 ">

                      {!loading && (
            <div className='flex items-center justify-between pt-2.5 '>
            <div className='flex items-center '>
                <div className='icon'
                onClick={() => filePickerRef.current.click()}>
                <PhotographIcon className='h-[22px] text-[#1d9bf0]'/>
                <input 
                type='file' 
                onChange={addImageToPost}  
                ref={filePickerRef} 
                hidden
                />
                </div>
                <div className="icon ">
                  <MdGif className="text-[#1d9bf0] h-[18px] rounded-sm w-5 border border-[#1d9bf0]"/>
                </div>
                <div className="icon rotate-90">
                  <BiBarChartAlt2 className="text-[#1d9bf0] h-5 w-20"/>
                {/* <ChartBarIcon className="text-[#1d9bf0] h-[22px]" /> */}
              </div>

              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon 
                ref={emojiRef}
                className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon">
                <TbCalendarTime className="text-[#1d9bf0] h-8 w-5" />
              </div>
              <div className="icon cursor-default">
                <HiOutlineLocationMarker className="text-[#1d9cf048] h-8 w-5 " />
              </div>
              
            {showEmojis && (
                <div 
                ref={PickerRef}
                className='absolute mt-[465px] -ml-[40px] max-w-[320px]'>
                    <Picker
                    onEmojiSelect={addEmoji}
                    data={data}
                    locale='fr'
                    theme="dark"
                    perLine="8"
                    // previewPosition='none'
                    />
                </div>
            )}
        </div>
        <button
                          className="bg-[#1d9bf0]  text-white rounded-full ml-36 px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                          type="submit"
                          onClick={sendPost}
                          disabled={!input.trim() && selectedFile === null}
                        >
                          Tweeter
                        </button>
      </div>
        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ModalTweet;