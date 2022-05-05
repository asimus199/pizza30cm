<template>
  <div class="container" :class="{ overflowHidden: active}">
    <div class="uk-grid-item-match uk-flex-middle uk-width-expand@m uk-first-column header-app" style="margin-bottom: 25px">

      <div class="uk-panel uk-width-1-1">

        <h1 class="uk-margin-remove-top uk-margin-remove-bottom uk-text-left@m uk-text-center">        Пицца 30 см    </h1>
        <div class="uk-h3 uk-font-default uk-margin-remove-top uk-margin-remove-bottom uk-text-left@m uk-text-center">        Бесплатная доставка <br class="uk-hidden@m">от 2-ух пицц<br>по Санкт-Петербургу    </div>
        <div class="uk-margin">

        </div>

      </div>



    </div>
    <div class="dishes" v-for="dish of dishes" :key="dish.id">
      <vs-card>
        <template #title>
          <div class="dish-item">
            <h3>{{ dish.name }} </h3>
            <vs-button v-if="dish.isNew" danger circle size="mini"> Новинка </vs-button>
            <vs-button v-if="dish.isHit" danger circle size="mini"> Хит </vs-button>
          </div>
        </template>
        <template #img>
          <img :src="dish.image" alt="">
        </template>
        <template #text>
          <p>
            {{ dish.description }}
            <span v-if="dish.sauce_is_gift" style="color: red; font-weight: 600;">Фирменный соус в подарок</span>
          </p>
          <div class="btn-add_cart">
            <vs-button @click="addToCartBefore(dish)" v-if="dish.sale_price" circle>
              {{ dish.price }}р. <strike style="margin-left: 5px">{{ dish.sale_price }}р.</strike>
            </vs-button>
            <vs-button @click="addToCartBefore(dish)" v-else circle>
              Добавить за {{ dish.price }}р.
            </vs-button>
          </div>
        </template>
      </vs-card>
    </div>

    <vs-dialog scroll prevent-close full-screen v-model="active" @close="closeCart">
      <template #header>
        <h4 class="not-margin">
          <i style="font-size: 26px" class='bx bx-cart'></i> <b>КОРЗИНА</b>
        </h4>
      </template>

      <div class="cart" v-if="selectedDishes && selectedDishes.length">
        <div class="cart__item" v-for="item of selectedDishes">
          <div class="cart__item-image">
            <img :src="item.image" alt="">
          </div>
          <div class="cart__item-info">
            <div class="cart__item-info_name">
              {{ item.name }}
            </div>
            <div class="cart__item-info_quantity">
              <div class="quantity">
                <vs-button @click="addToCart(item)" size="small">+</vs-button>
                <ItemCount :item="item" />
                <vs-button @click="removeFromCart(item)"  size="small">-</vs-button>
              </div>
            </div>
          </div>
          <div class="cart__item-right">
            <div class="cart__item-price">
              {{ item.quantity * item.price }}₽
            </div>
            <div class="cart__item-action">
              <a @click="deleteCartItem(item)"> Удалить </a>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
      Корзина пуста
      </div>

      <template #footer>

      </template>
    </vs-dialog>
  </div>
</template>
<style>

</style>

<script>
import dishes from "../config/dishes";

import { mapMutations } from 'vuex'
import ItemCount from "@/components/ItemCount";
export default {
  components: {
    ItemCount
  },
  data () {
    return {
      dishes,
      active: false,
      input1: 1,
      input2: '',
      checkbox1: false,
      Telegram: {}
    }
  },
  watch: {
    price: function (val) {
      if (this.Telegram.WebApp.MainButton.text.includes('ЗАКАЗАТЬ')) {
        this.configureMainButton({text: this.getOrderButtonName(), color: '#f6b300', onclick: this.mainButtonClickListener})
      }
    }
  },
  computed: {
    selectedDishes() {
      return this.$store.getters['cart/items']
    },
    price() {
      return this.$store.getters['cart/price']
    },
    numberOfItems() {
      return this.$store.getters['cart/numberOfItems']
    }
  },
  methods: {
    ...mapMutations({
      addToCart: 'cart/add',
      removeFromCart: 'cart/remove',
      deleteCartItem: 'cart/delete',
      // setQuantity: 'cart/setQuantity'
    }),
    setQuantity (val) {
      console.log(val, this.item, this)
    },

    addToCartBefore (dish) {
      this.addToCart(dish)
      this.configureMainButton({text: this.getCartButtonName(), color: '#f6b300', onclick: this.mainButtonClickListener})
    },
    getCartButtonName () {
      if (this.numberOfItems > 0) {
        return `Корзина (${this.numberOfItems})`
      }
      return 'Корзина'
    },
    getOrderButtonName () {
      return `Заказать - ${this.price}₽`
    },
    closeCart () {
      this.configureMainButton({text: this.getCartButtonName(), color: '#f6b300', onclick: this.mainButtonClickListener})
      document.body.classList.remove('overflowHidden')
    },
    mainButtonOrderListener () {

    },
    configureMainButton({text, color, textColor = '#ffffff', onclick}) {

      if (text.toLowerCase().includes('заказать')) {
        document.body.classList.add('overflowHidden')
      } else if (text.toLowerCase().includes('корзина')) {
        document.body.classList.remove('overflowHidden')
      }
      this.Telegram.WebApp.MainButton.text = text.toUpperCase();
      this.Telegram.WebApp.MainButton.color = color;
      this.Telegram.WebApp.MainButton.textColor = textColor;
      this.Telegram.WebApp.MainButton.onClick(onclick);
    },
    mainButtonClickListener () {
      if (this.Telegram.WebApp.MainButton.text.toLowerCase().includes('корзина')) {
        this.active = true
        this.configureMainButton({text: this.getOrderButtonName(), color: '#f6b300', onclick: this.mainButtonClickListener})
      } else if (this.Telegram.WebApp.MainButton.text.toLowerCase().includes('заказать')) {
        this.$router.push('/order')
      }

    }
  },
  beforeDestroy() {
    this.Telegram.WebApp.MainButton.offClick(this.mainButtonClickListener)
    document.body.classList.remove('overflowHidden')
  },
  mounted () {
    this.Telegram = window.Telegram;
    this.configureMainButton({text: this.getCartButtonName(), color: '#f6b300', onclick: this.mainButtonClickListener})
    this.Telegram.WebApp.MainButton.show()
    // this.Telegram.WebApp.MainButton.showProgress()
  },
}
</script>