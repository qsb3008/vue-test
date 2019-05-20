class KVue {
  constructor (options) {
    this.$options = options
    this.$data = options.data
    this.observe(this.$data)

    new Watcher()
    this.$data.test
    new Watcher()
    this.$data.foo.bar
  }
  observe (value) {
    if (!value || typeof value !== 'object') {
      return
    }
    // 遍历
    Object.keys(value).forEach(key => {
      // 执行响应式
      this.defineReactive(value, key, value[key])
      // 代理到vm上
      this.proxyData(key)
    })
  }

  proxyData (key) {
    Object.defineProperty(this, key, {
      get () {
        return this[key]
      },
      set (newVal) {
        this.$data[key] = newVal
      }
    })
  }

  defineReactive(obj, key, val) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      get () {
        // 
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set (newVal) {
        if (newVal !== val) {
          val = newVal
          // console.log(`${key}更新了：${newVal}`)
          // 通知依赖
          dep.notify()
        }
      }
    })
    // 递归:解决嵌套对象
    this.observe(val)
  }

}

class Dep {
  constructor () {
    this.deps = []
  }

  addDep (dep) {
    this.deps.push(dep)
  }
  notify () {
    this.deps.forEach(dep => dep.update())
  }
}

class Watcher {
  constructor() {
    Dep.target = this
  }
  update () {
    console.log('属性更新了')
  }
}