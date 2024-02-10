import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../imgs/logo.png";
import Banner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import uploadImage from "../common/aws";
import {Toaster, toast} from 'react-hot-toast';
import Editor, { EditorContext } from "../pages/editor.pages";


function BlogEditor() {
  const blogBannerRef = useRef(null);
  let{blog,blog:{banner,title,content,tags},setBlog} = useContext(EditorContext)

  const handleTitleKeydonw = (e) => {
    if(e.keyCode === 13){
      e.preventDefault();
    }
   
  }

  const handleTitleChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    setBlog({...blog, title: e.target.value})
  }
  const handleBannerUpload = async (e) => {
    let file = e.target.files[0];

    if (file) {
      try {
        let imgUrl = await uploadImage(file);
        setBlog({...blog, banner: imgUrl})
  

      } catch (error) {
        console.log(error);
        toast.error("Failed to upload image");
      }
    }
  };
  return (
    <>
      <nav className="navbar ">
        <Link to="/" className="flex-none w-10">
          <img src={Logo} alt="" className="w-9" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">{title.length?title:"New Blog"}</p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>{" "}
          <button className="btn-light py-2">Draft</button>
        </div>
      </nav>
      <Toaster/>
      <AnimationWrapper
        childern={
          <section>
            <div className="mx-auto max-w-[900px] w-full ">
              <div className="relative aspect-video bg-whiten border-4 border-grey hover:opacity-80 rounded-lg">
                <label htmlFor="uploadBanner" className=" cursor-pointer">
                  <img
                    src={banner ? banner : Banner}
                    alt=""
                    className="z-20"
                    ref={blogBannerRef}
                  />
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    hidden
                    id="uploadBanner"
                    onChange={handleBannerUpload}
                  />
                </label>
              </div>

              <textarea name="" id="" cols="30" rows="10" placeholder="Blog Title" className="text-4xl font-medium w-full h-20 resize-none outline-none mt-10 leading-tight placeholder:opacity-40 " onKeyDown={handleTitleKeydonw}
              onChange={handleTitleChange}
              ></textarea>
            </div>
          </section>
        }
      ></AnimationWrapper>
    </>
  );
}

export default BlogEditor;
