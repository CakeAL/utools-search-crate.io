<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Search from './Search/index.vue';

const route = ref('');
const enterAction = ref({});
const searchString = ref("");

onMounted(() => {
  window.utools.onPluginEnter((action) => {
    route.value = action.code;
    enterAction.value = action;
    window.utools.setSubInput((({ text }) => {
      searchString.value = text;
    }), "包名");
  });
  window.utools.onPluginOut((isKill) => {
    route.value = '';
  });
})
</script>

<template>
  <template v-if="route === 'search'">
    <Search :enterAction="enterAction" :search-string="searchString"></Search>
  </template>
</template>
