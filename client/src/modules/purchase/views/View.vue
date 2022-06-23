<template>
  <div class="container">
    <Purchase :user="user"></Purchase>
  </div>
</template>

<script>
import Purchase from "@/components/Purchase.vue";

export default {
  name: "PurchaseView",
  props: ["user"],
  data() {
    return {
      user: {},
    }
  },
  components: {
    Purchase,
  }
}
</script>

<style scoped></style>
