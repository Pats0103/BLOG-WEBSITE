import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";

import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const tagLimit = 5;
const textLimit = 400;

function PublishForm() {
  const {blog_id} = useParams();
  const navigate = useNavigate();
  let {
    setEditorState,
    blog,
    blog: { banner, title, tags, des, content },
    setBlog,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let tag = e.target.value;
      if (tags.length < tagLimit) {
        if (tags.includes(tag)) {
          return toast.error("Tag already exists");
        } else {
          if (tag.length) {
            setBlog({ ...blog, tags: [...tags, tag] });
            e.target.value = "";
          } else {
            return toast.error("Tag cannot be empty");
          }
        }
      }
    }
  };

  const handleDesChange = (e) => {
    setBlog({ ...blog, des: e.target.value });
  };

  const handlePublishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!tags.length) {
      return toast.error("Please add at least one tag");
    }
    if (!des.length || des.length > textLimit) {
      return toast.error(
        "Description cannot be empty or more than 400 characters"
      );
    }

    let LoadinToast = toast.loading("Publishing blog");

    //add disabled attribute to button
    e.target.classList.add("disable");

    let blogData = {
      banner,
      title,
      tags,
      des,
      content,
      draft: false,
    };

    //publish blog
    axios
      .post("/api/create-blog", {...blogData,id:blog_id}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(LoadinToast);
        toast.success("Blog published 👍🏻");

        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(LoadinToast);
        toast.error("Failed to publish blog 😔");
      });
  };
  return (
    <>
      <AnimationWrapper>
        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
          <Toaster />
          <button
            className="w-12 h-12 absolute right-[5vw] z-10 top-[5%]"
            onClick={handleCloseEvent}
          >
            <i className="fi fi-br-cross"></i>
          </button>
          <div className="max-w-[550px] center">
            <p className="text-dark-grey mb-1">Preview</p>
            <div className="w-full aspect-video rounded-lg over bg-grey mt-4">
              <img src={banner} alt="" />
            </div>
            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
              {title}
            </h1>
            <p>{des}</p>
          </div>

          <div className="border-grey lg:border-1 lg:pl-8">
            <p className="text-dark-grey mb-2 mt-9">Description</p>
            <textarea
              name=""
              id=""
              maxLength={textLimit}
              defaultValue={des}
              className="bg-grey w-full h-20 resize-none outline-none  leading-tight placeholder:opacity-40 p-2 rounded-lg"
              onChange={handleDesChange}
            ></textarea>
            <p className="mt-1 mb-4 text-dark-grey text-right">
              {textLimit - des.length} left
            </p>
            <p className="text-dark-grey mb-2 mt-9">
              Topics - (helps searching)
            </p>
            <div className="relative input-box pl-2 pr-2 pb-4">
              <input
                type="text"
                placeholder="Topic"
                className="sticky input-box bg-grey top-0 left-0 pl-4 mb-3 focus:bg-white"
                onKeyDown={handleKeyDown}
              />
              {tags.map((tag, index) => {
                return <Tag key={index} tag={tag} />;
              })}
            </div>
            <p className="mt-1 mb-4 text-dark-grey text-right">
              {tagLimit - tags.length} left
            </p>
            <button className="btn-dark" onClick={(e) => handlePublishBlog(e)}>
              Publish
            </button>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default PublishForm;
