import { useParams } from 'react-router-dom'

export default function TaskDetail() {
  const { id } = useParams()
  return (
    <div className="task-detail-page">
      <h1>Task Detail for {id}</h1>
    </div>
  )
}
