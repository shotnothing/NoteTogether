<template>
  <div class="row justify-content-center">

    <div class="col-3">
      <h4>Input</h4>
      <v-tabs v-model="tabs" background-color="transparent" color="bg-secondary">
          <v-tabs-slider color="bg-secondary"></v-tabs-slider>
          <v-tab>Created</v-tab>
          <v-tab>Favourited</v-tab>
          <v-tab>Purchased</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">

        <v-tab-item>
          <draggable
            :list="createdNotes"
            class="list-group"
            :move="checkMove"
            @start="dragging = true"
            @end="dragging = false"
            group="main"
          >
            <div
              class="list-group-item"
              v-for="element in createdNotes"
            >
              {{ element.title }}
            </div>
          </draggable>

          <div v-if="!createdNotes.length" style="background-color: #EFEAD8;"> 
            <br> Nothing to display :(
          </div>   

        </v-tab-item>

        <v-tab-item>
          <draggable
            :list="favouritedNotes"
            class="list-group"
            :move="checkMove"
            @start="dragging = true"
            @end="dragging = false"
            group="main"
          >
            <div
              class="list-group-item"
              v-for="element in favouritedNotes"
            >
              {{ element.title }}
            </div>
          </draggable>

          <div v-if="!favouritedNotes.length" style="background-color: #EFEAD8;"> 
            <br> Nothing to display :(
          </div>

        </v-tab-item>

        <v-tab-item>
          <draggable
            :list="purchasedNotes"
            class="list-group"
            :move="checkMove"
            @start="dragging = true"
            @end="dragging = false"
            group="main"
          >
            <div
              class="list-group-item"
              v-for="element in purchasedNotes"
            >
              {{ element.title }}
            </div>
          </draggable>

          <div v-if="!purchasedNotes.length" style="background-color: #EFEAD8;"> 
            <br> Nothing to display :(
          </div>

        </v-tab-item>
      </v-tabs-items>

  </div>

  <div class="col-2">
  </div>

  <div class="col-3">
    <h4>Ouput</h4>
    <draggable
      :list="outputNotes"
      class="list-group"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
      group="main"
    >
      <div
        class="list-group-item"
        v-for="element in outputNotes"
      >
        {{ element.title }}
      </div>
    </draggable>
    <div v-if="!outputNotes.length"> Drag notes here to arrange them!</div>
    <br>
    <v-btn
        :disabled="!outputNotes.length"
        elevation=0
        color="#CE9999"
        @click="download(outputNotes);"
    >
        Download
    </v-btn>

  </div>

  </div>
</template>

<script>
import NotePreview from "@/components/NotePreview.vue";
import draggable from "vuedraggable";
import swal from "sweetalert";

export default {
  name: "CollateLanding",
  components: {
    NotePreview,
    draggable,
  },
  data() {
    return {
      createdNotes: [],
      favouritedNotes: [],
      purchasedNotes: [],
      outputNotes: [],
      address: "study", 
      dragging: false,
      tabs: null,
    };
  },
  methods: {
    async createNote() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/create",
        { title: "Untitled Document", content: "" },
        { headers: { 'Authorization': token } }
      );
      this.$router.push("/edit/"+response.data.note._id);
    },
    async getStudyNotes() {
      let token = localStorage.getItem("jwt");
      let createdResponse = await this.$http.post(
        "/user/notes/created",
        {},
        { headers: { 'Authorization': token } }
      );
      let favouritedResponse = await this.$http.post(
        "/user/notes/favourited",
        {},
        { headers: { 'Authorization': token } }
      );
      let purchasedResponse = await this.$http.post(
        "/user/notes/purchased",
        {},
        { headers: { 'Authorization': token } }
      );
      this.createdNotes.push(...createdResponse.data.notes.notes);
      this.favouritedNotes.push(...favouritedResponse.data.notes.favourited);
      this.purchasedNotes.push(...purchasedResponse.data.notes.purchased);
    },
    add: function() {
      this.list.push({ name: "Juan " + id, id: id++ });
    },
    replace: function() {
      this.list = [{ name: "Edgard", id: id++ }];
    },
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
    download: function(notes) {
      let out = [];
      for (let i in notes) {
        out.push("# " + notes[i].title)
        out.push(notes[i].content)
      }
      console.log(notes[0]);
    }
  },
  created() {
    this.getStudyNotes();
  }
};
</script>

<style scoped></style>