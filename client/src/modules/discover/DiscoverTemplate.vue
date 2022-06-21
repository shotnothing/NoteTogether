<template>
  <div>
    <router-view :user="user"></router-view>
  </div>
</template>

<script>
export default {
  name: "DiscoverTemplate",
  props: ["user"],
  data() {
    return {
      user: {}
    }
  }
};
</script>
