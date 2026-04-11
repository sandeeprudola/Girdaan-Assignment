import type { Student } from "@/types"

type StudentListProps = {
  students: Student[]
  isLoadingStudents: boolean
  onEditStudent: (student: Student) => void
  onDeleteStudent: (studentId: string) => void
}

function StudentList({
  students,
  isLoadingStudents,
  onEditStudent,
  onDeleteStudent,
}: StudentListProps) {
  return (
    <div className="mt-6 rounded-lg border p-4">
      <h2 className="text-xl font-semibold">Students</h2>

      {isLoadingStudents && <p className="mt-2">Loading students...</p>}

      {!isLoadingStudents && students.length === 0 && (
        <p className="mt-2">No students found.</p>
      )}

      {!isLoadingStudents && students.length > 0 && (
        <ul className="mt-4 space-y-3">
          {students.map((student) => (
            <li key={student._id} className="rounded-md border p-3">
              <p>
                <strong>Name:</strong> {student.name}
              </p>
              <p>
                <strong>Class:</strong> {student.className}
              </p>
              <p>
                <strong>Age:</strong> {student.age}
              </p>

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => onEditStudent(student)}
                  className="rounded-md border px-4 py-2"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteStudent(student._id)}
                  className="rounded-md bg-red-600 px-4 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default StudentList
