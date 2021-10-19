import Car from '../Components/Car';
import Winner from '../Components/Winner';
import { BRENDS, WINNERS_PER_PAGE } from './consts';
import { sendRequest, createCar, getCar, getResponse } from './helpers';
import { CarObject, FunctionArguments, ResponseObject } from './types';

export function newCar(res: CarObject, data: FunctionArguments, type: string) {
  const { needRender } = data;
  const selector = document.querySelector('cars') as HTMLElement;
  const car = new Car(selector, res.color!, res.name!, res.id!, needRender!, type);
  car.generateCar();
  needRender!.key = true;
}

export function addCars(data: FunctionArguments) {
  for (let i = 0; i < 99; i += 1) {
    const args = { needRender: { key: false } };
    const transport = BRENDS[Math.floor(Math.random() * BRENDS.length)];
    const brend = transport[Math.floor(Math.random() * transport.length)];
    const name = `${brend}`;
    const randomHex = Math.floor(Math.random() * 16777215).toString(16);
    const color = `#${'000000'.concat(randomHex).slice(-6)}`;
    sendRequest(createCar(name, color), newCar, args);
  }
  const args = { needRender: data.needRender };
  const transport = BRENDS[Math.floor(Math.random() * BRENDS.length)];
  const brend = transport[Math.floor(Math.random() * transport.length)];
  const name = `${brend}`;
  const randomHex = Math.floor(Math.random() * 16777215).toString(16);
  const color = `#${'000000'.concat(randomHex).slice(-6)}`;
  sendRequest(createCar(name, color), newCar, args);
}

export function setCars(res: CarObject[], data: FunctionArguments, type: string) {
  const title = document.querySelector('.page__title');
  const titleOldValue = title?.textContent;
  const cutterTitle = titleOldValue?.replace(/\d*\)/g, '');
  const titleNewValue = `${cutterTitle}${res.length})`;
  title!.textContent = titleNewValue;
  const { index, selector, needRender, page, elementsPerPage } = data;
  const pagination = document.querySelector('.pagination-buttons');

  if (res.length < WINNERS_PER_PAGE) {
    pagination?.classList.add('pagination-buttons_hidden');
  }

  if (index === 0) {
    const prevButton = document.getElementById('pagination-prev');
    prevButton?.setAttribute('disabled', 'true');
  }

  const lastElement = Math.floor(res.length / elementsPerPage!) * elementsPerPage!;

  if (index! > lastElement - elementsPerPage!) {
    const nextButton = document.getElementById('pagination-next');
    nextButton?.setAttribute('disabled', 'true');
  }
  res.slice(index, index! + elementsPerPage!).forEach((item: CarObject) => {
    if (page === 'garage') {
      const car = new Car(selector!, item.color!, item.name!, item.id!, needRender!, type!);
      car.generateCar();
    }

    if (page === 'winners') {
      let result;
      getResponse(getCar(item.id!)).then((response) => {
        result = response as ResponseObject;
        const { color, name } = result;
        const winner = new Winner(selector!, color!, name!, item.id!, needRender!, item.wins!, item.time!, type!);
        winner.generateWinner();
        const listItem = document.querySelectorAll('.winner');
        const firstInPageNumber = 1;
        const newNumber = firstInPageNumber + (data.pageNumber! - 1) * data.elementsPerPage!;
        for (let i = 1; i < listItem.length; i += 1) {
          listItem[i].firstElementChild!.textContent = String(newNumber + i - 1);
        }
      });
    }
  });
}
