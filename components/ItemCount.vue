<template>
  <vs-input border type="text" name="qty" v-model.prevent="quantity" />
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods:{
    ...mapMutations({
      addToCart: 'cart/add',
      removeFromCart: 'cart/remove',
      setQuantity: 'cart/setQuantity'
    }),
    goToCheckout() {
      // Redirect to signin page if not logged in.
      const isConnected = this.$store.getters['auth/username']
      if (!isConnected) {
        this.$router.push('/users/signin')
        return
      }
      this.$router.push('/orders/checkout')
    }
  },
  computed: {
    quantity: {
      // геттер:
      get: function () {
        return this.item.quantity
      },
      // сеттер:
      set: function (newValue) {
        console.log('set', newValue)
        this.setQuantity({
          item: this.item,
          quantity: Number(newValue) > 0 ? Number(newValue) : 1
        })
      }
    },
    id() {
      return this.$route.params.id
    },
    selectedDishes() {
      return this.$store.getters['cart/items']
    },
    price() {
      return this.$store.getters['cart/price']
    },
    numberOfItems() {
      return this.$store.getters['cart/numberOfItems']
    }
  }
}
</script>
