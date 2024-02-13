import React from "react";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

function MinimalBlogPost({ content, author, index }) {
  let {
    title,
    des,
    banner,
    publishedAt,
    tags,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullname, profile_img, username } = author;
  return (
    <Link to={`/blogs/${id}`} className="flex mb-8 ">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>
      <div className="pl-4">
        <div className="flex gap-2 items-center mb-7 ">
          <img src={profile_img} className="w-6 h-6 rounded-full" alt="" />
          <p className="line-clamp-1">
            {fullname} <span className="text-gray-500">@{username}</span>
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
}

export default MinimalBlogPost;
