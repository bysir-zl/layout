export default {
  check() {
    let token = this.get()
    if (!token) {
      return false
    }
    return true
  },
  save(token) {
    let key = "token_user"

    localStorage.setItem("front_" + key, token)
  },
  get() {

    let key = "token_user"

    return localStorage.getItem("front_" + key)
  },
  logout() {

    let key = "token_user"

    localStorage.setItem("front_" + key, "")
  }
}
