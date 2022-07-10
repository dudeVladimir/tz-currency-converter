import { defineStore } from 'pinia'
import axios from 'axios'

export const useGetCurrency = defineStore('getCurrency', {
  state: () => {
    return {
      currencyList: [],
      convertValue: 0,
      lastConvert: {},
      error: null,
      loading: false,
      toCurrency: null,
    }
  },
  actions: {
    async getCurrency() {
      try {
        const { data } = await axios.get(
          'https://free.currconv.com/api/v7/currencies?apiKey=b0e6fafe1652e2fc1ec7'
        )
        this.currencyList = Object.keys(data.results).map((key) => {
          return data.results[key]
        })
      } catch (e) {
        console.log(e.response.data.error)
        this.error =
          e.response.data.error === 'Free API limit reached.'
            ? 'Бесплатный доступ к Currency Converter API закончился. Попробуйте через час.'
            : e.response.data.error
      }
    },
    async convert(count, fromCurrency, toCurrency) {
      this.convertValue = 0
      if (
        !this.lastConvert[`${fromCurrency}_${toCurrency}`] &&
        fromCurrency !== '/' &&
        toCurrency !== '/'
      ) {
        this.loading = true
        try {
          const { data } = await axios.get(`
              https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency},${toCurrency}_${fromCurrency}&compact=ultra&apiKey=b0e6fafe1652e2fc1ec7`)
          this.lastConvert = data
        } catch (e) {
          if (e.response.data.error) {
            this.error =
              e.response.data.error === 'Free API limit reached.'
                ? 'Бесплатный доступ к Currency Converter API закончился. Попробуйте через час.'
                : e.response.data.error
          }
          this.error = e
          return
        }
        this.loading = false
      }
      if (count && this.lastConvert[`${fromCurrency}_${toCurrency}`]) {
        this.convertValue =
          count * this.lastConvert[`${fromCurrency}_${toCurrency}`]
        this.toCurrency = this.currencyList.find((e) => e.id === toCurrency)
      }
    },
  },
})
