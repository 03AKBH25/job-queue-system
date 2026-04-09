import {useJobActions} from "./useJobActions"

const JobRow = ({job, refetch})=>{
  const {handleCancel, handleRetry, loadingId} = useJobActions()

  const statusColorMap = {
    COMPLETED: "green",
    FAILED: "red",
    ACTIVE: "blue",
    WAITING: "yellow",
    RETRYING: "orange",
    CANCELLED: "gray"
  }

  const isLoading = loadingId === job.id

  const onCancel = async() => {
    await handleCancel(job.id);
    refetch()
  }

  const onRetry = async()=>{
    await handleRetry(job.id)
    refetch()
  }

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <p>ID: {job.id}</p>
      <p>Type: {job.type}</p>

      <p style={{ color: statusColorMap[job.status] || "gray" }}>
        Status: {job.status}
      </p>
      {job.status === "ACTIVE" && (
        <p>Progress: {job.progress}%</p>
      )}

      {job.status === "FAILED" && (
        <button onclick={onRetry} disabled={isLoading}>
          {isLoading ? "Retrying...": "Retry"}
        </button>
      )}

      {job.status === "WAITING" &&(
        <button onclick={onCancel} disabled={isLoading}>
          {isLoading ? "Cancelling...": "Cancel"}
        </button>
      )}
    </div>
  )
}

export default JobRow