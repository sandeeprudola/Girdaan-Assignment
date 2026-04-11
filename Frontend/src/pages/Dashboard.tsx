import { type FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import StudentForm from "@/components/StudentForm"
import StudentList from "@/components/StudentList"
import TaskForm from "@/components/TaskForm"
import TaskList from "@/components/TaskList"
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
  const [successMessage, setSuccessMessage] = useState("")

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

  useEffect(() => {
    if (!successMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage("")
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [successMessage])

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
    void fetchStudents()
    void fetchTasks()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("admin")
    navigate("/")
  }

  const handleSaveStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
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
        setSuccessMessage("Student updated successfully.")
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
        setSuccessMessage("Student added successfully.")
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
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this student?"
    )

    if (!shouldDelete) {
      return
    }

    setErrorMessage("")
    setSuccessMessage("")

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

      setSuccessMessage("Student deleted successfully.")
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
    setSuccessMessage("")
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
      setSuccessMessage("Task assigned successfully.")
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
    setSuccessMessage("")
    setMarkingTaskId(taskId)

    try {
      const response = await apiRequest<UpdateTaskResponse>(`/api/task/${taskId}`, {
        method: "PUT",
      })

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? response.task : task))
      )
      setSuccessMessage("Task marked as done.")
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

      {successMessage && (
        <div className="mt-4 rounded-md border border-green-300 bg-green-50 p-3 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="mt-6 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">Admin Info</h2>
        <p className="mt-2">Name: {admin?.name}</p>
        <p>Email: {admin?.email}</p>
      </div>

      <StudentForm
        studentName={studentName}
        className={className}
        age={age}
        editingStudentId={editingStudentId}
        isSavingStudent={isSavingStudent}
        onStudentNameChange={setStudentName}
        onClassNameChange={setClassName}
        onAgeChange={setAge}
        onSubmit={handleSaveStudent}
        onCancelEdit={resetStudentForm}
      />

      <StudentList
        students={students}
        isLoadingStudents={isLoadingStudents}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      <TaskForm
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        selectedStudentId={selectedStudentId}
        students={students}
        isCreatingTask={isCreatingTask}
        onTaskTitleChange={setTaskTitle}
        onTaskDescriptionChange={setTaskDescription}
        onSelectedStudentChange={setSelectedStudentId}
        onSubmit={handleCreateTask}
      />

      <TaskList
        tasks={tasks}
        isLoadingTasks={isLoadingTasks}
        markingTaskId={markingTaskId}
        onMarkTaskDone={handleMarkTaskDone}
      />

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
