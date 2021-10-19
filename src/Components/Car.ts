import { createElem, carDelete, carStart, carStop, renderer, selectCar } from '../utils/helpers';
import { createMoto, createCar, createTruck, createPlane } from '../utils/svgCreator';
import { RenderObject } from '../utils/types';
import { transportType } from '../utils/consts';

export default class Car {
  selector: HTMLElement;

  color: string;

  name: string;

  type: string;

  readonly id: number;

  needRender: RenderObject;

  constructor(
    selector: HTMLElement,
    color: string,
    name: string,
    carId: number,
    needRender: RenderObject,
    type: string,
  ) {
    this.color = color;
    this.name = name;
    this.id = carId;
    this.selector = selector;
    this.needRender = needRender;
    this.type = type;
  }

  private deleteCar() {
    const args = { id: this.id, needRender: this.needRender };
    renderer(carDelete, args);
  }

  private start() {
    const args = { id: this.id };
    renderer(carStart, args);
  }

  private stop() {
    const args = { id: this.id };
    renderer(carStop, args);
  }

  private select() {
    const args = { name: this.name, color: this.color };
    renderer(selectCar, args);
  }

  generateCar() {
    const container = createElem('div', 'car', this.selector, { id: `car-${this.id}` });
    const carsOption = createElem('div', 'car__options', container);
    const selectButton = createElem('button', 'car__select-button', carsOption, { type: 'button' }, 'select');
    selectButton.addEventListener('click', () => {
      const allCars = document.querySelectorAll('.car');
      allCars.forEach((car) => {
        car.removeAttribute('title');
      });
      container.setAttribute('title', `selected-${this.id}`);
      this.select();
    });
    const removeButton = createElem('button', 'car__remove-button', carsOption, { type: 'button' }, 'remove');
    removeButton.addEventListener('click', () => {
      this.deleteCar();
    });
    createElem('p', 'car__name', carsOption, {}, this.name);
    const carsDrive = createElem('div', 'car__drive', container);
    const startButton = createElem('button', 'car__start-button', carsDrive, { type: 'button' }, 'A');
    startButton.addEventListener('click', () => {
      this.start();
    });
    const stopButton = createElem('button', 'car__stop-button', carsDrive, { type: 'button', disabled: 'true' }, 'B');
    stopButton.addEventListener('click', () => {
      this.stop();
    });

    let transport;

    if (!this.type) {
      transport = transportType(this.name);
    } else {
      transport = this.type;
    }
    let carImage;

    if (transport === 'auto') {
      carImage = createCar(this.color);
    } else if (transport === 'moto') {
      carImage = createMoto(this.color);
    } else if (transport === 'truck') {
      carImage = createTruck(this.color);
    } else {
      carImage = createPlane(this.color);
    }

    carImage.classList.add('car__image');
    carImage.classList.add('drive-animation');
    container.appendChild(carImage);
    createElem('span', 'car__error error-animation', container, {}, 'engine breakdown');
  }
}
