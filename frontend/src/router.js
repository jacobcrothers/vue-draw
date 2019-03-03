import Vue from "vue";
import Router from "vue-router";
import store from "./store";

import Home from "./views/Home.vue";
import Game from "./views/Game.vue";
import GameSelect from "./views/GameSelect.vue";
import CreateRoom from "./views/CreateRoom.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/game",
      name: "game",
      component: Game
    },
    {
      path: "/select-room",
      name: "room-select",
      component: GameSelect
    },
    {
      path: "/private",
      name: "private",
      component: CreateRoom
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name != "home" && !store.state.localPlayer) {
    next({
      path: "/"
    });
  } else {
    next();
  }
});

export default router;
