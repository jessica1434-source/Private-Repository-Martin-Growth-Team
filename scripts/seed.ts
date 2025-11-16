import { db } from "../server/db";
import { managers, families, children, growthRecords } from "../shared/schema";

async function seed() {
  console.log("Starting database seeding...");

  // Clear existing data
  console.log("Clearing existing data...");
  await db.delete(growthRecords);
  await db.delete(children);
  await db.delete(families);
  await db.delete(managers);

  // Create managers (boss, supervisors and regular managers)
  console.log("Creating managers...");
  
  // Boss
  const [boss] = await db.insert(managers).values({
    name: "總經理",
    email: "boss@example.com",
    role: "boss",
    supervisorId: null,
  }).returning();
  
  // Supervisors
  const [supervisor1] = await db.insert(managers).values({
    name: "黃主任",
    email: "supervisor1@example.com",
    role: "supervisor",
    supervisorId: null,
  }).returning();

  const [supervisor2] = await db.insert(managers).values({
    name: "周主任",
    email: "supervisor2@example.com",
    role: "supervisor",
    supervisorId: null,
  }).returning();

  // Regular managers under supervisor1
  const [manager1] = await db.insert(managers).values({
    name: "陳美玲",
    email: "manager1@example.com",
    role: "manager",
    supervisorId: supervisor1.id,
  }).returning();

  const [manager2] = await db.insert(managers).values({
    name: "林志明",
    email: "manager2@example.com",
    role: "manager",
    supervisorId: supervisor1.id,
  }).returning();

  // Regular managers under supervisor2
  const [manager3] = await db.insert(managers).values({
    name: "王小華",
    email: "manager3@example.com",
    role: "manager",
    supervisorId: supervisor2.id,
  }).returning();

  const [manager4] = await db.insert(managers).values({
    name: "張雅婷",
    email: "manager4@example.com",
    role: "manager",
    supervisorId: supervisor2.id,
  }).returning();

  console.log(`Created ${7} managers (1 boss, 2 supervisors, 4 managers)`);

  // Create families
  console.log("Creating families...");
  const [family1] = await db.insert(families).values({
    familyName: "李家",
    country: "Taiwan",
    managerId: manager1.id,
    complianceStatus: "green",
    managerNotes: "進度良好",
  }).returning();

  const [family2] = await db.insert(families).values({
    familyName: "陳家",
    country: "Taiwan",
    managerId: manager1.id,
    complianceStatus: "yellow",
    managerNotes: "需要加強追蹤",
  }).returning();

  const [family3] = await db.insert(families).values({
    familyName: "Tan Family",
    country: "Singapore",
    managerId: manager2.id,
    complianceStatus: "green",
  }).returning();

  const [family4] = await db.insert(families).values({
    familyName: "黃家",
    country: "Malaysia",
    managerId: manager2.id,
    complianceStatus: "red",
    managerNotes: "多次錯過預約",
  }).returning();

  const [family5] = await db.insert(families).values({
    familyName: "Wong Family",
    country: "Brunei",
    managerId: manager3.id,
    complianceStatus: "green",
  }).returning();

  const [family6] = await db.insert(families).values({
    familyName: "劉家",
    country: "Taiwan",
    managerId: manager4.id,
    complianceStatus: "yellow",
  }).returning();

  console.log(`Created ${6} families`);

  // Create children
  console.log("Creating children...");
  const child1 = await db.insert(children).values({
    name: "李小明",
    birthday: "2020-03-15",
    familyId: family1.id,
  }).returning();

  const child2 = await db.insert(children).values({
    name: "李小芳",
    birthday: "2022-07-22",
    familyId: family1.id,
  }).returning();

  const child3 = await db.insert(children).values({
    name: "陳大寶",
    birthday: "2019-11-08",
    familyId: family2.id,
  }).returning();

  const child4 = await db.insert(children).values({
    name: "Tan Wei",
    birthday: "2021-05-12",
    familyId: family3.id,
  }).returning();

  const child5 = await db.insert(children).values({
    name: "黃小龍",
    birthday: "2020-09-30",
    familyId: family4.id,
  }).returning();

  const child6 = await db.insert(children).values({
    name: "Wong Jia",
    birthday: "2022-01-20",
    familyId: family5.id,
  }).returning();

  const child7 = await db.insert(children).values({
    name: "劉小美",
    birthday: "2021-12-05",
    familyId: family6.id,
  }).returning();

  console.log(`Created ${7} children`);

  // Create growth records
  console.log("Creating growth records...");
  let recordCount = 0;
  
  // Child 1 records
  await db.insert(growthRecords).values([
    { childId: child1[0].id, recordDate: "2024-01-15", height: 100.5, weight: 16.2 },
    { childId: child1[0].id, recordDate: "2024-04-15", height: 103.2, weight: 17.1 },
    { childId: child1[0].id, recordDate: "2024-07-15", height: 105.8, weight: 17.8 },
    { childId: child1[0].id, recordDate: "2024-10-15", height: 108.0, weight: 18.5 },
  ]);
  recordCount += 4;

  // Child 2 records
  await db.insert(growthRecords).values([
    { childId: child2[0].id, recordDate: "2024-01-22", height: 85.0, weight: 12.5 },
    { childId: child2[0].id, recordDate: "2024-04-22", height: 87.5, weight: 13.2 },
    { childId: child2[0].id, recordDate: "2024-07-22", height: 89.8, weight: 13.8 },
  ]);
  recordCount += 3;

  // Child 3 records
  await db.insert(growthRecords).values([
    { childId: child3[0].id, recordDate: "2024-02-08", height: 115.0, weight: 21.0 },
    { childId: child3[0].id, recordDate: "2024-05-08", height: 117.5, weight: 21.8 },
    { childId: child3[0].id, recordDate: "2024-08-08", height: 120.0, weight: 22.5 },
  ]);
  recordCount += 3;

  // Child 4 records
  await db.insert(growthRecords).values([
    { childId: child4[0].id, recordDate: "2024-03-12", height: 95.0, weight: 15.0 },
    { childId: child4[0].id, recordDate: "2024-06-12", height: 97.5, weight: 15.8 },
    { childId: child4[0].id, recordDate: "2024-09-12", height: 100.0, weight: 16.5 },
  ]);
  recordCount += 3;

  // Child 5 records
  await db.insert(growthRecords).values([
    { childId: child5[0].id, recordDate: "2024-01-30", height: 102.0, weight: 16.8 },
    { childId: child5[0].id, recordDate: "2024-04-30", height: 104.5, weight: 17.5 },
  ]);
  recordCount += 2;

  // Child 6 records
  await db.insert(growthRecords).values([
    { childId: child6[0].id, recordDate: "2024-02-20", height: 88.0, weight: 13.0 },
    { childId: child6[0].id, recordDate: "2024-05-20", height: 90.5, weight: 13.7 },
    { childId: child6[0].id, recordDate: "2024-08-20", height: 92.8, weight: 14.3 },
  ]);
  recordCount += 3;

  // Child 7 records
  await db.insert(growthRecords).values([
    { childId: child7[0].id, recordDate: "2024-03-05", height: 92.0, weight: 14.0 },
    { childId: child7[0].id, recordDate: "2024-06-05", height: 94.5, weight: 14.7 },
  ]);
  recordCount += 2;

  console.log(`Created ${recordCount} growth records`);
  console.log("Database seeding completed successfully!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
