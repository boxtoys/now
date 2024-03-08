<style scoped lang="scss">
h1 {
  font-weight: 200;
}
</style>

<template>
  <h1 @click="buttonClick">
    {{ $t('welcome') }}
  </h1>
</template>

<script setup lang="ts">
const { locale } = useI18n()

function buttonClick () {
  locale.value = locale.value === 'en' ? 'fr' : 'en'
}
</script>
