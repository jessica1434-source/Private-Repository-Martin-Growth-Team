//todo: remove mock functionality
export const mockManagers = [
  { id: 's1', name: '黃主任', email: 'huang@example.com', role: 'supervisor', supervisorId: null },
  { id: 's2', name: '周主任', email: 'zhou@example.com', role: 'supervisor', supervisorId: null },
  { id: '1', name: '陳美玲', email: 'chen@example.com', role: 'manager', supervisorId: 's1' },
  { id: '2', name: '林志明', email: 'lin@example.com', role: 'manager', supervisorId: 's1' },
  { id: '3', name: '王小華', email: 'wang@example.com', role: 'manager', supervisorId: 's2' },
  { id: '4', name: '張雅婷', email: 'zhang@example.com', role: 'manager', supervisorId: 's2' },
];

export const mockFamilies = [
  { id: 'f1', familyName: '李家', country: 'taiwan', managerId: '1', complianceStatus: 'green', managerNotes: '配合度佳，按時執行' },
  { id: 'f2', familyName: '陳家', country: 'singapore', managerId: '1', complianceStatus: 'yellow', managerNotes: '偶爾忘記紀錄' },
  { id: 'f3', familyName: 'Tan Family', country: 'malaysia', managerId: '2', complianceStatus: 'green', managerNotes: 'Excellent progress' },
  { id: 'f4', familyName: '黃家', country: 'taiwan', managerId: '2', complianceStatus: 'red', managerNotes: '需要更多督促' },
  { id: 'f5', familyName: 'Wong Family', country: 'brunei', managerId: '3', complianceStatus: 'green', managerNotes: 'Very cooperative' },
  { id: 'f6', familyName: '劉家', country: 'taiwan', managerId: '3', complianceStatus: 'yellow', managerNotes: '飲食控制需加強' },
];

export const mockChildren = [
  { id: 'c1', name: '李小明', birthday: '2018-03-15', familyId: 'f1' },
  { id: 'c2', name: '李小芳', birthday: '2020-07-22', familyId: 'f1' },
  { id: 'c3', name: '陳大寶', birthday: '2017-11-08', familyId: 'f2' },
  { id: 'c4', name: 'Tan Wei', birthday: '2019-05-30', familyId: 'f3' },
  { id: 'c5', name: '黃小龍', birthday: '2018-09-12', familyId: 'f4' },
  { id: 'c6', name: 'Wong Ming', birthday: '2019-01-25', familyId: 'f5' },
  { id: 'c7', name: 'Wong Ling', birthday: '2021-06-18', familyId: 'f5' },
  { id: 'c8', name: '劉小美', birthday: '2017-12-03', familyId: 'f6' },
];

export const mockGrowthRecords = [
  { id: 'r1', childId: 'c1', recordDate: '2024-10-15', height: 125.5, weight: 24.3, notes: '' },
  { id: 'r2', childId: 'c1', recordDate: '2024-11-15', height: 126.2, weight: 24.8, notes: '成長良好' },
  { id: 'r3', childId: 'c2', recordDate: '2024-10-15', height: 105.2, weight: 17.5, notes: '' },
  { id: 'r4', childId: 'c3', recordDate: '2024-11-01', height: 132.8, weight: 28.9, notes: '' },
  { id: 'r5', childId: 'c4', recordDate: '2024-10-20', height: 118.5, weight: 22.1, notes: 'Good progress' },
  { id: 'r6', childId: 'c5', recordDate: '2024-09-15', height: 120.3, weight: 23.2, notes: '需要加強運動' },
];
