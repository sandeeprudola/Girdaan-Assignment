import type { Task } from "@/types"

type TaskListProps = {
  tasks: Task[]
  isLoadingTasks: boolean
  markingTaskId: string | null
  onMarkTaskDone: (taskId: string) => void
}

function TaskList({
  tasks,
  isLoadingTasks,
  markingTaskId,
  onMarkTaskDone,
}: TaskListProps) {
  return (
    <div className="mt-6 rounded-lg border p-4">
      <h2 className="text-xl font-semibold">Tasks</h2>

      {isLoadingTasks && <p className="mt-2">Loading tasks...</p>}

      {!isLoadingTasks && tasks.length === 0 && (
        <p className="mt-2">No tasks found.</p>
      )}

      {!isLoadingTasks && tasks.length > 0 && (
        <ul className="mt-4 space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="rounded-md border p-3">
              <p>
                <strong>Title:</strong> {task.title}
              </p>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Student:</strong> {task.student?.name ?? "Unknown"}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>

              {task.status === "pending" && (
                <button
                  type="button"
                  onClick={() => onMarkTaskDone(task._id)}
                  disabled={markingTaskId === task._id}
                  className="mt-3 rounded-md bg-green-600 px-4 py-2 text-white"
                >
                  {markingTaskId === task._id ? "Updating..." : "Mark as Done"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList
