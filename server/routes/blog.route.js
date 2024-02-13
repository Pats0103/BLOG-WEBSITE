import { Router } from "express";
import {
  CreateBlog,
  GetBlogs,
  GetBlogsCount,
  TrendingBlogs,
  searchBlogs,
} from "../controllers/blog.controller.js";
import verifyUser from "../middleware/verify.middleware.js";

const router = Router();

router.post("/create-blog", verifyUser, CreateBlog);
router.post("/latest-blogs", GetBlogs);
router.get("/trending-blogs", TrendingBlogs);
router.post("/search-blogs", searchBlogs);
router.post("/blog-count", GetBlogsCount);

export default router;