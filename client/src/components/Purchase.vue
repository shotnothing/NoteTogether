<template>
  <div class="m-2 bg-white d-flex">
    <div class="text-center flex-fixed-width-item pt-2">
      <a v-on:click="upvote()">
        <span v-if="voteStatus=='upvote'" class="text-secondary">⬆</span>
        <span v-else class="text-dark">⬆</span>
      </a>
      <br>
      {{ votes }}
      <br>
      <a v-on:click="downvote()">
        <span v-if="voteStatus=='downvote'" class="text-secondary">⬇</span>
        <span v-else class="text-dark">⬇</span>
      </a>
    </div>
    <div class="text-truncate py-2">
      <button class="lead">
        <a v-bind:href="'/discover/'+note._id" class="text-dark">{{ note.title }}</a>
        <span v-if="isLocked" class="ml-2">🔒</span>
        <a v-else class="ml-2" v-on:click="favourite()">
          <span v-if="isFavourited" class="text-secondary">★</span>
          <span v-else class="text-dark">☆</span>
        </a>
      </button>
      <div class="font-weight-light small">{{ note.userId.username }}</div>
      <div class="font-weight-light small">{{ this.timeDiff }}</div>
    </div>
    <div class="ml-auto p-2">
      <div v-if="note.votes>100" class="color-gold">
        Gold Tier  
      </div>
      <div v-else-if="note.votes>50" class="color-silver">
        Silver Tier
      </div>
      <div v-else-if="note.votes>20" class="color-bronze">
        Bronze Tier
      </div>
      <div v-else>
        Free Tier
      </div>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotePreview",
  props: ["note", "user"],
  data() {
    return {
      timeDiff: "invalid",
      voteStatus: "clear",
      isLocked: false,
      isFavourited: false,
      votes: 0,
    }
  },
  methods: {
  },
  created() {
  }
};
</script>