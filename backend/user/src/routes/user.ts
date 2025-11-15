import express from 'express'
import { getAllUser, loginUser, myProfile, updateName, verifyUser, getAUser } from '../controller/user.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/update/user', isAuth, updateName);
router.get('/user/all', isAuth, getAllUser)
router.get('/user/:id', isAuth, getAUser)
router.get('/me', isAuth, myProfile);
router.post('/verify', verifyUser);

export default router;