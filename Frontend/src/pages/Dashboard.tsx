import { type FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiRequest } from "@/services/Api"
import type {
  Admin,
  CreateStudentResponse,
  CreateTaskResponse,
  DeleteStudentResponse,
  Student,
  StudentsResponse,
  Task,
  TasksResponse,
  UpdateStudentResponse,
  UpdateTaskResponse,
} from "@/types"

function Dashboard() {
  const navigate = useNavigate()

  const [students, setStudents] = useState<Student[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(true)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const [studentName, setStudentName] = useState("")
  const [className, setClassName] = useState("")
  const [age, setAge] = useState("")
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [isSavingStudent, setIsSavingStudent] = useState(false)

  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [markingTaskId, setMarkingTaskId] = useState<string | null>(null)

  const token = localStorage.getItem("token")
  const adminData = localStorage.getItem("admin")
  const admin: Admin | null = adminData ? JSON.parse(adminData) : null

  const resetStudentForm = () => {
    setStudentName("")
    setClassName("")
    setAge("")
    setEditingStudentId(null)
  }

  const fetchStudents = async () => {
    try {
      const response = await apiRequest<StudentsResponse>("/api/students", {
        method: "GET",
      })

      setStudents(response.students)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Failed to fetch students")
      }
    } finally {
      setIsLoadingStudents(false)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await apiRequest<TasksResponse>("/api/task", {
        method: "GET",
      })

      setTasks(response.tasks)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Failed to fetch tasks")
      }
    } finally {
      setIsLoadingTasks(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/")
      return
    }

    void fetchStudents()
    void fetchTasks()
  }, [token, navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("admin")
    navigate("/")
  }

  const handleSaveStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setIsSavingStudent(true)

    try {
      if (editingStudentId) {
        const response = await apiRequest<UpdateStudentResponse>(
          `/api/students/${editingStudentId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: studentName,
              className,
              age: Number(age),
            }),
          }
        )

        setStudents((currentStudents) =>
          currentStudents.map((student) =>
            student._id === editingStudentId ? response.student : student
          )
        )
      } else {
        const response = await apiRequest<CreateStudentResponse>("/api/students", {
          method: "POST",
          body: JSON.stringify({
            name: studentName,
            className,
            age: Number(age),
          }),
        })

        setStudents((currentStudents) => [response.student, ...currentStudents])
      }

      resetStudentForm()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Failed to save student")
      }
    } finally {
      setIsSavingStudent(false)
    }
  }

  const handleEditStudent = (student: Student) => {
    setStudentName(student.name)
    setClassName(student.className)
    setAge(String(student.age))
    setEditingStudentId(student._id)
    setErrorMessage("")
  }

  const handleDeleteStudent = async (studentId: string) => {
    setErrorMessage("")

    try {
      await apiRequest<DeleteStudentResponse>(`/api/students/${studentId}`, {
        method: "DELETE",
      })

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student._id !== studentId)
      )
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.student?._id !== studentId)
      )

      if (editingStudentId === studentId) {
        resetStudentForm()
      }

      if (selectedStudentId === studentId) {
        setSelectedStudentId("")
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Failed to delete student")
      }
    }
  }

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setIsCreatingTask(true)

    try {
      const response = await apiRequest<CreateTaskResponse>("/api/task", {
        method: "POST",
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          student: selectedStudentId,
        }),
      })

      setTasks((currentTasks) => [response.task, ...currentTasks])
      setTaskTitle("")
      setTaskDescription("")
      setSelectedStudentId("")
      setIsLoadingTasks(true)
      await fetchTasks()
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Failed to create task")
      }
    } finally {
      setIsCreatingTask(false)
    }
  }

  const handleMarkTaskDone = async (taskId: string) => {
    setErrorMessage("")
    setMarkingTaskId(taskId)

    try {
      const response = await apiRequest<UpdateTaskResponse>(`/api/task/${taskId}`, {
        method: "PUT",
      })

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? response.task : task))
      )
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("Failed to update task")
      }
    } finally {
      setMarkingTaskId(null)
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to the admin panel.</p>

      {errorMessage && (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Admin Info</h2>
        <p className="mt-2">Name: {admin?.name}</p>
        <p>Email: {admin?.email}</p>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            {editingStudentId ? "Edit Student" : "Add Student"}
          </h2>

          {editingStudentId && (
            <button
              type="button"
              onClick={resetStudentForm}
              className="rounded-md border px-4 py-2"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSaveStudent} className="mt-4 space-y-4">
          <div>
            <label className="block">Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
            />
          </div>

          <div>
            <label className="block">Class</label>
            <input
              type="text"
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
            />
          </div>

          <div>
            <label className="block">Age</label>
            <input
              type="number"
              value={age}
              onChange={(event) => setAge(event.target.value)}
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
                    onClick={() => handleEditStudent(student)}
                    className="rounded-md border px-4 py-2"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteStudent(student._id)}
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

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Assign Task</h2>

        <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
          <div>
            <label className="block">Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
            />
          </div>

          <div>
            <label className="block">Description</label>
            <textarea
              value={taskDescription}
              onChange={(event) => setTaskDescription(event.target.value)}
              className="mt-1 w-full rounded-md border p-2"
              required
            />
          </div>

          <div>
            <label className="block">Student</label>
            <select
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
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
                    onClick={() => handleMarkTaskDone(task._id)}
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

      <button
        onClick={handleLogout}
        className="mt-6 rounded-md bg-black px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard
