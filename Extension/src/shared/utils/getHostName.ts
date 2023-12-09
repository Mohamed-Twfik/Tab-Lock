export default function getHostName():string
{  
    if(import.meta.env.MODE === "development"){
        return import.meta.env.VITE_APP_DEV_DEVHOST
    }else{
        return import.meta.env.VITE_APP_PROD_PRODHOST
    }
}