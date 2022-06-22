<template>
  <div class="" href="">
    <a v-bind:href="'/edit/'+note._id">
      <img src="@/assets/SampleThumbnail.png">
      <div class="">
        <div class="text-dark small">{{ note.title }}</div>
        <div class="text-secondary small">{{ note.userId.username }}</div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "NotePreview",
  props: ["note"]
};
</script>