export type Language = 'zh-TW' | 'en';

export const translations = {
  'zh-TW': {
    // Role Selection
    selectRole: '選擇身份',
    boss: '老闆/主管',
    manager: '管理師',
    bossDescription: '查看所有數據、管理家庭分配和績效',
    managerDescription: '記錄和管理您負責的家庭',
    
    // Navigation
    dashboard: '儀表板',
    families: '家庭管理',
    records: '成長紀錄',
    performance: '績效分析',
    settings: '設定',
    
    // Dashboard - Boss
    totalChildren: '總孩子數',
    totalManagers: '總管理師人數',
    highRiskFamilies: '高風險家庭',
    stableFamilies: '穩定達標家庭',
    managerPerformance: '管理師平均月成長績效',
    crossCountryTrends: '跨國群體平均月成長趨勢',
    upcomingBirthdays: '即將到來的生日',
    
    // Status
    red: '高風險',
    yellow: '需關注',
    green: '穩定',
    
    // Countries
    taiwan: '台灣',
    singapore: '新加坡',
    malaysia: '馬來西亞',
    brunei: '汶萊',
    
    // Table Headers
    childName: '孩子姓名',
    familyName: '家庭名稱',
    managerName: '管理師',
    status: '狀態',
    country: '國家',
    birthday: '生日',
    age: '年齡',
    height: '身高',
    weight: '體重',
    lastRecord: '最後紀錄',
    actions: '操作',
    
    // Forms
    addRecord: '新增紀錄',
    date: '日期',
    notes: '備註',
    save: '儲存',
    cancel: '取消',
    edit: '編輯',
    delete: '刪除',
    view: '查看',
    
    // Units
    cm: '公分',
    kg: '公斤',
    years: '歲',
    months: '月',
    
    // Time
    daysUntil: '天後',
    today: '今天',
    
    // Manager Dashboard
    myFamilies: '我的家庭',
    addGrowthRecord: '新增成長紀錄',
    familyStatus: '家庭執行狀況',
    managerNotes: '管理師意見',
    updateStatus: '更新狀態',
    
    // Messages
    noData: '暫無資料',
    loading: '載入中...',
    success: '成功',
    error: '錯誤',
  },
  'en': {
    // Role Selection
    selectRole: 'Select Role',
    boss: 'Boss/Supervisor',
    manager: 'Manager',
    bossDescription: 'View all data, manage family assignments and performance',
    managerDescription: 'Record and manage your assigned families',
    
    // Navigation
    dashboard: 'Dashboard',
    families: 'Families',
    records: 'Growth Records',
    performance: 'Performance',
    settings: 'Settings',
    
    // Dashboard - Boss
    totalChildren: 'Total Children',
    totalManagers: 'Total Managers',
    highRiskFamilies: 'High Risk Families',
    stableFamilies: 'Stable Families',
    managerPerformance: 'Manager Avg. Monthly Performance',
    crossCountryTrends: 'Cross-Country Growth Trends',
    upcomingBirthdays: 'Upcoming Birthdays',
    
    // Status
    red: 'High Risk',
    yellow: 'Needs Attention',
    green: 'Stable',
    
    // Countries
    taiwan: 'Taiwan',
    singapore: 'Singapore',
    malaysia: 'Malaysia',
    brunei: 'Brunei',
    
    // Table Headers
    childName: 'Child Name',
    familyName: 'Family Name',
    managerName: 'Manager',
    status: 'Status',
    country: 'Country',
    birthday: 'Birthday',
    age: 'Age',
    height: 'Height',
    weight: 'Weight',
    lastRecord: 'Last Record',
    actions: 'Actions',
    
    // Forms
    addRecord: 'Add Record',
    date: 'Date',
    notes: 'Notes',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    
    // Units
    cm: 'cm',
    kg: 'kg',
    years: 'yrs',
    months: 'mos',
    
    // Time
    daysUntil: 'days',
    today: 'Today',
    
    // Manager Dashboard
    myFamilies: 'My Families',
    addGrowthRecord: 'Add Growth Record',
    familyStatus: 'Family Status',
    managerNotes: 'Manager Notes',
    updateStatus: 'Update Status',
    
    // Messages
    noData: 'No data available',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
  }
};

export function useTranslation(lang: Language) {
  return translations[lang];
}
