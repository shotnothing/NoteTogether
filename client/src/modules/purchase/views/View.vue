<template>
  <div class="container">
    <h3>Purchase Note</h3>
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
  methods: {
  },
  components: {
    Purchase,
  }
}
</script>

<style scoped></style>
