import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import UserModel from "../models/user.model.js";

export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body 

        if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const product = new ProductModel({
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
            uploadedBy: request.userId
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductController = async(request,response)=>{
    try {
        
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        // Filter by uploadedBy for ADMIN role
        const user = await UserModel.findById(request.userId)
        if(user && user.role === 'ADMIN'){
            query.uploadedBy = request.userId
        }

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Superadmin: fetch products uploaded by a specific admin
export const getProductsByAdminController = async (request, response) => {
    try {
        const { adminId, page = 1, limit = 20 } = request.body

        if (!adminId) {
            return response.status(400).json({
                message: "Provide adminId",
                error: true,
                success: false
            })
        }

        const skip = (page - 1) * limit

        const [data, totalCount] = await Promise.all([
            ProductModel.find({ uploadedBy: adminId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('category subCategory'),
            ProductModel.countDocuments({ uploadedBy: adminId })
        ])

        return response.json({
            message: "Admin products",
            error: false,
            success: true,
            totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId,page,limit } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })


        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, page , limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}
        // Filter by uploadedBy for ADMIN role
        const user = await UserModel.findById(request.userId)
        if(user && user.role === 'ADMIN'){
            query.uploadedBy = request.userId
        }
        const skip = ( page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit 
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Bulk upload products via CSV
export const bulkUploadProductsController = async(request,response)=>{
    try {
        const csvData = request.body.products // array of product objects

        if(!csvData || !Array.isArray(csvData) || csvData.length === 0){
            return response.status(400).json({
                message : "Provide products array",
                error : true,
                success : false
            })
        }

        const insertedProducts = []
        const errors = []

        for(let i = 0; i < csvData.length; i++){
            try {
                const product = csvData[i]
                
                if(!product.name || !product.price || !product.category || !product.subCategory){
                    errors.push({
                        row: i + 2,
                        error: "Missing required fields: name, price, category, subCategory"
                    })
                    continue
                }

                // Look up or create category by name (comma-separated names)
                const categoryNames = product.category.split(',').map(cat => cat.trim())
                const categoryIds = []
                
                for(const catName of categoryNames){
                    let category = await CategoryModel.findOne({ name: catName })
                    if(!category){
                        // Create new category if doesn't exist
                        category = new CategoryModel({ name: catName })
                        await category.save()
                    }
                    categoryIds.push(category._id)
                }

                // Look up or create subcategory by name (comma-separated names)
                const subCategoryNames = product.subCategory.split(',').map(sub => sub.trim())
                const subCategoryIds = []
                
                for(const subName of subCategoryNames){
                    let subCategory = await SubCategoryModel.findOne({ name: subName })
                    if(!subCategory){
                        // Create new subcategory if doesn't exist
                        // Link to first category by default
                        subCategory = new SubCategoryModel({ 
                            name: subName,
                            category: categoryIds
                        })
                        await subCategory.save()
                    }
                    subCategoryIds.push(subCategory._id)
                }

                const newProduct = new ProductModel({
                    name: product.name,
                    description: product.description || "",
                    price: parseFloat(product.price),
                    discount: product.discount ? parseFloat(product.discount) : 0,
                    stock: product.stock ? parseInt(product.stock) : 0,
                    unit: product.unit || "piece",
                    image: product.image ? product.image.split(',').map(img => img.trim()) : [],
                    category: categoryIds,
                    subCategory: subCategoryIds,
                    uploadedBy: request.userId
                })

                const saved = await newProduct.save()
                insertedProducts.push(saved)
            } catch(err){
                errors.push({
                    row: i + 2,
                    error: err.message
                })
            }
        }

        return response.json({
            message : `Bulk upload completed. ${insertedProducts.length} products inserted`,
            data : {
                inserted: insertedProducts,
                errors: errors,
                insertedCount: insertedProducts.length,
                errorCount: errors.length
            },
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}