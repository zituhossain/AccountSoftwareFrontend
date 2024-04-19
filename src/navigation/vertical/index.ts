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
      title: 'User',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'List',
          path: '/apps/user/list'
        },

        {
          title: 'Position',
          path: '/apps/user/position'
        }
      ]
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
          title: 'Contact Person',
          path: '/apps/company/contact-person'
        },
        {
          title: 'Contact Type',
          path: '/apps/company/contact-type'
        },

        {
          title: 'Business Relationship',
          path: '/apps/company/business-relation'
        }
      ]
    },
    {
      title: 'Quotation',
      icon: 'mdi:file-document-outline',
      children: [
        {
          title: 'List',
          path: '/apps/quotation/list'
        }
      ]
    },
    {
      title: 'Accounts',
      icon: 'mdi:account-outline',
      children: [
        {
          title: 'Account Head',
          path: '/apps/accounts/account-head'
        },
        {
          title: 'Journal',
          path: '/apps/accounts/journal'
        },
        {
          title: 'Transaction',
          path: '/apps/accounts/transaction'
        },
        {
          title: 'Account Receivable',
          path: '/apps/accounts/account-receivable'
        },
        {
          title: 'Account Payable',
          path: '/apps/accounts/account-payable'
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
        }
      ]
    }

    // {
    //   title: 'Account Settings',
    //   icon: 'mdi:account-settings-variant',
    //   children: [
    //     {
    //       title: 'Account',
    //       path: '/pages/account-settings/account'
    //     },
    //     {
    //       title: 'Security',
    //       path: '/pages/account-settings/security'
    //     },
    //     {
    //       title: 'Billing',
    //       path: '/pages/account-settings/billing'
    //     },
    //     {
    //       title: 'Notifications',
    //       path: '/pages/account-settings/notifications'
    //     },

    //     {
    //       title: 'Connections',
    //       path: '/pages/account-settings/connections'
    //     }
    //   ]
    // }
  ]
}

export default navigation
