import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import uploadImage from "../common/aws";

const uploadimageByFile = async (e)=>{
    return uploadImage(e).then(url=>{
      if(url){
        return {
          success: 1,
          file: { url }
        }
      }
    })
}

const uploadImageByUrl = async (e) => {
  let link = new Promise((resolve, reject) => {
    try {
        resolve(e)
    } catch (error) {
        reject(error)
    }
  })

    return link.then(url=>{
        return {
            success: 1,
            file: { url }
        }
    });
}

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader:{
               uploadByUrl: uploadImageByUrl,
               uploadByFile: uploadimageByFile
            },
        },
    },
    header: {
        class: Header,
        config:{
        placeholder: "Enter a header",
        levels: [2, 3, 4],
        defaultLevel: 3,
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
       
    
    },
    marker: Marker,
    inlineCode: InlineCode,
    };
