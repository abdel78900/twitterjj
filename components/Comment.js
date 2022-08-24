import {
    ChatIcon
  } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
  import Moment from "react-moment";
  import {
    onSnapshot,
    doc,
    collection,
  deleteDoc,
    setDoc,
  } from "@firebase/firestore";
  import { db} from "../firebase";
import HeartAnimation from "./HeartAnimation";
import { BsUpload } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import Popup from "./Popup";

  
  const Comment = ({ comment, postId, commentD, id}) =>{
  const { data: session } = useSession();
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
console.log('postId:',postId,'commentId:',id)

    const likePost = async () => {
      if (liked) {
        await deleteDoc(doc(db, "posts", postId,"comments",id, "likes", session.user.uid));
      } else {
        await setDoc(doc(db, "posts", postId,"comments",id, "likes", session.user.uid), {
          username: session.user.name,
        });
      }
    };
    useEffect(
      () =>
        onSnapshot(collection(db, "posts", postId,"comments",id, "likes"), (snapshot) =>
          setLikes(snapshot.docs)
        ),
      [db, postId, id]
    );

    useEffect(
      () =>
        setLiked(
          likes.findIndex((like) => like.id === session?.user?.uid) !== -1
        ),
      [likes]
    );

    return (
      <div className="p-3 flex cursor-pointer border-b border-gray-700">
        <img
          src={comment?.userImg}
          alt=""
          className="h-11 w-11 rounded-full mr-4"
        />
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex justify-between">
            <div className="text-[#6e767d]">
              <div className="inline-block group">
                <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                  {comment?.username}
                </h4>
                <span className="ml-1.5 text-sm sm:text-[15px]">
                  @{comment?.tag}{" "}
                </span>
              </div>{" "}
              ·{" "}
              <span className="hover:underline text-sm sm:text-[15px]">
                <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
              </span>
              <p className="text-[#d9d9d9] mt-0.5 max-w-lg  text-[15px] sm:text-base">
                {comment?.comment}
              </p>
              <img
            src={comment?.image}
            alt=""
            className="rounded-2xl max-h-[700px] object-cover mr-2"
          />
            </div>
            <div className="icon group flex-shrink-0">
            <Popup  post={comment}/>
            </div>
          </div>
  
          <div className="text-[#6e767d] flex justify-between w-10/12">
            <div className="icon group">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="w-30 h-10 flex items-center justify-center scale-[0.6]">
              <HeartAnimation liked={liked} />
            </div>

            <span
              className={`group-hover:text-pink-600 text-sm -translate-x-5 ${
                liked && "text-pink-600"
              }  ${
                likes.length > 0
                  ? "opacity-1 -translate-y-0 transition duration-200"
                  : "opacity-0 translate-y-5 "
              } `}
            >
              {likes.length}
            </span>
          </div>
          <div className="icon group">
            <BsUpload className="h-5 w-6 group-hover:text-[#1d9bf0]" />
          </div>
          {session.user.uid === comment?.id && (
            <div className="icon group">
              <FiBarChart2 className="h-7 w-6 group-hover:text-[#1d9bf0]" />
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }
  
  export default Comment;