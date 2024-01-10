import { Roles } from "src/Roles"

const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
      action: true,
      subject: 'HomePage'
    },
    {
      title: 'Announcements',
      path: '/announcements',
      icon: 'tabler:bell-ringing',
      action: true,
      subject: Roles.CAN_CREATE_ANNOUNCEMENT
    },
    {
      title: 'Users',
      path: '/users',
      icon: 'tabler:users',
      action: true,
      subject: Roles.CAN_VIEW_BRANCH_USERS
    },
    {
      title: 'Roster',
      path: '/roster',
      icon: 'tabler:report',
      action: true,
      subject: Roles.CAN_CREATE_ROSTER
    },
    {
      title: 'Holidays',
      path: '/holidays',
      icon: 'tabler:beach',
      action: true,
      subject: Roles.CAN_VIEW_BRANCH_HOLIDAYS
    },
    {
      title: 'Managements',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Branches',
          path: '/branches',
        },
        {
          title: 'Positions',
          path: '/positions',
        },
      ],
    }
  ]
}

export default navigation
