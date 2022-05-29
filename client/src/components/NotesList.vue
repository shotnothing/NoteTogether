<template>

  <v-list two-line>
    <v-list-item-group
      v-model="selected"
      active-class="pink--text"
      multiple
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

              <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text v-text="item.action"></v-list-item-action-text>

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
    </v-list-item-group>
  </v-list>

</template>

<script>
import VueSimplemde from 'vue-simplemde'
export default {
  data() {
    return {
      selected: [2],
      items: [
        {
          action: '2 days ago',
          headline: 'Notes and me',
          subtitle: `Poo poo`,
          title: 'Boon Keng',
        },
        {
          action: '2 hrs ago',
          headline: 'Me and notes',
          subtitle: `Wish I could come, but I'm out of town this weekend.`,
          title: 'User 2',
        },
        {
          action: '6 hrs ago',
          headline: 'Oui oui',
          subtitle: 'Pee Pee',
          title: 'User 3',
        },
        {
          action: '12 hrs ago',
          headline: 'Crossaint',
          subtitle: 'Nteoarfaefasa',
          title: 'User 4',
        },
        {
          action: '18 hrs ago',
          headline: 'Hello',
          subtitle: 'We should eat this',
          title: 'User 5',
        },
      ],
    };
  },
  components: {
    VueSimplemde,
  },
  methods: {
    async uploadNote() {
      let token = localStorage.getItem("jwt");
      console.log(this.mde);
      let response = await this.$http.post(
        "/note/create",
        this.mde,
        { headers: { 'Authorization': token } }
        );
      console.log(response);
    },
  }
};
</script>
