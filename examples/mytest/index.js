const app = new Vue({
  el: '#app',
  data () {
    return {
      message: '共点击了0次',
      count: 0,
    }
  },
  watch: {
    message () {
      console.log('侦测到点击！')
    }
  },
  methods: {
    change () {
      // 这里调用的是this.count的proxygetter方法
      // 然后再调用reactiveGetter
      // 然后调用count的setter设置为1
      // 触发reactiveSetter
      this.message = `共点击了${++this.count}次`
      // this.message = `共点击了${++this.count}次`
    }
  }
})