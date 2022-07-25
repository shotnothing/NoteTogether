<template>
    <div class="container">
        <div class="d-flex">
            <div class="flex-fill">
                <v-tabs v-model="tabs" background-color="transparent" color="bg-secondary">
                    <v-tabs-slider color="bg-secondary"></v-tabs-slider>
                    <v-tab>View</v-tab>
                    <v-tab>Reviews</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tabs">
                    <v-tab-item>
                        <div>
                            <SearchResultList :user="user" v-for="note in notes" :note="note"></SearchResultList>
                        </div>
                        <div v-html="content" class="m-2 p-2 bg-white">
                        </div>
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
                            <v-progress-circular
                              indeterminate
                              color="#CE9999"
                              v-if="loading"
                            ></v-progress-circular>

                        </v-form>

                        <div v-for="review in notes[0].reviews">
                            <ReviewList :user="user" :review="review"></ReviewList>
                        </div>
                        <br>
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </div>
        <br>
    </div>
</template>
<script>
import SearchResultList from "@/components/SearchResultList.vue";
import ReviewList from "@/components/ReviewList.vue";
import CreditBalance from "@/components/CreditBalance.vue";
import { marked } from 'marked';
import swal from "sweetalert";

export default {
    name: "DiscoverView",
    props: ["user", "note", "review"],
    components: {
        SearchResultList,
        CreditBalance,
        ReviewList,
    },
    data() {
        return {
            user: {},
            content: "",
            notes: [],
            tabs: null,
            textReview: "",
            loading: false,
        };
    },
    methods: {
        async viewNote() {
            try {
                let token = localStorage.getItem("jwt");
                let response = await this.$http.post(
                    "/note/read", { noteId: this.$route.params.noteId }, { headers: { 'Authorization': token } }
                );
                this.content = marked(response.data.content);
                console.log(response.data);
                this.notes = [{
                    title: response.data.title,
                    userId: {
                        username: response.data.username,
                    },
                    dateLastUpdated: response.data.dateLastUpdated,
                    votes: response.data.votes,
                    favourites: response.data.favourites,
                    tier: response.data.tier,
                    metric: response.data.metric,
                    username: response.data.username,
                    price: response.data.price,
                    isFavourited: response.data.isFavourited,
                    isLocked: response.data.isLocked,
                    voteStatus: response.data.voteStatus,
                    reviews: response.data.reviews,
                    reviewCount: response.data.reviewCount,
                    _id: this.$route.params.noteId
                }];
            } catch (err) {
                switch (err.request.status) {
                    case 402:
                        this.$router.push("/purchase/" + this.$route.params.noteId);
                        break;
                    default:
                        swal("Error", "Something went wrong", "error");
                }
            }
        },
        async postReview(value) {
            try {
                this.loading = true;
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
                this.loading = false;
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
<style scoped></style>