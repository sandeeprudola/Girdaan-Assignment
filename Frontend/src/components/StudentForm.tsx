import { type FormEvent } from "react"

type StudentFormProps = {
  studentName: string
  className: string
  age: string
  editingStudentId: string | null
  isSavingStudent: boolean
  onStudentNameChange: (value: string) => void
  onClassNameChange: (value: string) => void
  onAgeChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancelEdit: () => void
}

function StudentForm({
  studentName,
  className,
  age,
  editingStudentId,
  isSavingStudent,
  onStudentNameChange,
  onClassNameChange,
  onAgeChange,
  onSubmit,
  onCancelEdit,
}: StudentFormProps) {
  return (
    <div className="mt-6 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">
          {editingStudentId ? "Edit Student" : "Add Student"}
        </h2>

        {editingStudentId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border px-4 py-2"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block">Student Name</label>
          <input
            type="text"
            value={studentName}
            onChange={(event) => onStudentNameChange(event.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label className="block">Class</label>
          <input
            type="text"
            value={className}
            onChange={(event) => onClassNameChange(event.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label className="block">Age</label>
          <input
            type="number"
            value={age}
            onChange={(event) => onAgeChange(event.target.value)}
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSavingStudent}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          {isSavingStudent
            ? editingStudentId
              ? "Updating..."
              : "Adding..."
            : editingStudentId
              ? "Update Student"
              : "Add Student"}
        </button>
      </form>
    </div>
  )
}

export default StudentForm
