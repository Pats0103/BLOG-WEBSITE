import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getBlogsCount,
  trendingBlogs,
  searchBlogs,
  getBlog,
  likeBlog,
  isLikedByUser
} from "../controllers/blog.controller.js";
import verifyUser from "../middleware/verify.middleware.js";

const router = Router();

router.post("/create-blog", verifyUser, createBlog);
router.post("/latest-blogs", getBlogs);
router.get("/trending-blogs", trendingBlogs);
router.post("/search-blogs", searchBlogs);
router.post("/blog-count", getBlogsCount);
router.post("/get-blog", getBlog);
router.post("/like-blog", verifyUser,likeBlog)

router.post("/is-liked-by-user", verifyUser, isLikedByUser)

export default router;
