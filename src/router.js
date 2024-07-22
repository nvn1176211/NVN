import { useUserStore } from './stores/UserStore';
// import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Settings from "./components/Settings.vue"
import Pages from "./components/Pages.vue"
import PageCreation from './components/PageCreation.vue';
import Article from "./components/Article.vue"
import Discussion from "./components/Discussion.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"

const router = createRouter({
    history: createWebHistory(),
    // history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'pages',
            component: Pages
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/create_page',
            name: 'createPage',
            component: PageCreation
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings
        },
        {
            path: '/articles/:id',
            name: 'article',
            component: Article
        },
        {
            path: '/discussions/:id',
            name: 'discussion',
            component: Discussion
        },
    ]
});
// some page need beforeEach fetch auth data for redirect as soon as
router.beforeEach(async (to, from) => {
    if (to.name != 'login' && to.name != 'register' && to.name != 'createPage' && to.name != 'article' && to.name != 'discussion' && to.name != 'settings') {
        return true;
    }
    const userStore = useUserStore();
    let api_token = helpers.getCookie('api_token');
    if (api_token) {
        const response = await fetch(`${env.USERS_VERIFY_API}?api_token=${api_token}`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        const resBodyObj = await response.json();
        switch (response.status) {
            case 200:
                userStore.username = resBodyObj.username;
                userStore.avatar = resBodyObj.avatar;
                userStore.isAdmin = resBodyObj.is_admin;
                userStore.isLoggedIn = true;
                break;
            case 401:
                helpers.setCookieY('api_token', null, -1, '/');
                userStore.$reset();
        }
    }
    if (
        ((to.name == "login" || to.name == 'register') && userStore.isLoggedIn)
        || (to.name == "createPage" && !userStore.isLoggedIn)
        || (to.name == "settings" && !userStore.isLoggedIn)
    ) {
        return { name: 'pages' }
    }
})
// only afterEach fetch auth data in specific pages for increase perfomance
router.afterEach(async (to, from) => {
    if (to.name != 'pages') {
        return false;
    }
    const userStore = useUserStore();
    let api_token = helpers.getCookie('api_token');
    if (api_token) {
        const response = await fetch(`${env.USERS_VERIFY_API}?api_token=${api_token}`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        const resBodyObj = await response.json();
        switch (response.status) {
            case 200:
                userStore.username = resBodyObj.username;
                userStore.avatar = resBodyObj.avatar;
                userStore.isAdmin = resBodyObj.is_admin;
                userStore.isLoggedIn = true;
                break;
            case 401:
                helpers.setCookieY('api_token', null, -1, '/');
                userStore.$reset();
        }
    }
})

export default router;