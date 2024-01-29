import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './config/next';
import directives from './directives';
const app = createApp(App);
directives(app);
app.use(store).use(router).use(ElementPlus);
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [componentName, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(componentName, component);
}
app.mount('#app');
