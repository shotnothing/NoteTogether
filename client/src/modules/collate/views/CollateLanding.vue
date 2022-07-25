<template>
  <div class="row justify-content-center">

    <div class="col-3">
      <h4>Input</h4>
      <v-tabs v-model="tabs" background-color="transparent" color="bg-secondary">
          <v-tabs-slider color="bg-secondary"></v-tabs-slider>
          <v-tab>Published</v-tab>
          <v-tab>Unpublished</v-tab>
          <v-tab>Favourited</v-tab>
          <v-tab>Purchased</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">

        <v-tab-item>
          <draggable
            :list="publishedNotes"
            class="list-group"
            @start="dragging = true"
            @end="dragging = false"
            :group="{ name: 'main', pull: 'clone', put: false }"
          >
            <div
              class="list-group-item"
              v-for="element in publishedNotes"
            >
              {{ element.title }}
            </div>
          </draggable>

          <div v-if="!publishedNotes.length" style="background-color: #EFEAD8;"> 
            <br> Nothing to display :(
          </div>   

        </v-tab-item>

        <v-tab-item>
          <draggable
            :list="unpublishedNotes"
            class="list-group"
            @start="dragging = true"
            @end="dragging = false"
            :group="{ name: 'main', pull: 'clone', put: false }"
          >
            <div
              class="list-group-item"
              v-for="element in unpublishedNotes"
            >
              {{ element.title }}
            </div>
          </draggable>

          <div v-if="!unpublishedNotes.length" style="background-color: #EFEAD8;"> 
            <br> Nothing to display :(
          </div>   

        </v-tab-item>

        <v-tab-item>
          <draggable
            :list="favouritedNotes"
            class="list-group"
            @start="dragging = true"
            @end="dragging = false"
            :group="{ name: 'main', pull: 'clone', put: false}"
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
            @start="dragging = true"
            @end="dragging = false"
            :group="{ name: 'main', pull: 'clone', put: false }"
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

  <div class="col-1">
  </div>

  <div class="col-3">
    <h4>Ouput</h4>
    <draggable
      :list="outputNotes"
      class="list-group"
      @start="dragging = true"
      @end="dragging = false"
      :group="{ name: 'main', pull: true, revertClone: true }"
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
        <a href="" id="a"></a>
        Download
    </v-btn>
  </div>

  <div class="col-1 text-center">
    <draggable
      class="list-group"
      @start="dragging = true"
      @end="dragging = false"
      :group="{ name: 'main', pull: true, revertClone: true }"
    >
    <h1>🗑</h1>
    Drag to discard from output!
    </draggable> 
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
      publishedNotes: [],
      unpublishedNotes: [],
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
      this.publishedNotes.push(...createdResponse.data.published);
      this.unpublishedNotes.push(...createdResponse.data.unpublished);
      this.favouritedNotes.push(...favouritedResponse.data.favourited);
      this.purchasedNotes.push(...purchasedResponse.data.purchased);
    },
    discard: function(e) {
      return true;
    },
    download: function(notes) {
      let out = "";
      for (let i in notes) {
        for (let j in notes[i].content) {
          out = out.concat(notes[i].content[j]) + "\n"
        }
      }

      var a = document.getElementById("a");
      var file = new Blob([out], {type: 'text'});
      a.href = URL.createObjectURL(file);
      a.download = "collate.md";
      a.click();
    }
  },
  created() {
    this.getStudyNotes();
  }
};
</script>

<style scoped></style>