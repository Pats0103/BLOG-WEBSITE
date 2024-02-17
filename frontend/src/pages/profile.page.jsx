import React, { useContext, useEffect, useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPageData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import NoData from "../components/nodata.component";
import LodeMoreData from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";
export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    email: "",
    profile_img: "",
    bio: "",
  },
  social_links: {
    youtube: "",
    instagram: "",
    facebook: "",
    twitter: "",
    github: "",
    website: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  joinedAt: "",
};

function ProfilePage() {
  const navigate = useNavigate()
  let { id: userId } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [profileLoaded, serProfileLoaded] = useState("");
  const {
    personal_info: { fullname, username, email, profile_img, bio },
    social_links,
    account_info: { total_posts, total_reads },
    joinedAt,
  } = profile;

  const {
    userAuth: { username: loggedUser },
  } = useContext(UserContext);
  const fetchProfile = async () => {
    axios
      .post("/api/get-user", { username: userId })
      .then(({ data: { data } }) => {
        setProfile(data);
        serProfileLoaded(userId);
        fetchBlogs({ user_id: data._id, page: 1 });
        setLoading(false);
      })
      .catch(({response:{data:{message}}}) => {
        if(message==="User not found"){
          navigate("/404")
        }
        setLoading(false);
      });
  };

  const fetchBlogs = async ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    axios
      .post("/api/search-blogs", { page, author: user_id })
      .then(async ({ data: { data } }) => {
        const formattedData = await filterPageData({
          state: blogs,
          data,
          page,
          countRoute: "/api/blog-count",
          data_to_send: { author: user_id },
        });
        formattedData.user_id = user_id;

        setBlogs(formattedData);
      });
  };

  useEffect(() => {
    if (userId != profileLoaded) {
      setBlogs(null);
    }

    if (blogs == null) {
      reset();

      fetchProfile();
    }
  }, [userId, blogs]);

  const reset = () => {
    setLoading(true);
    setProfile(profileDataStructure);
    serProfileLoaded("");
  };
  return (
    <>
      <AnimationWrapper>
        {loading ? (
          <Loader />
        ) : (
          <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-1 border-grey md:sticky md:top-[100px] md:py-10  ">
              <img
                src={profile_img}
                alt=""
                className="w-48 h-48 rounded-full md:w-52 md:h-52 bg-grey "
              />
              <h1 className="text-2xl font-medium">@{username}</h1>
              <p className="text-xl capitalize h-6">{fullname}</p>
              <p>
                {total_posts.toLocaleString()} Blogs -{" "}
                {total_reads.toLocaleString()} Reads
              </p>
              <div className="flex gap-4 mt-2">
                {userId === loggedUser ? (
                  <Link to="/settings/edit-profile" className="btn-light">
                    edit profile
                  </Link>
                ) : (
                  ""
                )}
              </div>
              <AboutUser
                bio={bio}
                socialLinks={social_links}
                joinedAt={joinedAt}
                className={"max-md:hidden"}
              />
            </div>
            <div className="max-md:mt-12 w-full">
              <InPageNavigation
                routes={["Blogs Published", "About"]}
                defaultHidden={["About"]}
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

                  <LodeMoreData state={blogs} fetchData={fetchBlogs} />
                </>
                <AboutUser
                  bio={bio}
                  socialLinks={social_links}
                  joinedAt={joinedAt}
                />
              </InPageNavigation>
            </div>
          </section>
        )}
      </AnimationWrapper>
    </>
  );
}

export default ProfilePage;
