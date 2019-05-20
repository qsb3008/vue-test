// 编译器
// 使用 new Compile(el, vm)

class Compile {
  constructor (el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    if (this.$el) {
      // 提取宿主中的模板内容到fragment标签，dom操作效率会提高
      this.$fragment = this.node2Fragment(this.$el)
      // 干两件事
      // 编译模板内容，同时进行依赖收集
      this.compile(this.$fragment)
      this.$el.appendChild(this.$fragment)
    }
  }

  node2Fragment (el) {
    const fragment = document.createDocumentFragment()
    let child
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  compile (el) {
    const childNodes = el.childNodes

    Array.from(childNodes).forEach(node => {
      if (node.nodeType == 1) {
        this.compileElement(node)
        // console.log('编译元素节点' + node.nodeName)
      } else if (this.isInterpolation(node)) {
        // 是否是插值表达式
        // console.log('插值文本' + node.nodeName)
        this.compileText(node)
      }
      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
  isInterpolation (node) {
    // 是文本且是{{}}
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  compileText(node){
    let key = RegExp.$1
    console.log(key, this.$vm)
    node.textContent = this.$vm.$data[RegExp.$1]
  }
  compileElement(){}
}