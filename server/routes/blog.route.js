import {Router} from 'express';
import { CreateBlog } from '../controllers/blog.controller.js';
import verifyUser from '../middleware/verify.middleware.js';


const router = Router();

router.post('/create-blog',verifyUser, CreateBlog);


export default router; 