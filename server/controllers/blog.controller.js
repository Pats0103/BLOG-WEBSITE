import Blog from "../models/Blog.js";
import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import { nanoid } from "nanoid";
import Notification from "../models/Notification.js";

const createBlog = async (req, res) => {
  const user = req.user;

  const { title, content, banner, draft, des, id } = req.body;

  let tags = req.body.tags;

  if (!title) {
    return ApiResponse(res, 400, "Please fill in all fields");
  }

  if (!draft) {
    if (!title || !des || !banner || !tags) {
      return ApiResponse(res, 400, "Please fill in all fields");
    }
  }

  if (!content.blocks.length)
    return ApiResponse(res, 400, "Please fill in all fields");

  tags = tags.map((tag) => tag.toLowerCase());

  let blogId =
    id || title.replace(/^a-zA-Z0-9/g, " ").replace(/\s+/g, "-") + nanoid(5);

  if (id) {
    Blog.findOneAndUpdate(
      { blog_id: id },
      {
        title,
        content,
        banner,
        tags,
        des,
        draft: Boolean(draft),
      }
    )
      .then((blog) => {
        return ApiResponse(res, 201, "Blog updated successfully", blog);
      })

      .catch((err) => {
        console.log("Error occurred while updating blog: ", err.message);
        return ApiResponse(res, 500, "Error occurred while updating blog");
      });
  } else {
    let blog = new Blog({
      blog_id: blogId,
      title,
      content,
      banner,
      tags,
      des,
      author: user._id,
      draft: Boolean(draft),
    });

    blog
      .save()
      .then((blog) => {
        let increment = draft ? 0 : 1;
        User.findOneAndUpdate(
          { _id: user._id },
          {
            $inc: { "account_info.total_posts": increment },
            $push: { blogs: blog._id },
          }
        ).catch((err) => {
          console.log("Error occurred while updating user: ", err.message);
          return ApiResponse(res, 500, "Error occurred while updating user");
        });
        return ApiResponse(res, 201, "Blog created successfully", blog);
      })
      .catch((err) => {
        console.log("Error occurred while creating blog: ", err.message);
        return ApiResponse(res, 500, "Error occurred while creating blog");
      });
  }
};
const deleteBlog = () => {};
const getBlog = async (req, res) => {
  let { blog_id, draft, mode } = req.body;
  let incrementVal = mode != "edit" ? 1 : 0;
  try {
    const blog = await Blog.findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_reads": incrementVal } }
    )
      .populate(
        "author",
        "personal_info.username personal_info.profile_img  personal_info.fullname"
      )
      .select(
        "blog_id title banner tags activity publishedAt des content author"
      );

    if (!blog) return ApiResponse(res, 404, "Blog not found");
    if (blog.draft && !draft) {
      return ApiResponse(res, 404, "draft blog not accessible");
    }
    if (blog) {
      User.findOneAndUpdate(
        { "personal_info.username": blog.author.personal_info.username },
        { $inc: { "account_info.total_reads": incrementVal } }
      ).catch((err) => {
        console.log("Error occurred while updating user: ", err.message);
        return ApiResponse(res, 500, "Error occurred while updating user");
      });
    }

    return ApiResponse(res, 200, "Blog found", blog);
  } catch (error) {
    console.log("Error occurred while fetching blog: ", error.message);
    return ApiResponse(res, 500, "Error occurred while fetching blog");
  }
};
const getBlogs = async (req, res) => {
  let { page } = req.body;
  const Max_Limit = 5;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.username personal_info.profile_img  personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title banner tags publishedAt des activity -_id")
    .skip((page - 1) * Max_Limit)
    .limit(Max_Limit)
    .then((blogs) => {
      if (!blogs.length) return ApiResponse(res, 404, "No blogs found");
      return ApiResponse(res, 200, "Blogs found", blogs);
    })
    .catch((err) => {
      console.log("Error occurred while fetching blogs: ", err.message);
      return ApiResponse(res, 500, "Error occurred while fetching blogs");
    });
};
const trendingBlogs = async (req, res) => {
  const Max_Limit = 10;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.username personal_info.profile_img  personal_info.fullname -_id"
    )
    .sort({
      "activity.total_reads": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title banner tags publishedAt des activity -_id")
    .limit(Max_Limit)
    .then((blogs) => {
      if (!blogs.length) return ApiResponse(res, 404, "No blogs found");
      return ApiResponse(res, 200, "Blogs found", blogs);
    })
    .catch((err) => {
      console.log("Error occurred while fetching blogs: ", err.message);
      return ApiResponse(res, 500, "Error occurred while fetching blogs");
    });
};

const searchBlogs = async (req, res) => {
  let { tag, query, author, page, limit } = req.body;
  let findQuery = {};
  const Max_Limit = limit ? limit : 5;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = {
      $or: [{ title: { $regex: query, $options: "i" } }],
      draft: false,
    };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.username personal_info.profile_img  personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title banner tags publishedAt des activity -_id")
    .skip((page - 1) * Max_Limit)
    .limit(Max_Limit)
    .then((blogs) => {
      if (!blogs.length) return ApiResponse(res, 404, "No blogs found");
      return ApiResponse(res, 200, "Blogs found", blogs);
    })
    .catch((err) => {
      console.log("Error occurred while fetching blogs: ", err.message);
      return ApiResponse(res, 500, "Error occurred while fetching blogs");
    });
};

const getBlogsCount = async (req, res) => {
  let { tag, query, author } = req.body;
  if (tag) {
    Blog.countDocuments({ tags: tag, draft: false })
      .then((totalDocs) => {
        return ApiResponse(res, 200, "Blogs found", { totalDocs });
      })
      .catch((err) => {
        console.log("Error occurred while fetching blogs: ", err.message);
        return ApiResponse(res, 500, "Error occurred while fetching blogs");
      });
  } else if (query) {
    Blog.countDocuments({
      $or: [{ title: { $regex: query, $options: "i" } }],
      draft: false,
    })
      .then((totalDocs) => {
        return ApiResponse(res, 200, "Blogs found", { totalDocs });
      })
      .catch((err) => {
        console.log("Error occurred while fetching blogs: ", err.message);
        return ApiResponse(res, 500, "Error occurred while fetching blogs");
      });
  } else if (author) {
    Blog.countDocuments({ author, draft: false })
      .then((totalDocs) => {
        return ApiResponse(res, 200, "Blogs found", { totalDocs });
      })
      .catch((err) => {
        console.log("Error occurred while fetching blogs: ", err.message);
        return ApiResponse(res, 500, "Error occurred while fetching blogs");
      });
  } else {
    Blog.countDocuments({ draft: false })
      .then((totalDocs) => {
        return ApiResponse(res, 200, "Blogs found", { totalDocs });
      })
      .catch((err) => {
        console.log("Error occurred while fetching blogs: ", err.message);
        return ApiResponse(res, 500, "Error occurred while fetching blogs");
      });
  }
};

const likeBlog = async (req, res) => {
  let user_id = req.user;
  let { _id, isLikedByUser } = req.body;

  let increment = isLikedByUser ? -1 : 1;

  try {
    const likedBlog = await Blog.findOneAndUpdate(
      { _id },
      { $inc: { "activity.total_likes": increment } }
    );

    if (!likedBlog) return ApiResponse(res, 404, "Blog not found");

    if (!isLikedByUser) {
      const newLike = new Notification({
        type: "like",
        blog: _id,
        notification_for: likedBlog.author,
        user: user_id,
      });

      const notification = await newLike.save();
    } else {
      const notification = await Notification.findOneAndDelete({
        type: "like",
        blog: _id,

        user: user_id,
      });
    }

    if (likedBlog) {
      return ApiResponse(res, 200, "Blog liked successfully");
      i;
    }
  } catch (error) {
    console.log("Error occurred while liking blog: ", error.message);
    return ApiResponse(res, 500, "Error occurred while liking blog");
  }
};

const isLikedByUser = async (req, res) => {
  let user_id = req.user;
  let { _id } = req.body;

  try {
    const likedBlog = await Notification.exists({
      type: "like",
      blog: _id,
      user: user_id,
    });

    if (likedBlog) {
      return ApiResponse(res, 200, "Blog liked by user", true);
    }
    return ApiResponse(res, 200, "Blog not liked by user", false);
  } catch (error) {
    console.log("Error occurred while checking like: ", error.message);
    return ApiResponse(res, 500, "Error occurred while checking like");
  }
};
export {
  createBlog,
  deleteBlog,
  searchBlogs,
  getBlog,
  getBlogs,
  trendingBlogs,
  getBlogsCount,
  likeBlog,
  isLikedByUser,
};
