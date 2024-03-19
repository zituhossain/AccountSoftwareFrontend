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
  organizational_position: {
    title: string
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

export type UserPositionType = {
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
  id?: number
  name: string
  address: string
  email: string
  code: string
  phone: string
  legal_information: string
  website: string
  logo?: string
  status: boolean
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type ContactPersonType = {
  id?: number
  name: string
  address: string
  email: string
  code: string
  phone: string
  image?: string
  company_id?: number
  contact_type?: number
  status: boolean
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
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
  head_title: string
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

export type QuotationType = {
  id?: number
  quotation_no: string
  subject: string
  client_rate: number
  our_rate: number
  no_of_items: number
  overweight: number
  lc_number: string
  bl_number: string
  remarks: string
  business_contact: string
  status: boolean
  send_status: boolean
  revision_count: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
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
