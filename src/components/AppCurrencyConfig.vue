<template>
  <div class="converter__config">
    <slot />
    <select name="currency" v-model="selectedCurr" :disabled="loading">
      <option disabled value="/">Выберите валюту</option>
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
    const selectedCurr = ref()

    const getCurrency = useGetCurrency()

    const defaultCurr = computed(() => props.defaultCurr)

    onMounted(() => {
      selectedCurr.value = props.defaultCurr
      watch(defaultCurr, (newValue) => {
        selectedCurr.value = newValue
      })
    })

    watch(selectedCurr, (newValue) => {
      emit('update:modelValue', newValue)
    })

    return {
      selectedCurr,
      loading: computed(() => getCurrency.loading),
      defaultCurr,
    }
  },
}
</script>
