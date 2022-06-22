<template>
  <div class="container">
    <h3>Create New Note</h3>
    <MarkdownEditor></MarkdownEditor>
  </div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor.vue";

export default {
  name: "CreateView",
  components: {
    MarkdownEditor,
  }
}
</script>

<style scoped></style>
