import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController, deleteProductDetails, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, searchProduct, updateProductDetails, bulkUploadProductsController, getProductsByAdminController } from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'
import { superadmin } from '../middleware/SuperAdmin.js'


const productRouter = Router()

productRouter.post("/create",auth,admin,createProductController)
productRouter.post('/get',getProductController)
productRouter.post('/admin-products',auth,superadmin,getProductsByAdminController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-pruduct-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.post('/bulk-upload',auth,admin,bulkUploadProductsController)

//update product
productRouter.put('/update-product-details',auth,admin,updateProductDetails)

//delete product
productRouter.delete('/delete-product',auth,admin,deleteProductDetails)

//search product 
productRouter.post('/search-product',searchProduct)

export default productRouter