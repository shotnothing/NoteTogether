<template>
  <div>
    <router-view v-if="user._id" :user="user"/>
    <Login v-else></Login>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
  name: "PurchaseTemplate",
  props: ["user"],
  data() {
    return {
      user: {},
    }
  },
  components: {
    Login,
  }
};
</script>
