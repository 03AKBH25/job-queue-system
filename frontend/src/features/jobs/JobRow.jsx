const JobRow = ({ job }) => {
  const getStatusColor = () => {
    switch (job.status) {
      case "COMPLETED":
        return "green";
      case "FAILED":
        return "red";
      case "ACTIVE":
        return "blue";
      case "WAITING":
        return "gray";
      case "RETRYING":
        return "orange";
      case "CANCELLED":
        return "black";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <p>ID: {job.id}</p>
      <p>Type: {job.type}</p>

      <p style={{ color: getStatusColor() }}>
        Status: {job.status}
      </p>

      {job.status === "ACTIVE" && (
        <p>Progress: {job.progress}%</p>
      )}

      {job.status === "FAILED" && (
        <button>Retry</button>
      )}

      {job.status === "WAITING" && (
        <button>Cancel</button>
      )}
    </div>
  );
};

export default JobRow;