import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import { BsArrow90DegRight } from "react-icons/bs";
import { BsArrow90DegUp } from "react-icons/bs";
import { BiMessageRounded } from "react-icons/bi";
import { BsUpload } from "react-icons/bs";
import { FiBarChart2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import "moment/locale/fr";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { db } from "../firebase";
import HeartAnimation from "./HeartAnimation";
import Popup from "./Popup";

const Post = ({ id, post, postPage }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };
  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      onClick={() => router.push(`/${id}`)}
    >
      {!postPage && (
        <img
          src={post?.userImg}
          alt=""
          className="h-11 w-11 rounded-full mr-4"
        />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt="Profile Pic"
              className="h-11 w-11 rounded-full mr-4"
            />
          )}
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                  !postPage && "inline-block"
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}
              >
                @{post?.tag}
              </span>
            </div>{" "}
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment locale="fr" fromNow>
                {post?.timestamp?.toDate()}
              </Moment>
            </span>
            {!postPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {post?.text}
              </p>
            )}
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            {/* <BsThreeDots className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" /> */}
          <Popup  post={post} id={id}/>
          </div>

        </div>
        {postPage && (
          <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.text}</p>
        )}
        <img
          src={post?.image}
          alt=""
          className="rounded-2xl max-h-[700px] object-cover mr-2"
        />
        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <BiMessageRounded className="h-8 w-6 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {session.user.uid === post?.id ? "" : ""}
          
          <div className="flex items-center space-x-1 group translate-x-4">
            <div className="icon group-hover:bg-green-500/10">
              <div className="flex translate-x-1 group-hover:text-green-500">
                <BsArrow90DegUp />
                <BsArrow90DegRight className="rotate-90 -translate-x-2" />
              </div>
            </div>
          </div>

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              // e.stopPropagation();
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

          <div className="icon group -translate-x-6">
            <BsUpload className="h-5 w-6 group-hover:text-[#1d9bf0] " />
          </div>
          {session.user.uid === post?.id && (
            <div className="icon group -translate-x-6">
              <FiBarChart2 className="h-7 w-6 group-hover:text-[#1d9bf0] " />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
