
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
      title: 'Roster',
      path: '/roster',
      icon: 'tabler:report',
      action: true,
      subject: 'can_access_roster_page',
    },
    {
      title: 'Holidays',
      path: '/leaves',
      icon: 'tabler:beach',
      action: true,
      subject: 'can_access_leave_page',
    }
  ]
}

export default navigation
