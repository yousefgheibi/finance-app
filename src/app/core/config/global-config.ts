export class GlobalConfig {
  static apiUrl = 'http://localhost:3000';

  static fiscalYearsOptions = [
    { label: '1405', value: '1405' },
    { label: '1404', value: '1404' },
    { label: '1403', value: '1403' },
    { label: '1402', value: '1402' }
  ]

  static transactionsTypeOptions = [
    { label: 'برداشت', value: 'withdraw' },
    { label: 'واریز', value: 'deposit' }
  ]

  static menuItems = [
    { path: '/dashboard', icon: 'fa-tv', label: 'داشبورد' },
    { path: '/my-transactions', icon: 'fa-file-invoice', label: 'تراکنش‌ها' },
    { path: '/categories', icon: 'fa-list-alt', label: 'دسته بندی‌ها' },
    { path: '/my-credit-cards', icon: 'fa-credit-card', label: 'کارت‌های من' },
    { path: '/profile', icon: 'fa-user-circle', label: 'تنظیمات' },
  ];
}