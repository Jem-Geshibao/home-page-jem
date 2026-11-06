/**
 * 站内跳转小工具：Hero 按钮与导航栏共用一套逻辑，避免两处各写一遍。
 * 注意这里用 offsetTop 而不是 scrollIntoView —— 页面是单栏长滚动，
 * offsetTop 不依赖滚动容器，滚动距离更可控。
 */

/**
 * 平滑滚动到指定 id 的区块，并把 hash 写回地址栏。
 * 用 replaceState 而非 pushState：锚点跳转不该在浏览器历史里堆记录。
 * @param {Event|null} event 传入时会自动 preventDefault，可直接绑到 <a onClick>
 * @param {string} id 目标区块 id（不带 #）
 */
export function scrollToSection(event, id) {
  event?.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  window.history.replaceState(null, '', `#${id}`)
}
