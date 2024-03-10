// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
}

export type UsersTypeFromStrapi = {
  id: number
  username: string
  email: string
  avatar: string
  avatarColor?: ThemeColor
}

export type CompanyTypeFromStrapi = {
  id: number
  attributes: {
    type: string
    name: string
    address: string
    email: string
    code: string
    phone: string
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
    avatar: string
    avatarColor?: ThemeColor
  }
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
