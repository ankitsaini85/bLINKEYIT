import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { superadmin } from '../middleware/SuperAdmin.js'
import { 
    getAllUsersController, 
    updateUserRoleController, 
    updateUserStatusController, 
    getUserOrdersController,
    getAnalyticsController 
} from '../controllers/admin.controller.js'

const adminRouter = Router()

// User management routes - SUPERADMIN only
adminRouter.post('/users', auth, superadmin, getAllUsersController)
adminRouter.put('/users/update-role', auth, superadmin, updateUserRoleController)
adminRouter.put('/users/update-status', auth, superadmin, updateUserStatusController)
adminRouter.post('/users/orders', auth, superadmin, getUserOrdersController)

// Analytics route - Both ADMIN and SUPERADMIN can access
adminRouter.get('/analytics', auth, admin, getAnalyticsController)

export default adminRouter
