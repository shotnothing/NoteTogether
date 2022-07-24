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
                                text-color="bg-white"
                                @click="postReview(textReview); $refs.formReview.reset();"
                            >
                                Post
                            </v-btn>
                        </v-form>

                        <div v-for="review in notes[0].reviews">
                            <ReviewList :user="user" :review="review"></ReviewList>
                        </div>
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </div>
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
                this.notes = [{
                    title: response.data.title,
                    userId: {
                        username: response.data.username,
                    },
                    dateLastUpdated: response.data.dateLastUpdated,
                    votes: response.data.votes,
                    tier: response.data.tier,
                    isFavourited: response.data.isFavourited,
                    isLocked: response.data.isLocked,
                    price: response.data.price,
                    voteStatus: response.data.voteStatus,
                    reviews: response.data.reviews,
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
                let token = localStorage.getItem("jwt");
                let response = await this.$http.post(
                    "/note/read", 
                    { 
                        noteId: this.$route.params.noteId,
                        title: "nondescript", // PLACEHOLDER
                        content: value,
                    }, 
                    { headers: { 'Authorization': token } }
                );
                swal("Review Posted!", value, "success");
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