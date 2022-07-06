<template>
  <main>
    <div class="box">
      <h1>Конвертер валют</h1>
      <app-converter />
    </div>
  </main>
</template>

<script>
import AppConverter from './components/AppConverter.vue'
export default {
  name: 'App',
  components: { AppConverter },
}
</script>
