export default {
  buildQuery(obj) {
    let s = ""
    for (let k in obj) {
      s += "&" + k + "=" + obj[k]
    }
    s = s.substr(1)
    return s
  },
  genId() {
    return (((Math.random()) * 0x100000) |0)
  }
}
