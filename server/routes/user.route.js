import {Router} from 'express';
import { SignIn, SignUp } from '../controllers/user.controller.js';

const router = Router();

router.route('/signup').post(SignUp);
router.route('/signin').post(SignIn);

export default router;