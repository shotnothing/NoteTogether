<template>
  <div class="">
    <img src="@/assets/SampleThumbnail.png">
    <div class="">
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