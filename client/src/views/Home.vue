<template>
  <div class="container-fluid" style="height:100%">
    <section class="text-center align-items-center flex-column m-auto" style="height:100%">
      <h4 class="lead w-50 m-auto text-center">
        Welcome to NoteTogether, {{ user.username }}! NoteTogether is a note-sharing platform where users can interact with notes in various ways.
        In essence, after registering on our application, users can create notes and either choose to publish them or keep them private. 
        Through the use of search terms and tags, users can <a href="/discover">discover new notes</a> published by others, which could be added to their collection. 
        Users can then study the notes that they have saved, leaving reviews by commenting or simply up/downvoting the notes. 
        Through a GitHub-style version control/forking system, we also allow users to <a href="/edit">edit notes</a> made by others. 
        Users can also collate sections from different notes to produce cheatsheets, which themselves can also be shared. 
        Surrounding all these will be a credit system which encourages the active use of the platform, keeping its content fresh and dynamic.
        <a v-if="!user._id" href="/user/login">Please log in before using this site!</a>
      </h4>
      <br>
      <h1>Resources</h1>
      <h4 class="lead w-50 m-auto text-center">
        <a href="https://github.com/shotnothing/NoteTogether">GitHub</a>
      </h4>
    </section>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: ["user"]
};
</script>

<style scoped></style>