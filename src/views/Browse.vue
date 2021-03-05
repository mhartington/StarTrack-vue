<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Browse</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-list-header>
          <h1>Top Albums</h1>
        </ion-list-header>
        <div class="album-grid">
          <template v-if="state.topAlbums.length">
            <router-link
              v-for="(album, idx) of state.topAlbums"
              :key="album.id"
              :to="'/album/' + album.id"
            >
              <album-item :collection="album" :index="idx"></album-item>
            </router-link>
          </template>
          <template v-else>
            <album-item v-for="item of 20" :key="item"></album-item>
          </template>
        </div>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <h1>Top Playlist</h1>
        </ion-list-header>

        <div class="album-grid">
          <template v-if="state.topAlbums.length">
            <router-link
              v-for="(playlist, idx) of state.topPlaylists"
              :key="playlist.id"
              :to="'/playlist/' + playlist.id"
            >
              <album-item :collection="playlist" :index="idx"></album-item>
            </router-link>
          </template>
          <template v-else>
            <album-item v-for="item of 20" :key="item"></album-item>
          </template>
        </div>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <h1>Top Songs</h1>
        </ion-list-header>
        <div class="song-grid">
          <template v-if="state.topSongs.length">
            <song-item
              v-for="(song, idx) of state.topSongs"
              @click="playSongs(idx)"
              :key="song.id"
              :song="song"
              :index="idx"
            >
              <ion-thumbnail slot="start">
                <img
                  :src="useFormatArtwork(song.attributes.artwork.url, 60)"
                  alt="Artwork for Track"
                  loading="lazy"
                />
              </ion-thumbnail>
            </song-item>
          </template>
          <template v-else>
            <song-item v-for="item of 20" :key="item" />
          </template>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonThumbnail,
  IonList,
  IonListHeader,
  IonButtons,
  IonMenuButton,
  onIonViewDidEnter,
} from '@ionic/vue';
import { RouterLink } from 'vue-router';
import { useFormatArtwork } from '../hooks';
import { defineComponent, ref } from 'vue';
import AlbumItem from '../components/AlbumItem.vue';
import SongItem from '../components/SongItem.vue';
import { fetchChart } from '../services/musickit';
import { setQueueFromItems } from '@/reactive/player';
export default defineComponent({
  components: {
    RouterLink,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonThumbnail,
    AlbumItem,
    SongItem,
    IonButtons,
    IonMenuButton,
  },
  setup() {
    const state = ref({
      topAlbums: [],
      topPlaylists: [],
      topSongs: [],
      isLoading: true,
    });

    onIonViewDidEnter(async () => {
      const { songs, albums, playlists } = await fetchChart();
      state.value = {
        topAlbums: albums,
        topPlaylists: playlists,
        topSongs: songs,
        isLoading: false,
      };
    });
    const playSongs = (idx: number) => {
      const songs = [...state.value.topSongs];
      setQueueFromItems(songs, idx);
    };
    return { state, useFormatArtwork, playSongs };
  },
});
</script>
<style scoped>
.album-grid {
  display: grid;
  grid-auto-flow: column dense;
  grid-template-rows: auto auto;
  gap: 16px 32px;
  padding-left: 16px;
  justify-content: left;
  overflow-x: scroll;
  width: 100%;
}
.album-grid::after {
  content: '';
  width: 1px;
  margin-right: -1px;
}

.song-grid {
  overflow-x: scroll;
  display: grid;
  grid-auto-flow: column dense;
  grid-template-rows: auto auto auto auto;
  grid-gap: 16px;
  justify-content: left;
}
.song-grid::after {
  content: '';
  width: 1px;
  margin-right: -1px;
}
.song-grid ion-item {
  width: 350px;
}
</style>
