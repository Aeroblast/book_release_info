<template>
  <span class="creators">
    <span
      class="creator_container"
      v-for="(creator, i) in record.creators"
      :key="creator"
      ><span class="creator_refine">{{ getRefine(i) }}</span
      ><span class="creator_name">{{ creator.replaceAll("\u3000", " ") }}</span
      >&#x3000;</span
    >
  </span>
</template>

<script>
export default {
  name: "DisplayCreators",
  props: {
    record: Object,
  },
  methods: {
    getRefine(i) {
      if (!this.record.creator_refines) return "";
      let s = this.record.creator_refines[i];
      if (!s) return "";
      return s + "・";
    },
  },
};
</script>

<style scoped>
.creator_container {
  display: inline-block;
}
</style>
