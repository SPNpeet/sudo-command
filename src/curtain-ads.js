export const CURTAIN_ADS = {
  src: '/sudo-command/gallery/work-curtain-google-ads-2026-10.png',
  width: 1913, height: 788,
  period: { th: '8–14 ต.ค. 2026', en: '8–14 Oct 2026' },
  title: { th: 'CURTAIN STORY HOME · Google Ads', en: 'CURTAIN STORY HOME · Google Ads' },
  caption: {
    th: 'ภาพจาก Google Ads ช่วง 8–14 ต.ค. 2026 · ไม่แสดงเลขบัญชีและอีเมลลูกค้า · Conversion คือจำนวนที่ระบบบันทึก ไม่ใช่ยอดขายที่ยืนยันแล้ว',
    en: 'Google Ads screen for 8–14 Oct 2026. Client account ID and email are excluded. Recorded conversions are not confirmed sales.',
  },
  metrics: [
    { value: '5,146', th: 'การแสดงผล', en: 'Impressions' },
    { value: '242', th: 'คลิก', en: 'Clicks' },
    { value: '฿2,827.76', th: 'ค่าโฆษณา', en: 'Ad spend' },
    { value: '3', th: 'Conversion', en: 'Conversions' },
    { value: '฿11.68', th: 'CPC เฉลี่ย', en: 'Average CPC' },
  ],
}

export function curtainAdsPreview(lang) {
  return { src: CURTAIN_ADS.src, title: CURTAIN_ADS.title[lang], cap: CURTAIN_ADS.caption[lang], flowOnly: false }
}
