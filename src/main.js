import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "bootstrap/dist/css/bootstrap.css";

import App from "./App.vue";
import QaTeamUrlFixer from "./components/QaTeamUrlFixer.vue";
import PostmanTestUpdater from "./components/PostmanTestUpdater.vue";
import NavPage from "./components/NavPage.vue";
import TimestampGenerator from "./components/TimestampGenerator.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(fas);
library.add(far);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "NavPage",
      component: NavPage,
    },
    {
      path: "/qateamurlfixer",
      name: "QaTeamUrlFixer",
      component: QaTeamUrlFixer,
    },
    {
      path: "/postmantestupdater",
      name: "PostmanTestUpdater",
      component: PostmanTestUpdater,
    },
    {
      path: "/timestampgenerator",
      name: "TimestampGenerator",
      component: TimestampGenerator,
    },
  ],
});

createApp(App)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
