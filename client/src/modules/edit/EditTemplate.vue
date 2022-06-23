<template>
    <div>
        <router-view v-if="user._id"></router-view>
        <Login v-else></Login>
    </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
    name: "EditTemplate",
    props: ["user"],
    components: {
        Login,
    }
};
</script>
