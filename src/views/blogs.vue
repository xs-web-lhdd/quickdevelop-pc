<template>
  <div class="">
    <ul>
      <li v-for="(item, index) in 100" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "blogs",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
ul,
li {
  padding: 0;
  margin: 0;
}
</style>
