import Car from './Car';
import { createElem } from '../utils/helpers';
import { transportType } from '../utils/consts';
import { createMoto, createCar, createTruck, createPlane } from '../utils/svgCreator';
import { RenderObject } from '../utils/types';

export default class Winner extends Car {
  wins: number;

  time: number;

  constructor(
    selector: HTMLElement,
    color: string,
    name: string,
    readonly carId: number,
    needRender: RenderObject,
    wins: number,
    time: number,
    type: string,
  ) {
    super(selector, color, name, carId, needRender, type);
    this.wins = wins;
    this.time = time;
    this.type = type;
  }

  generateWinner() {
    const container = createElem('li', 'winner', this.selector, { id: `winner-${this.id}` });
    createElem('p', 'li-elem', container);
    let carImage;

    if (transportType(this.name) === 'truck') {
      carImage = createTruck(this.color);
    } else if (transportType(this.name) === 'moto') {
      carImage = createMoto(this.color);
    } else if (transportType(this.name) === 'plane') {
      carImage = createPlane(this.color);
    } else {
      carImage = createCar(this.color);
    }

    if (carImage) {
      container.appendChild(carImage);
      carImage.setAttribute('style', 'width: 10vmin; height: 6vmin; margin: auto;');
    }
    createElem('p', 'li-elem', container, {}, `${this.name}`);
    createElem('p', 'li-elem', container, {}, `${this.wins}`);
    const width = Math.min(window.screen.width, document.documentElement.clientWidth);
    let timeText = '';

    if (width <= 464) {
      timeText = 'sec.';
    }
    createElem('p', 'li-elem', container, {}, `${this.time} ${timeText}`);
  }
}
