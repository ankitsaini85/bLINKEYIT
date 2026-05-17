import uploadImageClodinary from "../utils/uploadImageClodinary.js"

const uploadImageController = async(request,response)=>{
    try {
        const file = request.file

        const uploadImage = await uploadImageClodinary(file)

        if(!uploadImage || (!uploadImage.secure_url && !uploadImage.url)){
            return response.status(400).json({
                message : "Upload failed",
                error : true,
                success : false
            })
        }

        return response.json({
            message : "Upload done",
            data : uploadImage,
            success : true,
            error : false
        })
    } catch (error) {
        console.error('[uploadImage] error', error)
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default uploadImageController