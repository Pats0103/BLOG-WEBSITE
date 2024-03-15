import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
export const blogStructure = {
  title: "",
  content: [],
  tags: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});
function BlogPage() {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  let {
    title,
    content,
    tags,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    banner,
    publishedAt,
  } = blog;
  const fetchBlog = async () => {
    try {
      const res = await axios.post(`/api/get-blog`, { blog_id });
      const {
        data: { data },
      } = res;
      const blogdata = data;

      axios.post(`/api/search-blogs`,{tag:blogdata.tags[0],limit:5}).then(({data:{data}})=>{
        
        setRelatedBlogs(data.filter(blog=>blog.blog_id!==blogdata.blog_id));
       
       
        
      })
      setBlog(blogdata);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);

  const resetState = () => {
    setBlog(blogStructure);
    setRelatedBlogs([]);
    setLoading(true);
  }
  return (
    <>
      <AnimationWrapper>
        {loading ? (
          <Loader></Loader>
        ) : (
          <BlogContext.Provider value={{ blog, setBlog }}>
            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
              <img src={banner} alt="" className="aspect-video" />
              <div className="mt-12">
                <h2>{title}</h2>
                <div className="flex max-sm:flex-col justify-between my-8 ">
                  <div className="flex gap-5 items-start ">
                    <img
                      src={profile_img}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                    <p>
                      {fullname}
                      <br />@
                      <Link
                        to={`/user/${author_username}`}
                        className="underline"
                      >
                        {author_username}
                      </Link>
                    </p>
                  </div>
                  <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5 ">
                    Published on {getDay(publishedAt)}
                  </p>
                </div> 
              </div>

              <BlogInteraction />
              <div
              className="my-12 font-gleasio blog-page-content"
              >
                  {
                    content[0].blocks.map((block, index) => {
                      return <div key={index} className="my-4 md:my-8">
                        <BlogContent block={block} />
                      </div>
                    })
                  }
              </div>
              <BlogInteraction />
              {
                relatedBlogs != null && relatedBlogs.length > 0 ? 
                <>
                  <h1 className="text-2xl mt-14 mb-10 font-medium">
                      Similar Blogs
                  </h1>
                  {
                    relatedBlogs.map((blog, index) => {
                      let {author:{personal_info}} = blog;
                      return <AnimationWrapper
                      key={index} Transition={{duration:1,delay:index*.08}}
                      >
                         <BlogPostCard content={blog} author={personal_info} /> 
                      </AnimationWrapper>
                    })
                  }
                </>:null
              }
            </div>
          </BlogContext.Provider>
        )}
      </AnimationWrapper>
    </>
  );
}

export default BlogPage;
