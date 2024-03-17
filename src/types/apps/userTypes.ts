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
  phone: string
  role: {
    name: string
  }
  email: string
  confirmed: boolean
  companies_id: number
  image: string
  signature: string
  avatar: string
  avatarColor?: ThemeColor
}

export type UserRoleType = {
  id: number
  attributes: {
    title: string
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export type CompanyType = {
  id: number
  name: string
  company_type: string
  address: string
  email: string
  code: string
  phone: string
  logo: string
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
  id?: number
  title: string
  status: boolean
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type AccountHeadType = {
  id: number
  header_name: string
  description: string
  status: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export type BusinessRelationType = {
  id: number
  company_id: number
  business_contact_id: number
  relation_type: number
  status: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export type QuotationFromStrapi = {
  id: number
  quotation_no: string
  subject: string
  supplier_rate: number
  our_rate: number
  no_of_trailers: number
  overweight: number
  lc_number: string
  bl_number: string
  remarks: string
  quotation_image: string
  business_contact_id: number
  status: boolean
  send_status: boolean
  revision_count: number
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
