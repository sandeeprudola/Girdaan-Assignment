export interface Admin {
    id: string;
    name: string;
    email: string;
  }
  
  export interface LoginResponse {
    msg: string;
    token: string;
    admin: Admin;
  }
  
  export interface Student {
    _id: string;
    name: string;
    className: string;
    age: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Task {
    _id: string;
    title: string;
    description: string;
    status: "pending" | "done";
    student: Student;
    createdAt?: string;
    updatedAt?: string;
  }
  export interface StudentsResponse {
    msg: string
    students: Student[]
  }
  export interface CreateStudentResponse {
    msg: string
    student: Student
  }
  
  export interface UpdateStudentResponse {
    msg: string
    student: Student
  }
  
  export interface DeleteStudentResponse {
    msg: string
  }
  export interface TasksResponse {
    msg: string
    tasks: Task[]
  }
  
  export interface CreateTaskResponse {
    msg: string
    task: Task
  }
  
  export interface UpdateTaskResponse {
    msg: string
    task: Task
  }
    