<template>
    <div class="container">
        <div class="d-flex">
            <div class="flex-fill">
                <v-tabs v-model="tabs" background-color="bg-primary" color="bg-secondary">
                    <v-tabs-slider color="bg-secondary"></v-tabs-slider>
                    <v-tab>Study</v-tab>
                    <v-tab>Reviews</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tabs">
                    <v-tab-item>
                        <div>
                            <SearchResultList :user="user" v-for="note in notes" :note="note"></SearchResultList>
                        </div>
                        <div v-html="content" class="m-2 p-2 bg-white border border-secondary">
                        </div>
                    </v-tab-item>
                    <v-tab-item>

                    </v-tab-item>
                </v-tabs-items>
            </div>
            <div class="m-5 mw-25">
                <div><span class="font-weight-bold">Title:</span> <span class="text-light">{{ title }}</span></div>
                <div><span class="font-weight-bold">Contributors:</span> <span class="text-light">{{ username }}</span></div>
                <div><span class="font-weight-bold">Privacy:</span> <span class="text-light">{{ privacy }}</span></div>
            </div>
        </div>
    </div>
</template>
<script>
import SearchResultList from "@/components/SearchResultList.vue";
import { marked } from 'marked';
import swal from "sweetalert";

export default {
    name: "StudyView",
    props: ["user", "note"],
    components: {
        SearchResultList,
    },
    data() {
        return {
            user: {},
            content: "",
            title: "",
            username: "",
            privacy: "",
            tabs: null,
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
                this.title = response.data.title;
                this.username = response.data.username;
                this.privacy = response.data.isPublished ? "Public" : "Private";
                this.notes = [{
                    title: response.data.title,
                    userId: {
                        username: response.data.username,
                    },
                    dateLastUpdated: response.data.dateLastUpdated,
                    votes: response.data.votes,
                    _id: this.$route.params.noteId
                }];
            } catch (err) {
                // this.content = err;
            }
        }
    },
    async created() {
        await this.viewNote();
    }
};
</script>
<style scoped></style>