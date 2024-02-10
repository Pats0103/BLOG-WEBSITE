import axios from "axios";

const uploadImage = async (image)=>{
    let imgUrl = null;

    await axios.get("/api/upload-url").then(async ({data:{upload_Url}})=>{
     await axios({
        method: "PUT",
        url: upload_Url,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: image,
     }) 
     .then((res)=>{

            imgUrl = upload_Url.split("?")[0];
            
        
        })  
    })

    return imgUrl;

}

export default uploadImage;