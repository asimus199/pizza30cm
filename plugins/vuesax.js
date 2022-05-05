import Vue from 'vue'
import Vuesax from 'vuesax'
import '@/static/vuesax.css'
import 'vuesax/dist/vuesax.css'
import 'boxicons/css/boxicons.min.css'

Vue.directive('phone', {
  bind(el) {
    function replaceNumberForInput(value) {
      let val = ''
      const x = value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/)

      console.log('replaceNumberForInput', x, !x[2] && x[1] !== '')
      if (!x[2] && x[1] !== '') {
        val = x[1] === '7' ? '+' + x[1] : '+7' + x[1]
      } else {
        val = !x[3] ? '+' + x[1] + x[2] : '+' + x[1] + '(' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '')
      }

      return val
    }

    function replaceNumberForPaste(value) {
      const r = value.replace(/\D/g, '')
      let val = r
      if (val.charAt(0) === '7') {
        val = '+7' + val.slice(1)
      }
      return replaceNumberForInput(val)
    }

    el.oninput = function(e) {
      if (!e.isTrusted) {
        return
      }
      this.value = replaceNumberForInput(this.value)
    }

    el.onpaste = function() {
      setTimeout(() => {
        const pasteVal = el.value
        this.value = replaceNumberForPaste(pasteVal)
      })
    }

  }
})

Vue.use(Vuesax, {
  colors: {
    primary: '#f6b300'
  }
})
