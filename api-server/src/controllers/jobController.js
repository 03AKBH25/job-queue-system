import { createJobService } from "../services/jobServices.js"
import { getJobByIdService } from "../services/jobServices.js"

export const createJob = async (req, res) => {
  try {

    console.log("📥 Job creation request received")

    const { type, payload } = req.body

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Job type is required"
      })
    }

    const job = await createJobService(type, payload)

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job
    })

  } catch (error) {

    console.error("❌ Controller error:", error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}

export const getJobById = async(req, res)=>{
  try{
    const {id} = req.params
    const job = await getJobByIdService(id)
    return res.status(200).json({
      success: true,
      data: job
    })
  }catch(error){
    console.error("❌ GetJob Controller error:", error)
    return res.status(404).json({
      success: false,
      message: error.message
    })
  }
}