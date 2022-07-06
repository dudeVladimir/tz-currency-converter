<template>
  <app-loader v-if="loading" />
  <div v-else-if="error" class="error">
    {{ error }}
  </div>
  <div class="converter" v-else>
    <app-currency-config
      :currencys="currencyList"
      v-model="topInp"
      default-curr="RUB"
    />
    <span>&nbsp;&#8661;&nbsp;</span>
    <app-currency-config
      :currencys="currencyList"
      v-model="bottomInp"
      default-curr="/"
    />
    <div v-if="activeCurrency && convertValue">
      {{ Math.ceil(convertValue * 100) / 100 }}&nbsp;{{
        activeCurrency.currencySymbol
      }}
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from '@vue/runtime-core'
import AppCurrencyConfig from './AppCurrencyConfig.vue'
import { useGetCurrency } from '@/stores/getCurrency'
import AppLoader from './AppLoader.vue'

export default {
  setup() {
    const getCurrency = useGetCurrency()
    const loading = ref(true)

    onMounted(async () => {
      loading.value = true
      await getCurrency.getCurrency()
      loading.value = false
    })

    const topInp = ref({})
    const bottomInp = ref({})

    const convertValue = computed(() => getCurrency.convertValue)

    watch(topInp, (newValue) => {
      if (newValue.countCurr !== convertValue) {
        getCurrency.convert(
          newValue.countCurr,
          newValue.selectedCurr,
          bottomInp.value.selectedCurr,
          bottomInp.value.countCurr
        )
      }
    })

    watch(bottomInp, (newValue) => {
      if (newValue.countCurr !== convertValue) {
        getCurrency.convert(
          newValue.countCurr,
          newValue.selectedCurr,
          topInp.value.selectedCurr,
          topInp.value.countCurr
        )
      }
    })

    return {
      currencyList: computed(() => getCurrency.currencyList),
      topInp,
      bottomInp,
      loading,
      convertValue,
      error: computed(() => getCurrency.error),
      activeCurrency: computed(() => getCurrency.toCurrency),
    }
  },
  components: { AppCurrencyConfig, AppLoader },
}
</script>
