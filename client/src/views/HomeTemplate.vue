<template>
  <div class="bg-primary text-dark h-100">
    <Navbar></Navbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"
export default {
  name: "HomeTemplate",
  components: {
    Navbar,
  }
};
</script>