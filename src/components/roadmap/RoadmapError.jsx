const RoadmapError = ({ message }) => {
  if (!message) return null

  return (
    <div className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4">
      <p className="text-sm text-destructive">
        {message}
      </p>
    </div>
  )
}

export default RoadmapError