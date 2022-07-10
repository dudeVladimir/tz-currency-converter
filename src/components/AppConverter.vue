<template>
  <app-loader v-if="loadingCurrencys" />
  <div v-else-if="error" class="error">
    {{ error }}
  </div>
  <div class="converter" v-else>
    <app-currency-config
      :currencys="currencyList"
      v-model="topSelect"
      :default-curr="topSelect ?? (local === 'ru' ? 'RUB' : '/')"
    >
      <input
        type="number"
        placeholder="Введите количество..."
        v-model="countCurr"
        :disabled="loading"
    /></app-currency-config>
    <span
      class="converter__change-btn"
      @click="changeCurr(topSelect, bottomSelect)"
      >&nbsp;&#8661;&nbsp;</span
    >
    <app-currency-config
      :currencys="currencyList"
      v-model="bottomSelect"
      :default-curr="bottomSelect ?? '/'"
    >
      <div v-if="activeCurrency && convertValue" class="converter__result">
        <span>
          {{
            convertValue <= 1
              ? convertValue
              : Math.floor(convertValue * 100) / 100
          }}&nbsp;{{ activeCurrency.currencySymbol }}
        </span>
      </div>
      <div class="converter__result nothing" v-else>Результат...</div>
    </app-currency-config>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from '@vue/runtime-core'
import AppCurrencyConfig from './AppCurrencyConfig.vue'
import { useGetCurrency } from '@/stores/getCurrency'
import AppLoader from './AppLoader.vue'

export default {
  setup() {
    const local = navigator.language

    const getCurrency = useGetCurrency()
    const loadingCurrencys = ref(true)
    const countCurr = ref('')

    onMounted(async () => {
      loadingCurrencys.value = true
      await getCurrency.getCurrency()
      loadingCurrencys.value = false
    })

    const topSelect = ref()
    const bottomSelect = ref()

    const convertValue = computed(() => getCurrency.convertValue)

    watch([countCurr, topSelect, bottomSelect], (newValue) => {
      getCurrency.convert(newValue[0], newValue[1], newValue[2])
    })

    const changeCurr = (top, bottom) => {
      if (top === '/' || bottom === '/') return
      topSelect.value = bottom
      bottomSelect.value = top
    }

    return {
      countCurr,
      currencyList: computed(() => getCurrency.currencyList),
      topSelect,
      bottomSelect,
      loadingCurrencys,
      convertValue,
      error: computed(() => getCurrency.error),
      activeCurrency: computed(() => getCurrency.toCurrency),
      local,
      loading: computed(() => getCurrency.loading),
      changeCurr,
    }
  },
  components: { AppCurrencyConfig, AppLoader },
}
</script>
