import mongoose from 'mongoose'

const adminApprovalRequestSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    shopName : {
        type : String,
        required : true
    },
    shopDescription : {
        type : String
    },
    status : {
        type : String,
        enum : ['pending','approved','rejected'],
        default : 'pending'
    },
    rejectionReason : {
        type : String,
        default : ''
    },
    approvedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    }
},{
    timestamps : true
})

const AdminApprovalRequestModel = mongoose.model('adminApprovalRequest',adminApprovalRequestSchema)

export default AdminApprovalRequestModel