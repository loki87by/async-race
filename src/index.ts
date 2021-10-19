import './normalize.css';
import './style.css';
import { parseLocation, findComponentByPath } from './utils/helpers';
import { CARS_PER_PAGE, WINNERS_PER_PAGE } from './utils/consts';
import { Route } from './utils/types';
import App from './Components/App';

const page = document.querySelector('body');
const garage = document.createElement('div');
page?.appendChild(garage);
let pageNumber = 1;
const needRender = { key: false, direction: 'DESC', sortedParam: 'wins' };

const routes: Route[] = [
  { path: '/', component: 'garage' },
  { path: 'garage', component: 'garage' },
  { path: 'winners', component: 'winners' },
];

let elementsPerPage: number;

const router = () => {
  const hash = parseLocation();
  let path = hash.split('&')[0];

  if (path === '') {
    path = '/';
  }
  pageNumber = +hash.split('&')[1] || 1;
  const route = findComponentByPath(path, routes);
  const { component } = route!;
  garage.innerHTML = '';

  if (component === 'garage') {
    elementsPerPage = CARS_PER_PAGE;
  }

  if (component === 'winners') {
    elementsPerPage = WINNERS_PER_PAGE;
  }
  const app = new App(garage, pageNumber, component, needRender, elementsPerPage);
  app.getMarkup();
};
router();
setInterval(() => {
  if (needRender.key) {
    router();
    needRender.key = !needRender.key;
  }
}, 100);

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
