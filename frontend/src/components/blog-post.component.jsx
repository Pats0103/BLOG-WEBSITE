import React from "react";
import { getDay } from "../common/date";
import { Link } from "react-router-dom";

function BlogPostCard({ content, author }) {
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
    <Link
      to={`/blog/${id}`}
      className="flex gap-8 items-center border-b mb-4 pb-5  border-grey"
    >
      <div className="w-full ">
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} alt="" className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
        <p className="my-5 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>
        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4"> {tags[0]}</span>
          <span className="ml-3 flex gap-2 items-center text-dark-grey">
            <i className="fi fi-br-heart text-xl"></i>
            {total_likes}
          </span>
        </div>
      </div>
      <div className="h-28 aspect-square bg-grey">
        <img
          src={banner}
          alt=""
          className="object-cover w-full h-full rounded-md"
        />
      </div>
    </Link>
  );
}

export default BlogPostCard;
