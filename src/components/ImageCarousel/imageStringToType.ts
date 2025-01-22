import { ImagesType } from "../../components";

export function imageStringToType(images: string[] | undefined): ImagesType[] {
    if (images === undefined) return []
    const fullUrl = (url: string) => {
        if (url.includes('https:/') || url.includes('http:/')) return url
        return `${import.meta.env.VITE_STORAGEIMAGEURL}${url}`
    }

    return images?.map((img) => { return { name: img, url: fullUrl(img), blob: undefined } })
}

export function imageObjectToString(images: ImagesType[] | undefined): string[] {
    if (images === undefined) return []
    const formImgUrl = (theImg: string | undefined, theUrl: string) => {
        if (theImg) return theImg
        if (theUrl.includes(import.meta.env.VITE_STORAGEIMAGEURL)) return theUrl.slice(theUrl.lastIndexOf('/') + 1)
        return theUrl
    }
    return images.map((img) => { return formImgUrl(img.uniqueName, img.url) })
}