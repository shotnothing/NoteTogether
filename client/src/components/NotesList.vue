<template>

  <v-list two-line>

    <v-text-field
      label="Search Field (regex for now)"
      hide-details="auto"
      v-model="searchTerm" 
    ></v-text-field>
    <br>
    <v-btn
    @click.native="refreshNotesList()"
    >Search</v-btn>

    <v-list-item-group
      v-model="selected"
    >
      <template v-for="(item, index) in items">
        <v-list-item :key="item.title">
          <template v-slot:default="{ active }">
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>

              <v-list-item-subtitle
                class="text--primary"
                v-text="item.headline"
              ></v-list-item-subtitle>

              <v-list-item-subtitle v-text="item.userId.username"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text v-text="item.datePublished"></v-list-item-action-text>

              <v-icon
                v-if="!active"
                color="grey lighten-1"
              >
                mdi-star-outline
              </v-icon>

              <v-icon
                v-else
                color="yellow darken-3"
              >
                mdi-star
              </v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider
          v-if="index < items.length - 1"
          :key="index"
        ></v-divider>

      </template>

    <br>
    <v-btn
    @click.native="viewNote()"
    >View</v-btn>

    <br><br>
    <div v-html="selectedBody"></div>

    </v-list-item-group>

  </v-list>

</template>

<script>
import VueSimplemde from 'vue-simplemde';
import { marked } from 'marked';
export default {
  data() {
    return {
      searchTerm: "",
      selected: [ ],
      items: [ ],
      selectedBody: "",
    };
  },
  components: {
    VueSimplemde,
  },
  methods: {
    async refreshNotesList() {
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/search",
        { searchTerm: this.searchTerm },
        { headers: { 'Authorization': token } }
        );
      console.log(response);
      this.items = response.data.searchResults;
    },

    async viewNote(){
      let token = localStorage.getItem("jwt");
      let response = await this.$http.post(
        "/note/read",
        { noteId: this.items[this.selected]._id },
        { headers: { 'Authorization': token } }
        );
      this.selectedBody = response.data.content;
      console.log(marked(this.selectedBody)); // TODO: PREVENT XSS IMPORTANT!!!
      return marked(this.selectedBody);
    }
  }
};
</script>
