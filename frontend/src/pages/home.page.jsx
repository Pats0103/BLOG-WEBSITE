import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoData from "../components/nodata.component";
import { filterPageData } from "../common/filter-pagination-data";
import LodeMoreData from "../components/load-more.component";
function HomePage() {
  let [blogs, setBlogs] = useState(null);
  let [trending, setTrending] = useState(null);
  let [pageState, setPageState] = useState("home");
  let categories = [
    "quiz",
    "personality",
    "solutions",
    "Business",
    "Entertainment",
    "advice",
    "motivation",
  ];
  const fetchLatestBlog = async ({ page = 1 }) => {
    axios
      .post("/api/latest-blogs", { page })
      .then(async ({ data: { data } }) => {
        const formatedData = await filterPageData({
          state: blogs,
          data,
          page,
          countRoute: "/api/blog-count",
        });
        console.log(formatedData);
        setBlogs(formatedData);
      })
      .catch((err) => console.log(err));
  };
  const fetchtrendingBlog = async () => {
    axios
      .get("/api/trending-blogs")
      .then(({ data: { data } }) => {
        setTrending(data);
      })
      .catch((err) => console.log(err));
  };

  const LoadByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);
    if (pageState == category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  const fetchBlogByCategory = async ({ page = 1 }) => {
    axios
      .post("/api/search-blogs", { tag: pageState, page })
      .then(async ({ data: { data } }) => {
        const formatedData = await filterPageData({
          state: blogs,
          data,
          page,
          countRoute: "/api/blog-count",
          data_to_send: { tag: pageState },
        });
        console.log(formatedData);
        setBlogs(formatedData);
      })
      .catch((err) => {
        setBlogs([]);
      });
  };
  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlog({ page: 1 });
    } else {
      fetchBlogByCategory({ page: 1 });
    }
    if (!trending) fetchtrendingBlog();
  }, [pageState]);
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blog */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending"]}
            defaultHidden={["trending"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs?.results?.length > 0 ? (
                blogs?.results?.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      Transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoData message="No blog found" />
              )}

              <LodeMoreData
                state={blogs}
                fetchData={
                  pageState == "home" ? fetchLatestBlog : fetchBlogByCategory
                }
              />
            </>
            <>
              {trending == null ? (
                <Loader />
              ) : trending.length > 0 ? (
                trending.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      Transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost
                        content={blog}
                        author={blog.author.personal_info}
                        index={i}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoData message="No trending blog found" />
              )}
            </>
          </InPageNavigation>
        </div>

        {/* filter and trending blog */}
        <div
          className="min-h-[40
            %] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden"
        >
          <div className="flex flex-col gap-10 mb-8">
            <h1 className="font-medium text-xl ">Stories from all interest</h1>
            <div className="flex gap-3 flex-wrap">
              {categories.map((category, i) => {
                return (
                  <button
                    key={i}
                    className={
                      "tag " +
                      (pageState == category.toLocaleLowerCase()
                        ? " bg-black text-white "
                        : "")
                    }
                    onClick={LoadByCategory}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="">
            <h1 className="font-medium text-xl mb-8 ">
              {" "}
              Trending
              <i class="fi fi-rr-arrow-trend-up ml-2"></i>
            </h1>
            <div>
              {trending == null ? (
                <Loader />
              ) : (
                trending.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      Transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost
                        content={blog}
                        author={blog.author.personal_info}
                        index={i}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
}

export default HomePage;
