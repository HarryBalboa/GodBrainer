import { createApp } from 'vue'
import {createPinia} from "pinia";
import './style.css'
import App from './App.vue'
import HomeView from './pages/HomeView.vue'
import GameMasterView from './pages/GameMasterView.vue';
import GameView from './pages/GameView.vue';
import ManagementView from './pages/ManagementView.vue';
import { createMemoryHistory, createRouter } from "vue-router";

const routes = [
    { path: '/', component: HomeView },
    { path: '/game-view', component: GameView },
    { path: '/game-master-view', component: GameMasterView },
    { path: '/management-view', component: ManagementView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app')
