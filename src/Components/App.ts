import { RenderObject } from '../utils/types';
import {
  createElem,
  sendRequest,
  getCars,
  getWinners,
  createCar,
  updateCar,
  updateDefault,
  parseLocation,
  resetRace,
  startRace,
} from '../utils/helpers';
import { newCar, addCars, setCars } from '../utils/apiHandlers';

export default class App {
  selector: HTMLElement;

  index: number;

  pageNumber: number;

  page: string;

  selectedCarIndex: number;

  needRender: RenderObject;

  elementsPerPage: number;

  constructor(
    selector: HTMLElement,
    pageNumber: number,
    page: string,
    needRender: RenderObject,
    elementsPerPage: number,
  ) {
    this.page = page;
    this.selector = selector;
    this.pageNumber = pageNumber;
    this.elementsPerPage = elementsPerPage;
    this.index = (pageNumber - 1) * elementsPerPage;
    this.selectedCarIndex = NaN;
    this.needRender = needRender;
  }

  updateCar(data: RenderObject) {
    const cars = document.querySelectorAll('.car');
    const garage = [...cars];
    garage.forEach((car) => {
      const { title } = car as HTMLElement;
      const arr = title.split('-');

      if (arr.length === 2) {
        this.selectedCarIndex = +arr[arr.length - 1];
      }
    });
    const name = document.getElementById('change-name-input') as HTMLInputElement;
    const color = document.getElementById('change-color-input') as HTMLInputElement;
    const id = this.selectedCarIndex;
    const args = { needRender: data };
    sendRequest(updateCar(id, name.value, color.value), updateDefault, args);
    garage.forEach((car) => {
      car.removeAttribute('title');
    });
  }

  setConfigMarkup() {
    const configSection = createElem('section', 'form', this.selector);
    const createSection = createElem('div', 'form__inputs', configSection);
    const nameInput = createElem('input', 'form__name-input', createSection, {
      type: 'text',
      placeholder: 'input name',
      value: '',
    });
    const colorInput = createElem('input', 'form__color-input', createSection, { type: 'color', value: '#ffffff' });
    const createButton = createElem('button', 'form__create-button', createSection, { type: 'button' }, 'create');
    createButton.addEventListener('click', () => {
      const name = (nameInput as HTMLInputElement).value;
      const color = (colorInput as HTMLInputElement).value;
      const args = { needRender: this.needRender };
      sendRequest(createCar(name, color), newCar, args);
    });
    const updateSection = createElem('div', 'form__inputs', configSection);
    createElem('input', 'form__name-input', updateSection, {
      id: 'change-name-input',
      type: 'text',
      placeholder: 'input name',
      disabled: 'true',
    });
    createElem('input', 'form__color-input', updateSection, {
      id: 'change-color-input',
      type: 'color',
      disabled: 'true',
      value: '#ffffff',
    });
    const updateButton = createElem(
      'button',
      'form__update-button',
      updateSection,
      { id: 'update-button', disabled: 'true', type: 'button' },
      'update',
    );
    updateButton.addEventListener('click', () => {
      this.updateCar(this.needRender);
    });
    const buttonsSection = createElem('div', 'form__buttons', configSection);
    const raceButton = createElem('button', 'form__button-race', buttonsSection, { type: 'button' }, 'race');
    raceButton.addEventListener('click', startRace);
    const reset = createElem('button', 'form__button-reset', buttonsSection, { type: 'button' }, 'reset');
    reset.addEventListener('click', () => {
      resetRace(this.needRender);
    });
    const generateButton = createElem(
      'button',
      'form__button-gen',
      buttonsSection,
      { type: 'button' },
      'generate cars',
    );
    generateButton.addEventListener('click', () => {
      const args = { page: this.page, index: this.pageNumber, needRender: this.needRender };
      addCars(args);
    });
  }

  setHeader() {
    const header = createElem('header', 'header', this.selector);
    const navigation = createElem('nav', 'header__navigation', header);
    const toGarage = createElem(
      'button',
      'header__navigation-button header__navigation-button_garage',
      navigation,
      { type: 'button' },
      'to garage',
    );
    toGarage.addEventListener('click', () => {
      this.needRender.direction = 'DESC';
      this.needRender.sortedParam = 'id';
      const newLocation = `${window.location.origin}#garage&1`;
      window.location.replace(newLocation);
    });
    const toWinners = createElem(
      'button',
      'header__navigation-button header__navigation-button_winners',
      navigation,
      { type: 'button' },
      'to winners',
    );
    toWinners.addEventListener('click', () => {
      const newLocation = `${window.location.origin}#winners&1`;
      window.location.replace(newLocation);
    });
  }

