import { v2 as cloudinary } from 'cloudinary';

const requiredCloudVars = [
    'CLODINARY_CLOUD_NAME',
    'CLODINARY_API_KEY',
    'CLODINARY_API_SECRET_KEY'
]

for (const key of requiredCloudVars) {
    if (!process.env[key]) {
        console.error(`[cloudinary] Missing env var ${key}`)
    }
}

cloudinary.config({
    cloud_name : process.env.CLODINARY_CLOUD_NAME,
    api_key : process.env.CLODINARY_API_KEY,
    api_secret : process.env.CLODINARY_API_SECRET_KEY
})

const uploadImageClodinary = async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({ folder : "binkeyit"},(error,uploadResult)=>{
            if(error){
                console.error('[cloudinary] upload error', error)
                return reject(error)
            }
            return resolve(uploadResult)
        }).end(buffer)
    })

    if(!uploadImage || (!uploadImage.secure_url && !uploadImage.url)){
        console.error('[cloudinary] missing secure_url/url in response', uploadImage)
        throw new Error("Cloudinary upload failed")
    }

    return uploadImage
}

export default uploadImageClodinary