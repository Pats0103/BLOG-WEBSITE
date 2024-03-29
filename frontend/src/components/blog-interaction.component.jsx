import React, { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

function BlogInteraction() {
  let {
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
  } = useContext(BlogContext);

  useEffect(() => {
    axios
      .post(
        "/api/is-liked-by-user",
        { _id },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then(({ data: { data } }) => {
        setIsLikedByUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleLike = () => {
    if (access_token) {
      setIsLikedByUser((prev) => !prev);
      isLikedByUser ? total_likes-- : total_likes++;
      setBlog((prev) => ({
        ...prev,
        activity: { ...activity, total_likes: total_likes },
      }));

      axios
        .post(
          "/api/like-blog",
          { _id, isLikedByUser },
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data: { data } }) => {
          if (data) {
          }
        });
    } else {
      //not logged in
      toast.error("You need to login to like this post");
    }
  };

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);
  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" +
              (isLikedByUser ? " bg-red/20 text-red" : "")
            }
          >
            <i
              className={
                "fi " + "fi-" + (isLikedByUser ? "sr" : "rr") + "-heart"
              }
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>
        <div className="flex gap-6 items-center">
          {username === author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : null}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read${title}&url=4${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
}

export default BlogInteraction;
