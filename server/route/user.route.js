import { Router } from 'express'
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp, adminLoginController, superAdminLoginController, adminRegisterController, getAdminApprovalsController, approveAdminController, rejectAdminController } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'
import { superadmin } from '../middleware/SuperAdmin.js'

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.post('/admin-login',adminLoginController)
userRouter.post('/superadmin-login',superAdminLoginController)
userRouter.post('/admin-register',adminRegisterController)
userRouter.post('/admin-approvals',auth,superadmin,getAdminApprovalsController)
userRouter.post('/approve-admin',auth,superadmin,approveAdminController)
userRouter.post('/reject-admin',auth,superadmin,rejectAdminController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)




export default userRouter