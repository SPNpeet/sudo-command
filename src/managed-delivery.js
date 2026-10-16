export const MANAGED_DELIVERY = {
  th: {
    title: 'ดูแลมากกว่าหน้าเว็บที่ลูกค้าเห็น',
    intro: 'ตัวอย่างงาน Crew Change Tracker — จัดการการเผยแพร่และเชื่อมบริการบน Cloudflare ให้ระบบลูกค้าพร้อมใช้งานร่วมกัน',
    note: 'แสดงเฉพาะขอบเขตการดูแล ไม่เผยแพร่บัญชี URL ระบบ หรือชื่อทรัพยากรภายในของลูกค้า',
    steps: [
      ['APP', 'เผยแพร่แอป', 'นำระบบขึ้น Production บน Workers พร้อมไฟล์หน้าเว็บและปลายทางสำหรับเข้าใช้งาน'],
      ['D1', 'เชื่อมฐานข้อมูล', 'เชื่อม D1 ผ่าน Binding ให้แอปทำงานกับฐานข้อมูลของระบบ'],
      ['R2', 'จัดเก็บไฟล์', 'เชื่อม R2 สำหรับไฟล์ที่ระบบต้องใช้งาน แยกจากฐานข้อมูล'],
      ['LOG', 'ตรวจสอบการทำงาน', 'เปิด Workers Logs เพื่อใช้ตรวจบันทึกและติดตามปัญหาของระบบ'],
    ],
  },
  en: {
    title: 'The work behind the website',
    intro: 'Crew Change Tracker example: managing production deployment and connected Cloudflare services for the client.',
    note: 'Scope overview only. Client accounts, system URLs and internal resource names are not published.',
    steps: [
      ['APP', 'Deploy the app', 'Production deployment on Workers, with frontend assets and an application endpoint.'],
      ['D1', 'Connect the database', 'Bind the application to its D1 database.'],
      ['R2', 'Manage file storage', 'Connect R2 for application files, separate from the database.'],
      ['LOG', 'Review operation', 'Enable Workers Logs for reviewing application activity and investigating issues.'],
    ],
  },
}

export function managedDeliveryHTML() {
  const data = MANAGED_DELIVERY.th
  return `<aside class="s-managed"><p class="s-managed-kicker">SUDO / MANAGED DELIVERY</p><h3>${data.title}</h3><p class="s-managed-intro">${data.intro}</p><ol>${data.steps.map(([tag,title,text])=>`<li><span class="s-managed-tag">${tag}</span><h4>${title}</h4><p>${text}</p></li>`).join('')}</ol><p class="s-managed-note">${data.note}</p></aside>`
}
