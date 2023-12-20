
const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
      action: true,
      subject: 'CAN_VIEW_HOME_PAGE'
    },
    {
      title: 'Announcements',
      path: '/announcements',
      icon: 'tabler:bell-ringing',
      action: true,
      subject: 'can_view_announcement_page',
    },
    {
      title: 'Users',
      path: '/users',
      icon: 'tabler:users',
      action: true,
      subject: 'CAN_VIEW_USERS_PAGE',
    },
    {
      title: 'Roster',
      path: '/roster',
      icon: 'tabler:report',
      action: true,
      subject: 'can_view_roster_page',
    },
    {
      title: 'Holidays',
      path: '/holidays',
      icon: 'tabler:beach',
      action: true,
      subject: 'can_view_holiday_page',
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
