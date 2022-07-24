<template>
  <div class="container">
    <div class="d-flex">
      <div class="flex-fill">
        <SearchResultList :user="user" v-for="note in notes" :note="note"></SearchResultList>
        <h3>Preview:</h3>
        
      </div>
      <div class="m-2">
        <CreditBalance :user="user"></CreditBalance>
        <div class="w-100">Create notes or write reviews to earn credits!</div>
      </div>
    </div>


      <v-tabs v-model="tabs" background-color="transparent" color="bg-secondary">
          <v-tabs-slider color="bg-secondary"></v-tabs-slider>
          <v-tab>Preview</v-tab>
          <v-tab>Reviews</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
          <v-tab-item>

              <div>
                  <div class="m-2 p-2 bg-white border border-secondary" v-html="preview"></div>
              </div>
              
              <div style="text-align: center;"><b> Purchase to unlock the rest of the note!</b></div>
              <br>

          </v-tab-item>
          <v-tab-item>
              <v-form ref="formReview" class="pa-6 pt-6">
                  <v-textarea
                      v-model="textReview"
                      outlined
                      auto-grow
                      color="#CE9999"
                      counter="320" 
                      rows="4"
                      label="Write Review"
                  ></v-textarea>
                  <v-btn
                      :disabled="!textReview"
                      elevation=0
                      color="#CE9999"
                      @click="postReview(textReview); $refs.formReview.reset();"
                  >
                      Post
                  </v-btn>
              </v-form>
              
              <div v-for="review in reviews">
                  <ReviewList :user="user" :review="review"></ReviewList>
              </div>

              <br>
          </v-tab-item>
      </v-tabs-items>

      <br>
      <button
        class="btn btn-secondary btn-block w-25 m-2"
        type="button"
        v-on:click="purchaseNote()"
      >
        Purchase
      </button>
      <br><br>

  </div>
</template>

<script>
import CreditBalance from "@/components/CreditBalance";
import SearchResultList from "@/components/SearchResultList.vue";
import ReviewList from "@/components/ReviewList.vue";
import { marked } from 'marked';
import swal from "sweetalert";

export default {
  name: "Purchase",
  props: ["user"],
  data() {
    return {
      tier: "",
      price: 0,
      data: {},
      notes: [],
      preview: "",
      reviews: [],
      tabs: null,
      textReview: "",
    }
  },
  components: {
    CreditBalance,
    SearchResultList,
    ReviewList,
  },
  methods: {
    async viewNote(){
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/read",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        // swal("Success", "Note has already been purchased or is free", "success");
        this.$router.push("/discover/"+this.$route.params.noteId);
      } catch (err) {
        switch (err.response.status) {
          case 402:
            this.preview = marked(err.response.data.preview);
            this.notes = [{
              title: err.response.data.title,
              userId: {
                username: err.response.data.username,
              },
              dateLastUpdated: err.response.data.dateLastUpdated,
              votes: err.response.data.votes,
              reviews: err.response.data.reviews,
              _id: this.$route.params.noteId
            }];
            this.reviews = err.response.data.reviews;
            break;
          default:
            swal("Error", err.response, "error");
        }
        swal("Error", err, "error");
      }
    },
    async purchaseNote() {
      try {
        let token = localStorage.getItem("jwt");
        let response = await this.$http.post(
          "/note/purchase",
          { noteId: this.$route.params.noteId },
          { headers: { 'Authorization': token } }
        );
        swal("Success", "Purchase Successful", "success");
        let favouriteResponse = await this.$http.post(
          "/note/favourite",
          { noteId: this.$route.params.noteId, action: "favourite" },
          { headers: { 'Authorization': token } }
        );
        this.$router.push("/study/"+this.$route.params.noteId);

      } catch (err) {
        switch(err.request.status) {
          case 405:
            swal("Error", "Not enough credits to purchase this", "error");
            break;
          case 401:
            swal("Error", "Unauthorized or your session has expired! Please relog.", "error");
            break;
          default:
            swal("Error", `Uhh, error {{err.request.status}}`, "error");
        }
      }
    },
    async postReview(value) {
        try {
            let token = localStorage.getItem("jwt");
            let response = await this.$http.post(
                "/review/create", 
                { 
                    noteId: this.$route.params.noteId,
                    content: value,
                }, 
                { headers: { 'Authorization': token } }
            );
            swal("Review Posted!", "Thank you for leaving a review!", "success");
        } catch (err) {
            swal("Error", "Something went wrong\n" + err, "error");
            console.log(err)
        }
      },
  },
  async created() {
    await this.viewNote();
  }
};
</script>