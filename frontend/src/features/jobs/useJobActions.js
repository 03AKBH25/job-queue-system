import {useState}  from 'react'
import {cancelJob, retryJob} from "./jobApi"

export const useJobActions = ()=>{
    const [loadingId, setLoadingId] = useState(null)

    const handleCancel = async(id)=>{
        try{
            setLoadingId(id)
            await cancelJob(id)
        }catch(err){
            console.error(err)
        }finally{
            setLoadingId(null)
        }
    }

    const handleRetry = async(id)=>{
        try{
            setLoadingId(id)
            await retryJob(id)
        }catch(err){
            console.error(err)
        }finally{
            setLoadingId(null)
        }
    }
    return {handleCancel, handleRetry, loadingId}
}