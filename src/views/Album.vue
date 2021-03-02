<template>
  <ion-page>
     <ion-header translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            color="primary"
            defaultHref="/browse"
          ></ion-back-button>
        </ion-buttons>
        <ion-title> {{ state.collection?.attributes.name }} </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <album-header
        :collection="state.collection"
        @playCollection="playSong(0, $event)"
      />
      <template v-if="state.collection">
        <song-item
          v-for="(song, idx) of state.collection?.relationships.tracks.data"
          :key="idx"
          :song="song"
          :index="idx"
          @click="playSong(idx)"
        />
      </template>
      <template v-else>
        <song-item v-for="item of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]" :key="item" />
      </template>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchAlbumOrPlaylist } from '../services/musickit';
import SongItem from '../components/SongItem.vue';
import AlbumHeader from '../components/AlbumHeader.vue';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonTitle,
} from '@ionic/vue';
import { setQueueFromItems } from '@/reactive/player';
export default defineComponent({
  components: {
    IonPage,
    IonContent,
    SongItem,
    AlbumHeader,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonTitle,
  },
  ionViewDidEnter() {
    this.loadCollection();
  },
  setup() {
    const state = ref<{
      collection: any;
      isLoading: boolean;
      hasError: boolean;
    }>({
      collection: null,
      isLoading: true,
      hasError: false,
    });
    const route = useRoute();
    const playSong = (index: number, shuffle = false) => {
      const songs = [...state.value.collection.relationships.tracks.data]
      setQueueFromItems(
        songs,
        index,
        shuffle
      );
    };
    const loadCollection = async () => {
      const { type, id } = route.params;
      const res = await fetchAlbumOrPlaylist(id as string, type as string);
      state.value = { collection: res, isLoading: false, hasError: false };
    };
    return { state, playSong, loadCollection };
  },
});
</script>
<style scoped></style>
