<template>
  <ion-app>
    <ion-split-pane content-id="main-content" when="(min-width: 850px)">
      <ion-menu content-id="main-content" ref="menu">
        <ion-header>
          <ion-toolbar>
            <ion-title>Music</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-header collapse="condense">
            <ion-toolbar class="transparent">
              <ion-title size="large">Music</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-list lines="none">
            <ion-menu-toggle auto-hide="false">
              <ion-item
                router-link="/browse"
                router-direction="root"
                :class="{ selected: isActive('browse') }"
              >
                <ion-icon :icon="musicalNotes" slot="start"></ion-icon>
                Browse
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle auto-hide="false">
              <ion-item
                router-link="/search"
                router-direction="root"
                :class="{ selected: isActive('search') }"
              >
                <ion-icon :icon="search" slot="start"></ion-icon>
                Search
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle autoHide="false" v-if="isAuthorized">
              <ion-item @click="logout()" lines="none" button="true">
                <ion-icon slot="start" :icon="logOutIcon"></ion-icon>
                Log Out
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle autoHide="false" v-else>
              <ion-item @click="login()" lines="none" button="true">
                <ion-icon slot="start" :icon="logInIcon"></ion-icon>
                Log In
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>

      <div id="main-content" class="route-wrapper">
        <ion-router-outlet />
        <track-player />
      </div>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonMenu,
  IonTitle,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
  IonList,
  IonHeader,
  IonToolbar,
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import TrackPlayer from './components/TrackPlayer.vue';
import {
  musicalNotes,
  search,
  logIn as logInIcon,
  logOut as logOutIcon,
} from 'ionicons/icons';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonTitle,
    IonList,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
    IonSplitPane,
    IonHeader,
    IonToolbar,
    TrackPlayer,
  },
  setup() {
    const mkInstance = (window as any).MusicKit.getInstance();
    const mkEvents = (window as any).MusicKit.Events;
    const isAuthorized = ref(mkInstance.isAuthorized);
    const menu = ref<HTMLIonMenuElement>();
    const route = useRoute();

    const authDidChange = () => (isAuthorized.value = mkInstance.isAuthorized);

    const login = () => mkInstance.authorize();

    const logout = async () => {
      await mkInstance.unauthorize();
      menu.value?.close();
    };
    const isActive = (path) => {
      // let isActive = route.name
      return path === route.name;
    };
    mkInstance.addEventListener(
      mkEvents.authorizationStatusDidChange,
      authDidChange
    );
    return {
      search,
      musicalNotes,
      login,
      logout,
      logInIcon,
      logOutIcon,
      isAuthorized,
      isActive,
    };
  },
});
</script>

<style scoped>
/* ion-footer.mh-footer {                    */
/*   position: absolute;                     */
/*   bottom: 0;                              */
/* }                                         */
/* ion-footer.mh-footer .footer-background { */
/*   z-index: -1 !important;                 */
/* }                                         */

ion-list {
  padding-left: 10px;
  padding-right: 10px;
}

ion-item {
  margin: 10px 0;
  --border-radius: 8px;
}

img {
  -o-object-fit: cover;
  object-fit: cover;
}

.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.8);
  color: white;
  font-weight: 700;
  --color-hover: white;
}
.selected ion-icon {
  color: white;
}

ion-split-pane {
  overflow: hidden;
}

.split-pane-md.split-pane-visible > .split-pane-side {
  max-width: 375px;
}
</style>
