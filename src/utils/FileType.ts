import {ImgUrl, StatusImg} from "@/constants/imgUrl";
import {STATUS} from "@/constants/status";

export const FileType = (file:File) :string => {
    if (file.type.includes('zip')){
        return ImgUrl.zip;
    }else if (file.type.includes('pdf')){
        return ImgUrl.pdf;
    }else if (file.type.includes('sql')){
        return ImgUrl.sql;
    }else if (file.type.includes('html')){
        return ImgUrl.html;
    }
    else if (file.type.includes('jpeg' )|| file.type.includes('png')){
    return URL.createObjectURL(file);
   }
    else{
        return ImgUrl.other;
    }
}
