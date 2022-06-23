<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "PurchaseTemplate",
  props: ["user"],
  data() {
    return {
      user: "",
    }
  }
};
</script>
