import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation, {
  activeTabRef,
} from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import { filterPageData } from "../common/filter-pagination-data";
import LodeMoreData from "../components/load-more.component";
import AnimationWrapper from "../common/page-animation";
import axios from "axios";
import NoData from "../components/nodata.component";
import BlogPostCard from "../components/blog-post.component";
import UserCard from "../components/usercard.component";

function SearchPage() {
  const { query } = useParams();
  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);

  const fetchuUser = async () => {
    axios.post("/api/search-user", { query }).then(({ data: { data } }) => {

      setUsers(data);
    });
  };

  useEffect(() => {
    activeTabRef.current.click();
    resetState();

    fetchBlogByCategory({ page: 1, create_new_arr: true });
    fetchuUser();
  }, [query]);

  const resetState = () => {
    setBlogs([]);
    setUsers([]);
  };
  const fetchBlogByCategory = async ({ page = 1, create_new_arr = false }) => {
    axios
      .post("/api/search-blogs", { query, page })
      .then(async ({ data: { data } }) => {
        const formatedData = await filterPageData({
          state: blogs,
          data,
          page,
          countRoute: "/api/blog-count",
          data_to_send: { query },
        });

        setBlogs(formatedData);
      })
      .catch((err) => {
        setBlogs([]);
      });
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length > 0 ? (
          users?.map((user, i) => {
            return (
              <AnimationWrapper
                Transition={{ duration: 1, delay: i * 0.1 }}
                key={i}
              >
                <UserCard content={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoData message="No user found" />
        )}
      </>
    );
  };
  return (
    <>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation
            routes={[`search Results from "${query}"`, "Accounts Matched"]}
            defaultHidden={["Accounts Matched"]}
          >
            <>
              {
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

                  <LodeMoreData state={blogs} fetchData={fetchBlogByCategory} />
                </>
              }
            </>
            <UserCardWrapper></UserCardWrapper>
          </InPageNavigation> 
        </div>

        <div
          className="min-h-[40
            %] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden"
        >
          <div className="flex flex-col gap-10 mb-8">
            <h1 className="font-medium text-xl ">Stories from all interest</h1>
            <div className="flex gap-3 flex-wrap">
              {users == null ? (
                <Loader />
              ) : users.length > 0 ? (
                users?.map((user, i) => {
                  return (
                    <AnimationWrapper
                      Transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <UserCard content={user} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoData message="No user found" />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchPage;