  setGarageMarkup() {
    const carsSection = createElem('section', 'cars', this.selector);
    const args = {
      index: this.index,
      selector: carsSection,
      needRender: this.needRender,
      page: this.page,
      elementsPerPage: this.elementsPerPage,
    };
    sendRequest(getCars(), setCars, args);
  }

  setWinnersMarkup() {
    const carsSection = createElem('section', 'cars', this.selector);
    const carsList = createElem('ul', 'winners', carsSection);
    const listTitle = createElem('li', 'winner', carsList);
    const idItem = createElem('p', 'li-elem li-elem-button li-elem-button_sort_desc', listTitle, {}, 'number');

    if (this.needRender.sortedParam !== 'id') {
      idItem.classList.remove('li-elem-button');
      idItem.classList.remove('li-elem-button_sort_desc');
    }
    createElem('p', 'li-elem', listTitle, {}, 'car');
    createElem('p', 'li-elem', listTitle, {}, 'name');
    const winsButton = createElem('p', 'li-elem li-elem-button', listTitle, {}, 'wins');

    if (this.needRender.sortedParam === 'wins') {
      if (this.needRender.direction === 'DESC') {
        winsButton.classList.add('li-elem-button_sort_desc');
        winsButton.classList.remove('li-elem-button_sort_asc');
      } else {
        winsButton.classList.add('li-elem-button_sort_asc');
        winsButton.classList.remove('li-elem-button_sort_desc');
      }
    }
    winsButton.addEventListener('click', () => {
      if (this.needRender.sortedParam === 'wins') {
        if (this.needRender.direction === 'DESC') {
          this.needRender.direction = 'ASC';
        } else {
          this.needRender.direction = 'DESC';
        }
      } else {
        this.needRender.direction = 'DESC';
      }
      this.needRender.sortedParam = 'wins';
      this.needRender.key = true;
    });
    const width = Math.min(window.screen.width, document.documentElement.clientWidth);
    let timeText = 'best time (seconds)';

    if (width <= 464) {
      timeText = 'best time';
    }
    const timeButton = createElem('p', 'li-elem li-elem-button', listTitle, {}, timeText);

    if (this.needRender.sortedParam === 'time') {
      if (this.needRender.direction === 'DESC') {
        timeButton.classList.add('li-elem-button_sort_desc');
        timeButton.classList.remove('li-elem-button_sort_asc');
      } else {
        timeButton.classList.add('li-elem-button_sort_asc');
        timeButton.classList.remove('li-elem-button_sort_desc');
      }
    }
    timeButton.addEventListener('click', () => {
      if (this.needRender.sortedParam === 'time') {
        if (this.needRender.direction === 'DESC') {
          this.needRender.direction = 'ASC';
        } else {
          this.needRender.direction = 'DESC';
        }
      } else {
        this.needRender.direction = 'DESC';
      }
      this.needRender.sortedParam = 'time';
      this.needRender.key = true;
    });
    const args = {
      index: this.index,
      selector: carsList,
      needRender: this.needRender,
      page: this.page,
      elementsPerPage: this.elementsPerPage,
      pageNumber: this.pageNumber,
    };
    sendRequest(getWinners(this.needRender.sortedParam!, this.needRender.direction!), setCars, args);
  }

  getMarkup() {
    this.setHeader();
    const hash = parseLocation();
    const pageNumber = +hash.split('&')[1] || 1;

    if (this.page === 'garage') {
      this.setConfigMarkup();
    }
    createElem('h2', 'page__title', this.selector, {}, `${this.page} (`);
    createElem('h3', 'page__title', this.selector, {}, `page#${pageNumber}`);

    if (this.page === 'garage') {
      this.setGarageMarkup();
    }

    if (this.page === 'winners') {
      this.setWinnersMarkup();
    }
    const paginationButtons = createElem('section', 'pagination-buttons', this.selector);
    const prevButton = createElem(
      'button',
      'pagination-prev',
      paginationButtons,
      { id: 'pagination-prev', type: 'button' },
      'prev',
    );
    prevButton.addEventListener('click', () => {
      const newLocation = `${window.location.origin}#${this.page}&${pageNumber - 1}`;
      window.location.replace(newLocation);
    });
    const nextButton = createElem(
      'button',
      'pagination-next',
      paginationButtons,
      { id: 'pagination-next', type: 'button' },
      'next',
    );
    nextButton.addEventListener('click', () => {
      const newLocation = `${window.location.origin}#${this.page}&${pageNumber + 1}`;
      window.location.replace(newLocation);
    });
  }
}
