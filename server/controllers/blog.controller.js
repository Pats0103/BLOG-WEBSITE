import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import { nanoid } from "nanoid";

const CreateBlog = async (req, res) => {
  const user = req.user;
  const { title, content, banner, draft, des } = req.body;
    let tags = req.body.tags;
  if(!title){
    return ApiResponse(res, 400, "Please fill in all fields");
  }

  if(!draft){
    if (!title || !des || !banner || !tags) {
      return ApiResponse(res, 400, "Please fill in all fields");
    }
  }

  if (!content.blocks.length)
    return ApiResponse(res, 400, "Please fill in all fields");

  tags = tags.map((tag) => tag.toLowerCase());

  let blogId = title
    .replace(/^a-zA-Z0-9/g, " ")
    .replace(/\s+/g, "-")
    +nanoid(5);

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
const GetBlogs = () => {};
const UpdateBlog = () => {};
export { CreateBlog, DeleteBlog, GetBlog, GetBlogs, UpdateBlog };
