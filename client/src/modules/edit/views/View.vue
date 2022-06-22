<template>
  <div class="container">
    <MarkdownEditorView></MarkdownEditorView>
  </div>
</template>

<script>
import MarkdownEditorView from "@/components/MarkdownEditorView.vue";

export default {
  name: "CreateView",
  components: {
    MarkdownEditorView,
  }
}
</script>

<style scoped></style>
