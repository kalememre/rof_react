
const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
      action: true,
      subject: 'can_access_home_page',
    },
    {
      title: 'Announcements',
      path: '/announcements',
      icon: 'tabler:bell-ringing',
      action: true,
      subject: 'can_access_announcement_page',
    },
    {
      title: 'Users',
      path: '/announcements',
      icon: 'tabler:users',
      action: true,
      subject: 'can_see_branch_users',
    },
    {
      title: 'Roster',
      path: '/roster',
      icon: 'tabler:report',
      action: true,
      subject: 'can_access_roster_page',
    },
    {
      title: 'Holidays',
      path: '/holidays',
      icon: 'tabler:beach',
      action: true,
      subject: 'can_access_holiday_page',
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
          title: 'Roles',
          path: '/roles',
        },
      ],
    }
  ]
}

export default navigation
