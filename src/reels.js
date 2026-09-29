// Original public covers from facebook.com/kp468/reels/; paired with their exact reel.
export const REELS = ["1598407241697023", "2520092948458951", "1588025512967204", "1451404480142880", "2404380603422669", "1271462486050473"].map((id, index) => ({ id, number: String(index + 1).padStart(2, '0'), poster: `/sudo-command/gallery/reels/${id}.jpg`, href: `https://www.facebook.com/reel/${id}` }))

export const ASTRO_REEL = { id: '1064723289865271', poster: '/sudo-command/gallery/reels/1064723289865271.jpg', href: 'https://www.facebook.com/reel/1064723289865271', client: 'โหรา เทรดเดอร์ Astro Trader' }
