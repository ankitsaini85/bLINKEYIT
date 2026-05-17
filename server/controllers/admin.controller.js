import UserModel from "../models/user.model.js"
import OrderModel from "../models/order.model.js"
import ProductModel from "../models/product.model.js"

// Get all users
export const getAllUsersController = async(request,response) => {
    try {
        const { page = 1, limit = 10, search = "" } = request.body

        const skip = (page - 1) * limit

        let query = {}
        if(search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } }
                ]
            }
        }

        const [users, totalCount] = await Promise.all([
            UserModel.find(query).select('-password -refresh_token').skip(skip).limit(limit).sort({ createdAt: -1 }),
            UserModel.countDocuments(query)
        ])

        return response.json({
            message: "Users list",
            data: users,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            page: page,
            limit: limit,
            success: true,
            error: false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Update user role
export const updateUserRoleController = async(request,response) => {
    try {
        const { userId, role } = request.body

        if(!userId || !role) {
            return response.status(400).json({
                message: "Provide userId and role",
                error: true,
                success: false
            })
        }

        if(!['ADMIN', 'USER'].includes(role)) {
            return response.status(400).json({
                message: "Invalid role. Must be ADMIN or USER",
                error: true,
                success: false
            })
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { role: role },
            { new: true }
        ).select('-password -refresh_token')

        if(!updatedUser) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "User role updated successfully",
            data: updatedUser,
            success: true,
            error: false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Update user status (Active/Inactive/Suspended)
export const updateUserStatusController = async(request,response) => {
    try {
        const { userId, status } = request.body

        if(!userId || !status) {
            return response.status(400).json({
                message: "Provide userId and status",
                error: true,
                success: false
            })
        }

        if(!['Active', 'Inactive', 'Suspended'].includes(status)) {
            return response.status(400).json({
                message: "Invalid status. Must be Active, Inactive, or Suspended",
                error: true,
                success: false
            })
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { status: status },
            { new: true }
        ).select('-password -refresh_token')

        if(!updatedUser) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "User status updated successfully",
            data: updatedUser,
            success: true,
            error: false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Get user orders
export const getUserOrdersController = async(request,response) => {
    try {
        const { userId } = request.body

        if(!userId) {
            return response.status(400).json({
                message: "Provide userId",
                error: true,
                success: false
            })
        }

        const orders = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate('delivery_address')

        return response.json({
            message: "User orders",
            data: orders,
            success: true,
            error: false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Get analytics dashboard data
export const getAnalyticsController = async(request,response) => {
    try {
        const totalUsers = await UserModel.countDocuments()
        
        const totalOrders = await OrderModel.countDocuments()
        
        const totalSales = await OrderModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmt" }
                }
            }
        ])

        // Low stock stats
        const lowStockCount = await ProductModel.countDocuments({ stock: { $lt: 10 } })
        const lowStockProducts = await ProductModel.find({ 
            stock: { $lt: 10 } 
        }).limit(50)

        const topProducts = await OrderModel.aggregate([
            { $group: { _id: "$productId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { 
                $lookup: { 
                    from: "products", 
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "product" 
                } 
            }
        ])

        const ordersByStatus = await OrderModel.aggregate([
            { $group: { _id: "$payment_status", count: { $sum: 1 } } }
        ])

        return response.json({
            message: "Analytics data",
            data: {
                totalUsers: totalUsers,
                totalOrders: totalOrders,
                totalSales: totalSales[0]?.total || 0,
                lowStockCount: lowStockCount,
                lowStockProducts: lowStockProducts,
                topProducts: topProducts,
                ordersByStatus: ordersByStatus
            },
            success: true,
            error: false
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
