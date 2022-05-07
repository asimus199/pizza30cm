<template>
  <div>
    <vs-navbar color="#f6b300" text-white square fixed>
      <template #left>
        <div class="back-btn" @click="back">
          <i class='bx bx-arrow-back'></i> Назад
        </div>
      </template>
    </vs-navbar>
    <div class="container" style="align-items: baseline; padding-top: 30px" :class="{ overflowHidden: active}">
    <div class="uk-grid-item-match uk-flex-middle uk-width-expand@m uk-first-column header-app" style="margin-bottom: 25px">

      <div class="uk-panel uk-width-1-1">

        <h1 class="uk-margin-remove-top uk-margin-remove-bottom uk-text-left@m uk-text-center">        Оформление заказа</h1>
        <div class="uk-h3 uk-font-default uk-margin-remove-top uk-margin-remove-bottom uk-text-left@m uk-text-center">
          Оплата и доставка
        </div>
        <div class="uk-margin">

        </div>

      </div>

    </div>
    <div class="order">
      <div class="order__item">
        <vs-input
            type="text"
            v-model="address"
            placeholder="Введите ваш адрес для доставки"
            label="Адрес в г. Санкт-Петербург *"
        />
      </div>
      <div class="order__item">
        <vs-input
            type="text"
            phoneMask
            v-model="phone"
            placeholder="Введите ваш номер телефона"
            label="Телефон *"
        />
      </div>
      <div class="order__item">
        <vs-input
            type="text"
            v-model="comment"
            placeholder="Например, промокод или особые пожелания отделу доставки"
            label="Комментарии к заказу (необязательно)"
        />
      </div>
      <div class="order__item order__payment">
        <vs-radio v-model="payMethod" val="cod">
          Оплата при получении
        </vs-radio>
        <div class="order__payment-info">
          <p v-if="payMethod === 'cod'">
            Оплата при получении заказа, наличными курьеру или переводом на карту.
          </p>
        </div>
        <vs-radio v-model="payMethod" val="yookassa">
          ЮKassa (банковские карты, электронные деньги и другое)
        </vs-radio>
        <div class="order__payment-info">
          <p v-if="payMethod === 'yookassa'">
            ЮKassa (банковские карты, электронные деньги и другое)
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>

</template>
<style>
.back-btn {
  display: flex;
  align-items: center;
}
.order__item {
  height: 95px;
}
.order {

}

.order__payment-info p {
  transition: 1s; /*Скорость перехода состояния элемента*/
  animation: show 3s 1; /* Указываем название анимации, её время и количество повторов*/
  animation-fill-mode: forwards; /* Чтобы элемент оставался в конечном состоянии анимации */
  animation-delay: 1s; /* Задержка перед началом */
}

.order__payment-info {
  border-bottom: 1px solid #cdcdcd;
  min-height: 10px;
  width: 100%;
}

.order__payment {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  height: 215px;
}
.light .order {
  color: #444;
}
.light .order .vs-input__label--label {
  color: #444;
}
.order .vs-input__label--label {
  color: #ffffff;
}
.order {
  margin-top: 20px;
  color: #ffffff;
  width: 100%;
}

.order input {
  width: 100%;
  color: #444;
  padding: 13px 13px;
  font-size: 16px !important;
}
.order .vs-input-parent {
  color: #444;
}

.order .vs-input {
  border-radius: 5px;
}

.order .vs-input__label {
  font-size: 16px !important;
}

.order .vs-input__label--label {
  left: 5px !important;
  bottom: 5px !important;
}
</style>

<script>
import dishes from "../config/dishes";

import { mapMutations } from 'vuex'
import axios from 'axios'
import ItemCount from "@/components/ItemCount";
export default {
  components: {
    ItemCount
  },
  data () {
    return {
      dishes,
      active: false,
      address: '',
      phone: '',
      comment: '',
      payMethod: 'cod',
      checkbox1: false
    }
  },
  watch: {
    price: function (val) {
      if (window.Telegram.WebApp.MainButton.text.includes('ЗАКАЗАТЬ')) {
        this.configureMainButton({text: this.getOrderButtonName(), color: '#f6b300', onclick: this.mainButtonOrderListener})
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
    back () {
      this.$router.back()
    },
    configureMainButton({text, color, textColor = '#ffffff', onclick}) {
      window.Telegram.WebApp.MainButton.text = text.toUpperCase();
      window.Telegram.WebApp.MainButton.color = color;
      window.Telegram.WebApp.MainButton.textColor = textColor;
      window.Telegram.WebApp.MainButton.onClick(onclick);
    },
    mainButtonOrderConfirmListener () {
      window.Telegram.WebApp.MainButton.showProgress()

      axios.post('https://pizza30cm.herokuapp.com/order', {
        initData: window.Telegram.WebApp.initData,
        order: {
          items: this.selectedDishes,
          price: this.price,
          payMethod: this.payMethod,
          address: this.address,
          comment: this.comment,
          phone: this.phone
        }
      }).then(() => {
        window.Telegram.WebApp.MainButton.hideProgress();
        this.$vs.notification({
          color: 'success',
          onDestroy: () => window.Telegram.WebApp.MainButton.close(),
          position: 'bottom-center',
          title: 'Успешно',
          text: 'Заказ отправлен'
        })

      }).catch(e => {
        this.$vs.notification({
          color: 'danger',
          position: 'bottom-center',
          title: 'Ошибка при оформление заказа',
          text: 'Повторите попытку позже'
        })
        window.Telegram.WebApp.MainButton.hideProgress();
      })
    }
  },
  beforeDestroy() {
    window.Telegram.WebApp.MainButton.offClick(this.mainButtonOrderConfirmListener)
  },
  mounted () {
    this.configureMainButton({text: 'Подтвердить заказ', color: '#f6b300', onclick: this.mainButtonOrderConfirmListener})
    window.Telegram.WebApp.MainButton.show()
  },
}
</script>