export const ROUTES = {
  auth: {
    login: '/(auth)/login',
    signup: '/(auth)/signup',
    onboarding: '/(auth)/onboarding',
  },
  tabs: {
    map: '/(tabs)/',
    explore: '/(tabs)/explore',
    reports: '/(tabs)/reports',
  },
  report: {
    create: '/report/create',
    detail: '/report/[id]',
  }
} as const;