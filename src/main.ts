import { createApp } from 'vue'
import {createPinia} from "pinia";
import './style.css'
import App from './App.vue'
import HomeView from './pages/HomeView.vue'
import GameMasterView from './pages/GameMasterView.vue';
import GameView from './pages/GameView.vue';
import ManagementView from './pages/ManagementView.vue';
import { createMemoryHistory, createRouter } from "vue-router";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { GiBrain, FaGamepad, FaUserTie, FaEdit, FaUserAlt, FaQuestionCircle, FaChevronDown, FaTrashAlt, FaTimes    } from "oh-vue-icons/icons";


addIcons(GiBrain, FaGamepad, FaUserTie, FaEdit, FaUserAlt, FaQuestionCircle, FaChevronDown, FaTrashAlt, FaTimes  );

const routes = [
    { path: '/', component: HomeView, name: "home" },
    { path: '/game-view', component: GameView , name: "game"},
    { path: '/game-master-view', component: GameMasterView, name: "master" },
    { path: '/management-view', component: ManagementView, name: "manager" },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

const pinia = createPinia();

createApp(App).component("v-icon", OhVueIcon).use(router).use(pinia).mount('#app')
