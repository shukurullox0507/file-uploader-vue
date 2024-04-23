import { createApp } from 'vue';
import App from './App.vue';
import 'vue-toast-notification/dist/theme-sugar.css';
import Toast from 'vue-toast-notification';

const app = createApp(App);

app.use(Toast, {
    position: 'bottom-left',
    timeout: 3000,
});

app.mount('#app');
