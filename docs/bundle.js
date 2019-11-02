!(function() {
  "use strict"
  function t(t, n, e) {
    ;(t /= 255), (n /= 255), (e /= 255)
    const r = Math.max(t, n, e),
      o = Math.min(t, n, e)
    let c = 0
    0 !== r && (c = ((r - o) / r) * 100)
    const u = (function(t, n, e) {
        const r = Math.max(t, n, e),
          o = r - Math.min(t, n, e)
        let c = 0
        return (
          0 === o
            ? (c = 0)
            : r === t
            ? (c = ((n - e) / o) % 6)
            : r === n
            ? (c = (e - t) / o + 2)
            : r === e && (c = (t - n) / o + 4),
          (c *= 60) < 0 && (c += 360),
          Math.round(c)
        )
      })(t, n, e),
      a = 100 * Math.max(t, n, e)
    return [u, Math.round(c), Math.round(a)]
  }
  let n = { "": [0, 0, 0] }
  const e = { contrast: 35 }
  function r(r = "", o = {}) {
    o = Object.assign({}, e, o)
    const c = r + JSON.stringify(o)
    if (n[c]) return n[c]
    if (!r) return n[c]
    const u = (
        16777215 &
        r.split("").reduce((t, n) => {
          const e = n.charCodeAt()
          return e * e * e * e + t
        }, 0)
      )
        .toString(16)
        .toUpperCase(),
      a = "000000".substring(0, 6 - u.length) + u,
      s = parseInt(a, 16),
      i = (s >> 16) & 255,
      d = (s >> 8) & 255,
      h = 255 & s,
      [m, M, g] = t(i, d, h),
      l = (function(t, n, e) {
        const r = (e /= 100) * (n /= 100),
          o = t / 60,
          c = r * (1 - Math.abs((o % 2) - 1))
        let u = [0, 0, 0]
        const a = e - r
        return (u = t
          ? o >= 0 && o <= 1
            ? [r, c, 0]
            : o >= 1 && o <= 2
            ? [c, r, 0]
            : o >= 2 && o <= 3
            ? [0, r, c]
            : o >= 3 && o <= 3
            ? [0, c, r]
            : o >= 4 && o <= 5
            ? [c, 0, r]
            : [r, 0, c]
          : [0, 0, 0]).map(t => Math.round(256 * (t + a)))
      })(m, M, Math.min(g, o.contrast || 35))
    return (n[c] = l), l
  }
  const o = document.getElementById("input"),
    c = document.getElementById("text")
  o.addEventListener("input", function(t) {
    const n = t.target.value
    ;(document.body.style.background = "rgb(" + r(n).join(",") + ")"),
      (c.innerText = n)
  })
})()
//# sourceMappingURL=bundle.js.map
