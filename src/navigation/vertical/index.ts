// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      path: '/dashboards'
    },
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Email',
      icon: 'mdi:email-outline',
      path: '/apps/email'
    },
    {
      title: 'Calendar',
      icon: 'mdi:calendar-blank-outline',
      path: '/apps/calendar'
    },
    {
      title: 'Company',
      icon: 'mdi:domain',
      path: '/apps/company',
      children: [
        {
          title: 'List',
          path: '/apps/company/list'
        },
        {
          title: 'Add',
          path: '/apps/company/add'
        }
      ]
    },
    {
      title: 'Invoice',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: 'List',
          path: '/apps/invoice/list'
        },
        {
          title: 'Preview',
          path: '/apps/invoice/preview'
        },
        {
          title: 'Edit',
          path: '/apps/invoice/edit'
        },
        {
          title: 'Add',
          path: '/apps/invoice/add'
        }
      ]
    },
    {
      title: 'User',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'List',
          path: '/apps/user/list'
        }
      ]
    },
    {
      title: 'Roles & Permissions',
      icon: 'mdi:shield-outline',
      children: [
        {
          title: 'Roles',
          path: '/apps/roles'
        },
        {
          title: 'Permissions',
          path: '/apps/permissions'
        }
      ]
    },
    {
      title: 'Account Settings',
      icon: 'mdi:account-settings-variant',
      children: [
        {
          title: 'Account',
          path: '/pages/account-settings/account'
        },
        {
          title: 'Security',
          path: '/pages/account-settings/security'
        },
        {
          title: 'Billing',
          path: '/pages/account-settings/billing'
        },
        {
          title: 'Notifications',
          path: '/pages/account-settings/notifications'
        },

        {
          title: 'Connections',
          path: '/pages/account-settings/connections'
        }
      ]
    }
  ]
}

export default navigation
