<template>
  <div>
    <router-view :user="user"/>
  </div>
</template>

<script>
export default {
  name: "PurchaseTemplate",
  props: ["user"],
  data() {
    return {
      user: {},
    }
  }
};
</script>
