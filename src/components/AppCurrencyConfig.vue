<template>
  <div class="converter__config">
    <input
      type="number"
      placeholder="Введите количество..."
      v-model="countCurr"
      :disabled="loading"
    />
    <select name="currency" v-model="selectedCurr" :disabled="loading">
      <option disabled selected value="/">Выберите валюту</option>
      <option v-for="item in currencys" :key="item.id" :value="item.id">
        {{ item.currencyName }}&nbsp;{{ item.currencySymbol }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { computed, onMounted, watch } from '@vue/runtime-core'
import { useGetCurrency } from '@/stores/getCurrency'

export default {
  props: ['currencys', 'defaultCurr'],
  setup(props, { emit }) {
    const countCurr = ref()
    const selectedCurr = ref()

    const getCurrency = useGetCurrency()

    onMounted(() => {
      selectedCurr.value = props.defaultCurr

      watch([countCurr, selectedCurr], (newValues) => {
        emit('update:modelValue', {
          countCurr: newValues[0],
          selectedCurr: newValues[1],
        })
      })
    })

    return {
      countCurr,
      selectedCurr,
      loading: computed(() => getCurrency.loading),
    }
  },
}
</script>
