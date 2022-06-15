<template>
  <div class="text-center">
    <img src="@/assets/SampleThumbnail.png">
    <div class="text-center">
      <p>
        {{ note.name }}
        <br/>
        <span class="text-secondary">{{ note.username }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotePreview",
  props: ["note"]
};
</script>