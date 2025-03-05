<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { Crate } from "../entity";

const props = defineProps({
  enterAction: {
    type: Object,
    required: true
  },
  searchString: {
    type: String,
    required: true
  }
});
const cratesData = ref<Crate[]>([]);
const showCopied = ref(false);
let timeoutId: number | undefined;

watch(() => props.searchString, async (newSearchString) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(async () => {
    if (newSearchString.trim() !== "") {
      await fetchCratesData(newSearchString);
    } else {
      cratesData.value = [];
    }
  }, 200);

}, { immediate: true });

const fetchCratesData = async (query: string) => {
  const url = `https://crates.io/api/v1/crates?page=1&per_page=50&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      cratesData.value = data.crates;
    } else {
      console.error('请求失败:', response.statusText);
    }
  } catch (error) {
    console.error('请求错误:', error);
  }
};

const crateStableVersion = (crate: Crate) => {
  if (crate.max_stable_version !== null) {
    return `v${crate.max_stable_version}`;
  }
  return "";
};

const openUrl = (crate: Crate) => {
  utools.shellOpenExternal(`https://crates.io/crates/${crate.id}`);
}

const copyDependence = (crate: Crate) => {
  utools.copyText(`${crate.id} = "${crate.max_stable_version !== null ? crate.max_stable_version : ""}"`);
  showCopied.value = true;
  setTimeout(() => {
    showCopied.value = false;
  }, 1500); // 1.5秒后隐藏提示

}
</script>

<template>
  <div>
    <div v-for="crate in cratesData" :key="crate.id" class="line-box">
      <div class="left-part" @click="copyDependence(crate)">
        <p class="first-line"><b>{{ crate.name }}</b> {{ crateStableVersion(crate) }} <span style="color: #D30300;">{{
          crate.yanked ? "yanked" : "" }}</span></p>
        <p class="description">{{ crate.description }}</p>
      </div>
      <span class="download-label">
        {{ new Intl.NumberFormat().format(crate.downloads) }} ⬇️
        <div class="link-label" @click="openUrl(crate)">🔗</div>
      </span>
    </div>
    <div v-if="showCopied" class="copied-toast">已复制</div>
  </div>
</template>

<style>
.line-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh / 10);
  min-height: 50px;
  padding: 0 5px;
  box-shadow: inset 0 0 0 1px #ccc;
}

.left-part {
  width: 70%;
  height: 50px;
}

.left-part:hover {
  cursor: pointer;
  background-color: #ccc;
  transition: 0.2s ease-in-out;
}

.first-line {
  line-height: 1.5em;
  margin: 0;
  padding: 0;
  font-size: 1.2em;
}

.description {
  margin: 0;
  padding: 0;
  font-size: 1em;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.download-label {
  float: right;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.link-label {
  margin-left: 10px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}

.link-label:hover {
  cursor: pointer;
  background-color: #ccc;
  transition: 0.2s ease-in-out;
}

.copied-toast {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 125, 42, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  animation: fadeOut 1.5s ease-in-out;
}

/* 淡出动画 */
@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
