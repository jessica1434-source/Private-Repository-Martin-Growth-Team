import { db } from "../server/db";
import { managers } from "../shared/schema";

async function addUserAsManager() {
  const email = process.argv[2];
  const role = process.argv[3] || 'boss'; // Default to boss
  const name = process.argv[4] || email;

  if (!email) {
    console.error("使用方式：tsx scripts/add-user.ts <email> [role] [name]");
    console.error("範例：tsx scripts/add-user.ts jessica1434@gmail.com boss \"Jessica 總經理\"");
    console.error("角色選項：boss, supervisor, manager");
    process.exit(1);
  }

  if (!['boss', 'supervisor', 'manager'].includes(role)) {
    console.error("錯誤：角色必須是 boss, supervisor 或 manager");
    process.exit(1);
  }

  try {
    console.log(`正在添加用戶...`);
    console.log(`Email: ${email}`);
    console.log(`角色: ${role}`);
    console.log(`名稱: ${name}`);

    const [newManager] = await db.insert(managers).values({
      email,
      name,
      role: role as 'boss' | 'supervisor' | 'manager',
      supervisorId: null,
      userId: null,
    }).returning();

    console.log('\n✅ 成功添加用戶到數據庫！');
    console.log('Manager ID:', newManager.id);
    console.log('\n下一步：');
    console.log('1. 使用此 email 登入系統');
    console.log('2. 系統會自動關聯您的帳號');
    console.log('3. 您將可以訪問對應角色的儀表板');
  } catch (error) {
    console.error('錯誤：', error);
    process.exit(1);
  }

  process.exit(0);
}

addUserAsManager();
