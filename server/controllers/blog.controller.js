import Blog from "../models/Blog.js";
import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import { nanoid } from "nanoid";

const CreateBlog = async (req, res) => {
  const user = req.user;
  const { title, content, banner, draft, des } = req.body;
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
    title.replace(/^a-zA-Z0-9/g, " ").replace(/\s+/g, "-") + nanoid(5);

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
};
const DeleteBlog = () => {};
const GetBlog = () => {};
const GetBlogs = async (req, res) => {
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
const TrendingBlogs = async (req, res) => {
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
  let { tag } = req.body;
  let findQuery = { tags: tag, draft: false };
  const Max_Limit = 5;

  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.username personal_info.profile_img  personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
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

const GetBlogsCount = async (req, res) => {
  let { tag } = req.body;
  if (tag) {
    Blog.countDocuments({ tags: tag, draft: false })
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
export {
  CreateBlog,
  DeleteBlog,
  searchBlogs,
  GetBlog,
  GetBlogs,
  TrendingBlogs,
  GetBlogsCount,
};