import { type FormEvent } from "react"
import type { Student } from "@/types"

type TaskFormProps = {
  taskTitle: string
  taskDescription: string
  selectedStudentId: string
  students: Student[]
  isCreatingTask: boolean
  onTaskTitleChange: (value: string) => void
  onTaskDescriptionChange: (value: string) => void
  onSelectedStudentChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function TaskForm({
  taskTitle,
  taskDescription,
  selectedStudentId,
  students,
  isCreatingTask,
  onTaskTitleChange,
  onTaskDescriptionChange,
  onSelectedStudentChange,
  onSubmit,
}: TaskFormProps) {
  return (
    <div className="mt-6 rounded-lg border p-4">
      <h2 className="text-xl font-semibold">Assign Task</h2>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block">Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(event) => onTaskTitleChange(event.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label className="block">Description</label>
          <textarea
            value={taskDescription}
            onChange={(event) => onTaskDescriptionChange(event.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label className="block">Student</label>
          <select
            value={selectedStudentId}
            onChange={(event) => onSelectedStudentChange(event.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} - Class {student.className}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isCreatingTask || students.length === 0}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          {isCreatingTask ? "Assigning..." : "Assign Task"}
        </button>
      </form>
    </div>
  )
}

export default TaskForm
