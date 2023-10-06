<template>
  <button @click="oops">{{ text }}</button>
</template>

<script setup lang="ts">
export interface Props {
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: 'btn'
})

function oops() {
  alert('oops')
}
</script>
<script lang="ts">
export default {
  name: 'TButton'
}
</script>
