export type Language = 'zh-TW' | 'en';

export const translations = {
  'zh-TW': {
    // Role Selection
    selectRole: '選擇身份',
    boss: '老闆/主管',
    supervisor: '主任管理師',
    manager: '管理師',
    bossDescription: '查看所有數據、管理家庭分配和績效',
    supervisorDescription: '管理旗下管理師和追蹤家庭狀況',
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
    
    // Landing Page
    children_growth_management_system: '兒童成長管理系統',
    professional_growth_tracking_platform: '專業的兒童成長追蹤平台，為醫療管理師量身打造',
    login_to_system: '登入系統',
    children_growth_tracking: '兒童成長追蹤',
    track_height_weight_monthly: '每月記錄身高體重，建立完整成長歷史',
    growth_trends_analysis: '成長趨勢分析',
    visualize_growth_trends: '視覺化分析成長趨勢，掌握發展狀況',
    compliance_monitoring: '合規監控',
    monitor_service_compliance: '監控服務執行狀況，確保家庭追蹤品質',
    performance_analytics: '績效分析',
    detailed_performance_metrics: '詳細的績效指標和跨國數據比較',
    role_based_access: '角色權限管理',
    role_based_access_description: '系統根據您的角色自動提供相應的功能和數據訪問權限',
    boss_manager_role: '老闆/主管',
    boss_role_description: '擁有完整的系統訪問權限，包括所有管理師和主任管理師的數據、跨國趨勢分析、績效管理',
    supervisor_role: '主任管理師',
    supervisor_role_description: '管理旗下的管理師團隊，查看和監督所屬管理師的家庭追蹤情況，但不包含跨國趨勢分析',
    manager_role: '管理師',
    manager_role_description: '直接管理分配的家庭，記錄兒童成長數據，追蹤服務執行狀況',
  },
  'en': {
    // Role Selection
    selectRole: 'Select Role',
    boss: 'Boss/Director',
    supervisor: 'Supervisor',
    manager: 'Manager',
    bossDescription: 'View all data, manage family assignments and performance',
    supervisorDescription: 'Manage your team of managers and track family progress',
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
    
    // Landing Page
    children_growth_management_system: "Children's Growth Management System",
    professional_growth_tracking_platform: 'Professional children growth tracking platform designed for healthcare managers',
    login_to_system: 'Login to System',
    children_growth_tracking: "Children's Growth Tracking",
    track_height_weight_monthly: 'Monthly height and weight tracking with complete growth history',
    growth_trends_analysis: 'Growth Trends Analysis',
    visualize_growth_trends: 'Visualize growth trends and monitor development progress',
    compliance_monitoring: 'Compliance Monitoring',
    monitor_service_compliance: 'Monitor service execution status and ensure family tracking quality',
    performance_analytics: 'Performance Analytics',
    detailed_performance_metrics: 'Detailed performance metrics and cross-country data comparison',
    role_based_access: 'Role-Based Access Control',
    role_based_access_description: 'System automatically provides appropriate features and data access based on your role',
    boss_manager_role: 'Boss/Director',
    boss_role_description: 'Full system access including all managers and supervisors, cross-country trend analysis, and performance management',
    supervisor_role: 'Supervisor',
    supervisor_role_description: 'Manage your team of managers, view and supervise family tracking activities without cross-country trend analysis',
    manager_role: 'Manager',
    manager_role_description: 'Directly manage assigned families, record children growth data, and track service execution status',
  }
};

export function useTranslation(lang: Language) {
  return translations[lang];
}
