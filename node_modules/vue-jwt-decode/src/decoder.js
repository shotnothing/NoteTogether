export default {
  install: function(Vue) {
    Vue.prototype.$jwtDec = this
    Vue.jwtDec = this
  },
  decode:  function(jwt) {
    if(typeof jwt !== 'string' & !jwt instanceof String) return null

    let splitted = jwt.split('.')
    if(splitted.length < 2) return null

    let obj1 = JSON.parse(atob(splitted[0]))
    let obj2 = JSON.parse(atob(splitted[1]))

    return Object.assign({}, obj1, obj2)
  }
}
