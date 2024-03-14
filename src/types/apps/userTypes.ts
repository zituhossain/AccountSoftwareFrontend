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
  name: string
  address: string
  email: string
  code: string
  phone: string
  status: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export type ContactPersonType = {
  id: number
  name: string
  address: string
  email: string
  code: string
  phone: string
  image: string
  company_id: number
  contact_type: number
  status: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export type ContactType = {
  id: number
  title: string
  status: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export type BusinessRelationType = {
  id: number
  attributes: {
    company_id: number
    business_contact_id: number
    relation_type: number
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export type QuotationFromStrapi = {
  id: number
  quotation_no: string
  subject: string
  supplier_rate: number
  top4_rate: number
  no_of_trailers: number
  overweight: number
  lc_number: string
  bl_number: string
  remarks: string
  status: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
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
