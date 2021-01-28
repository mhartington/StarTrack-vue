import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';

import App from './App.vue';
import router from './router';

import '@ionic/vue/css/ionic.bundle.css';
import './theme/variables.css';

function setupMusicKit() {
  (window as any).MusicKit.configure({
    developerToken: process.env.VUE_APP_MUSICKIT_TOKEN,
    app: {
      name: 'Star Track Vue',
      build: '1.0',
    },
  });
}

setupMusicKit();

const app = createApp(App).use(IonicVue).use(router);
router.isReady().then(() => app.mount('#app'));
