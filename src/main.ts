import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

declare global {
    interface Window {
        initMap: () => void;
        eqfeed_callback: (results: any) => void;
    }
}


createApp(App).use(store).mount('#app');