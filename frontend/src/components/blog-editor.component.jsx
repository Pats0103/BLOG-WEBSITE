import React, { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../imgs/logo.png";
import Banner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import uploadImage from "../common/aws";
import {Toaster, toast} from 'react-hot-toast';
import Editor, { EditorContext } from "../pages/editor.pages";
import EditorJs from "@editorjs/editorjs"
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";

function BlogEditor() {
  let {userAuth:{access_token}} = useContext(UserContext)
  const blogBannerRef = useRef(null);
  let{blog,blog:{banner,title,content,tags,des},setBlog,textEditor,setTextEditor,setEditorState} = useContext(EditorContext)

let navigate = useNavigate();
  useEffect(() => {
    if(!textEditor.isReady){
      setTextEditor( new EditorJs({
        holder: "texEditor",
        data: content,
        tools:tools,
        placeholder: "Write your blog here",
      })
      )
    }
   
  },[])

  const handleTitleKeydonw = (e) => {
    if(e.keyCode === 13){
      e.preventDefault();
    }
   
  }

  const handleTitleChange = (e) => {
    let input = e.target;
    
    input.style.height = 'auto';
    input.style.height = (input.scrollHeight) + 'px'; // 4px for border
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

  const handlePublishEvent = () =>{
    if(!banner.length){
      return toast.error("Please upload a banner")
    }

    if(!title.length){
      return toast.error("Please write a title")
    }

    if(textEditor.isReady){
      textEditor.save().then((data)=>{
        if(!data.blocks.length){
          return toast.error("Please write a blog")
        }else{
          setBlog({...blog, content: data})
          setEditorState("publish")

        }
      })
      .catch((err)=>{
        console.log(err);
      }
      )
    }
  }

  const handleSaveDraft = (e) =>{
    if(e.target.className.includes("disable")){
      return;
    }
   
   

    let LoadinToast = toast.loading("saving blog to darft");

    //add disabled attribute to button
    e.target.classList.add("disable");

    if(textEditor.isReady){
      textEditor.save().then(content=>{
        let blogData = {
          banner,
          title,
          tags,
          des,
          content,
          draft: true,
        }
    
        //publish blog
        axios.post("/api/create-blog",blogData,{
          headers:{
            Authorization: `Bearer ${access_token}`
          }
        }).then(()=>{
          e.target.classList.remove("disable");
          toast.dismiss(LoadinToast);
          toast.success("Blog saved in Draft 👍🏻");
    
          setTimeout(() => {
            navigate("/")
          }, 500);
        }).catch(({response})=>{
          e.target.classList.remove("disable");
          toast.dismiss(LoadinToast);
          toast.error("Failed to save blog to draft 😔");
        })

      })
    }

   


  }
  return (
    <>
      <nav className="navbar ">
        <Link to="/" className="flex-none w-10">
          <img src={Logo} alt="" className="w-9" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">{title.length?title:"New Blog"}</p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2"
          onClick={handlePublishEvent}
          >Publish</button>{" "}
          <button className="btn-light py-2" 
          onClick={handleSaveDraft}
          >Draft</button>
        </div>
      </nav>
      <Toaster/>
      <AnimationWrapper
        
      >
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
              defaultValue={title}
              ></textarea>
              <hr className="w-full opacity-10 my-5"/>

              <div id="texEditor" className="font-gelasio"></div>
            </div>
          </section>
      </AnimationWrapper>
    </>
  );
}

export default BlogEditor;
