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
  avatar: any
  avatarColor: string
  phone: string
  id: number
  username: string
  email: string
  password: string
  organizational_position?: any
  confirmed: any
  company?: string
  image?: string
  signature?: string
  role?: number
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
  attributes: {
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
}

export type ContactPersonType = {
  id?: number
  name: string
  address: string
  email: string
  code: string
  phone: string
  image?: string
  company?: number
  contact_type?: number
  created_user?: number
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
  id?: number
  attributes: {
    head_title: string
    head_code: string
    head_type: string
    status: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export type TransactionType = {
  id?: number
  account_headers: number
  client: number
  payment_option: number
  amount: number
  notes: string
  status: boolean
  company: number
  created_user: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type BusinessRelationType = {
  id?: number
  company?: number
  client?: number
  relation_type?: number
  status: boolean
  created_user?: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export type B2BRelationType = {
  id: number
  title: string
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
  company?: string
  client?: string
  status: boolean
  send_status: boolean
  revision_count: number
  date: Date
  created_user?: string
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
