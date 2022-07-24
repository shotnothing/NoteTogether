<template>
  <div class="" href="">
    <a v-bind:href="'/'+address+'/'+note._id" class="bg-primary p-2" type="button">
      <img src="@/assets/SampleThumbnail.png">
      <div>
        <div class="text-dark small lead">{{ note.title }}</div>
        <div class="text-secondary small">{{ note.username }}</div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "NotePreview",
  props: ["note", "address"]
};
</script>