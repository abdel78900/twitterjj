import {
    EmojiHappyIcon,
    PhotographIcon,
    XIcon,
  } from "@heroicons/react/outline";
  import { MdGif } from 'react-icons/md';
  import { BiBarChartAlt2 } from 'react-icons/bi';
  import { TbCalendarTime } from 'react-icons/tb';
  import { HiOutlineLocationMarker } from 'react-icons/hi';
  
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useRouter } from "next/router";


const Input = ({inputCom, post}) => {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null)
  const PickerRef = useRef(null)
  const emojiRef = useRef(null)
  const router = useRouter();
  const { id } = router.query;


  useEffect(() => {
    document.addEventListener("click", (e) => {
      if(!PickerRef?.current?.contains(e.target) && !emojiRef?.current?.contains(e.target) ){
       setShowEmojis(false);
      }
    });
  }, []);

  const addImageToPost= (e) =>{
    const reader = new FileReader();
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent)=>{
        setSelectedFile(readerEvent.target.result)
    }
  }
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
  }

  const sendComment = async (e) => {
    e.preventDefault();
    console.log('postId:',id)
    const docRef= await addDoc(collection(db, "posts", id, "comments"), {
      id: session.user.uid,
      comment: input,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    const imageRef = ref(storage, `posts/${docRef.id}/image`)
    if (selectedFile) {
      console.log(imageRef, selectedFile);
        await uploadString(imageRef, selectedFile, "data_url").then (async ()=>{
            const downloadURL = await getDownloadURL(imageRef)
            await updateDoc(doc(db, "posts",id ,"comments",docRef.id ), {
                image: downloadURL
            })
        })
    }
    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setInput("");

  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };
  return (
    <div
      className={`border-b border-gray-700  p-3 flex flex-col space-x-3 overflow-y-scroll ${loading && "opacity-60"} scrollbar-hide`}
    >
      <div className>
        
      {inputCom && <p className='text-white/50 ml-20 text-sm '>En réponse à <span className='text-[#1d9bf0]'>@{post?.tag}</span> </p>}
      </div>
      <div className='flex pt-4'>

      <img
        src={session.user.image}
        alt=""
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="w-full ">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            rows="2"
            className="px-6 pt-2 bg-transparent  outline-none text-[#D9D9D9] placeholder-gray-500 text-lg tracking-wide w-full min-h-[50px]"
            placeholder={inputCom ? "Tweeter votre réponse.":"Quoi de neuf?"}
            onChange={(e) => setInput(e.target.value)}
          />
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
        </div>
        {!loading && (
            <div className='w-[300px] sm:w-full flex items-center justify-between pt-2.5 ml-4 '>
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
                className='absolute mt-[465px] -ml-[40px] max-w-[320px] z-20'>
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
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={inputCom ? sendComment : sendPost }
            >
             {inputCom ? "Répondre":"Tweeter"} 
            </button>
      </div>
        )}
        
    </div>
      </div>
    </div>
  );
};

export default Input;
