<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Search</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          enterkeyhint="search"
          placeholder="Artists, Songs, Lyrics, and More"
          showCancelButton="focus"
          :animated="true"
          v-model="searchTerm"
          @ionClear="setClearState()"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item-group v-if="state.collection.songs">
          <ion-item-divider sticky="true">
            <ion-label> Songs </ion-label>
          </ion-item-divider>
          <song-item
            v-for="(song, idx) of state.collection.songs"
            :song="song"
            :key="song.id"
            @click="playSong(idx)"
          >
            <ion-thumbnail slot="start">
              <img
                :src="useFormatArtwork(song.attributes.artwork.url, 60)"
                alt=""
              />
            </ion-thumbnail>
          </song-item>
        </ion-item-group>

        <ion-item-group v-if="state.collection.albums">
          <ion-item-divider sticky="true">
            <ion-label> Albums </ion-label>
          </ion-item-divider>

          <router-link
            v-for="album of state.collection.albums"
            :key="album.id"
            :to="'/album/' + album.id"
          >
            <song-item :song="album">
              <ion-thumbnail slot="start">
                <img
                  :src="useFormatArtwork(album.attributes.artwork.url, 60)"
                  alt=""
                />
              </ion-thumbnail>
            </song-item>
          </router-link>
        </ion-item-group>

        <ion-item-group v-if="state.collection.playlists">
          <ion-item-divider sticky="true">
            <ion-label> Playlists </ion-label>
          </ion-item-divider>
          <router-link
            v-for="playlist of state.collection.playlists"
            :key="playlist.id"
            :to="'/playlist/' + playlist.id"
          >
            <song-item :song="playlist">
              <ion-thumbnail slot="start">
                <img
                  :src="useFormatArtwork(playlist.attributes.artwork.url, 60)"
                  alt=""
                />
              </ion-thumbnail>
            </song-item>
          </router-link>
        </ion-item-group>

        <ion-item-group v-if="state.loading">
          <song-item v-for="song of 20" :key="song"></song-item>
        </ion-item-group>
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
  IonSearchbar,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonThumbnail,
  IonList,
} from "@ionic/vue";
import SongItem from "../components/SongItem.vue";
import { defineComponent, ref, onMounted, watch } from "vue";
import { useFormatArtwork, debounce } from "@/hooks";
import { useRouter, useRoute } from "vue-router";
import { search } from "@/services/musickit";
import { setQueueFromItems } from "@/reactive/player";
type Collection = {
  songs?: any[];
  albums?: any[];
  playlists?: any[];
};
type SearchState = {
  collection: Collection;
  loading: boolean;
  hasError: boolean;
};
export default defineComponent({
  components: {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonButtons,
    IonMenuButton,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonThumbnail,
    SongItem,
    IonList,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const state = ref<SearchState>({
      collection: {},
      loading: false,
      hasError: false,
    });
    const setClearState = () => (state.value = { collection: {}, loading: false, hasError: false });
    const setLoadingState = () => (state.value = { ...state.value, loading: true, hasError: false });
    const setSuccessState = (res: any) => (state.value = {collection: res, loading: false, hasError:false });
    const setErrorState = () => (state.value = { collection: {}, loading: false, hasError: true });
    const writeQuery = (val: string) => router.push({ query: { term: val ?? "" } });

    const searchTerm = ref<string>("");
    onMounted(() => (searchTerm.value = route.query.term as string));

    watch( searchTerm, debounce((term: string) => {
        setLoadingState();
        if (!term) {
          setClearState();
          return;
        }
        writeQuery(term);
        return search(term)
          .then((res) => setSuccessState(res))
          .catch(() => setErrorState());
      }, 1000)
    );

    const playSong = (idx: number) => {
      const songs = [...( state.value.collection.songs as any[])]
      setQueueFromItems(songs, idx);
    };
    return { searchTerm, state, useFormatArtwork, setClearState, playSong };
  },
});
</script>
