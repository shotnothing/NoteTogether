<template>
  <div class="container">
    <MarkdownEditor :content="content" :title="title" :loaded="loaded"></MarkdownEditor>
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
