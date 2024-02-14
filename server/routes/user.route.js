import {Router} from 'express';
import { SearchUser, SignIn, SignUp } from '../controllers/user.controller.js';

const router = Router();

router.route('/signup').post(SignUp);
router.route('/signin').post(SignIn);
router.route('/search-user').post(SearchUser);

export default router;