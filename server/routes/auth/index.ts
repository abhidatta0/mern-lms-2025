import express from 'express';
import { registerUser, loginUser } from '../../controllers/auth';
import authenticate from '../../middlewares/auth';

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/check-auth',authenticate, (req, res)=>{
    const user = req.user;

    res.status(200).json({
        success: true,
        message: 'Authenticated User',
        data:{
            user
        }
    })
})

export default router;