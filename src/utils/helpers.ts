import { ElementParams, CarObject, Route, FunctionArguments, RenderObject } from './types';
import Api from '../Components/Api';

const api = new Api();

export const findComponentByPath = (path: string, routes: Route[]) =>
  routes.find((i: Route) => i.path.match(new RegExp(`^\\${path}$`, 'gm')));

export const parseLocation = () => window.location.hash.slice(1).toLowerCase() || '/';

export const getCars = () => Promise.resolve(api.getCars());

export const getWinners = (sortedParam: string, direction: string) =>
  Promise.resolve(api.getWinners(sortedParam, direction));

export const deleteCar = (id: number) => Promise.resolve(api.deleteCar(id));

export const createCar = (name: string, color: string) => Promise.resolve(api.createCar(name, color));

export const startStopEngine = (id: number, status: string) => Promise.resolve(api.startStopEngine(id, status));

export const updateCar = (id: number, name: string, color: string) => Promise.resolve(api.updateCar(id, name, color));

export const getCar = (id: number) => Promise.resolve(api.getCar(id));

export const toDriveSwitchEngine = (id: number) => Promise.resolve(api.toDriveSwitchEngine(id));

const getWinner = (id: number) => Promise.resolve(api.getWinner(id));

const createWinner = (id: number, wins: number, time: number) => Promise.resolve(api.createWinner(id, wins, time));

const deleteWinner = (id: number) => Promise.resolve(api.deleteWinner(id));

const updateWinner = (id: number, wins: number, time: number) => Promise.resolve(api.updateWinner(id, wins, time));

export const getResponse = (apiRequest: Promise<void | number | null>) => apiRequest.then((res) => res);

export function sendRequest(promise: Promise<void | number | null>, func: Function, args?: FunctionArguments) {
  let result;
  getResponse(promise).then((response) => {
    result = response;

    if (func) {
      func(result, args);
    }
  });
}

let isNoReset = false;

export const createElem = (
  tagName: string,
  className?: string,
  container?: HTMLElement,
  params?: ElementParams,
  text?: string,
) => {
  const element = document.createElement(tagName);

  if (text) {
    element.textContent = text;
  }

  if (className) {
    const classesArray = className.split(' ');
    classesArray.forEach((item) => {
      element.classList.add(item);
    });
  }

  if (params) {
    Object.entries(params).forEach((param) => {
      element.setAttribute(String(param[0]), String(param[1]));
    });
  }

  if (container) {
    container.appendChild(element);
  }

  return element;
};

function winnerDelete(res: CarObject, data: FunctionArguments) {
  const { id } = data;
  if (res) {
    getResponse(deleteWinner(id!));
  }
}

function checkDeleteWinner(data: FunctionArguments) {
  const { id } = data;
  sendRequest(deleteWinner(id!), winnerDelete, data);
}

function deleteCarElement(status: number, data: FunctionArguments) {
  const { id, needRender } = data;

  if (status === 200) {
    const element = document.getElementById(`car-${id}`);
    element?.remove();
    needRender!.key = true;
    checkDeleteWinner(data);
  }
}

function displayWinner(res: CarObject, data: CarObject) {
  const page = document.querySelector('div') as HTMLElement;
  const popup = createElem('div', 'winner__popup', page);
  const time = Math.round(data.finishTime! * 100) / 100;
  const text = `win  ${res.name}  at  ${time}`;
  createElem('h2', 'winner__popup-text', popup, {}, text);
  setTimeout(() => {
    popup.remove();
  }, 5000);
}

function newWinner(data: CarObject) {
  const { id, finishTime } = data;
  const wins = 1;
  const time = Math.round(finishTime! * 100) / 100;
  sendRequest(getCar(id!), displayWinner, data);
  getResponse(createWinner(id!, wins, time!));
}

function winnerUpdate(res: CarObject, data: CarObject) {
  const { id } = res;
  const wins = res.wins! + 1;
  sendRequest(getCar(id!), displayWinner, data);
  const time = Math.round(data.finishTime! * 100) / 100;
  getResponse(updateWinner(id!, wins, time));
}

function distributeWinnersResults(res: CarObject, data: CarObject) {
  if (res) {
    return winnerUpdate(res, data);
  }
  return newWinner(data);
}

function checkWinner(data: FunctionArguments) {
  if (isNoReset) {
    const { id } = data;
    sendRequest(getWinner(id!), distributeWinnersResults, data);
  }
}

let winnersArray: FunctionArguments[] = [];

export function startDrive(res: CarObject, data: FunctionArguments) {
  const { id, seconds } = data;
  const selector = document.getElementById(`car-${id}`);
  const car = selector?.querySelector('svg');

  if (res.success === false) {
    const errorMessage = selector?.querySelector('.car__error');
    car?.setAttribute('style', `animation-duration: ${seconds}s; animation-play-state: paused`);
    errorMessage?.setAttribute('style', `animation-duration: ${seconds}s; animation-play-state: paused; opacity: 1;`);
    const clearedWinnersArray = winnersArray.filter((i) => i.seconds !== seconds);
    winnersArray = clearedWinnersArray;
  }
}

function startAnimation(id: number, time: number) {
  const selector = document.getElementById(`car-${id}`);
  const car = selector?.querySelector('svg');
  const errorMessage = selector?.querySelector('.car__error');
  car!.setAttribute(
    'style',
    `animation-duration: ${time}s; animation-play-state: running; animation-fill-mode: forwards`,
  );
  errorMessage!.setAttribute(
    'style',
    `animation-duration: ${time}s; animation-play-state: running; animation-fill-mode: forwards`,
  );
  const startButton = selector?.querySelector('.car__start-button');
  startButton?.setAttribute('disabled', 'true');
  const stopButton = selector?.querySelector('.car__stop-button');
  stopButton?.removeAttribute('disabled');
}

export function readyDrive(data: FunctionArguments) {
  const { id, velocity } = data;
  const now = Date.now();
  const selector = document.getElementById(`car-${id}`);
  const width = Math.min(selector!.clientWidth, selector!.offsetWidth, selector!.scrollWidth);
  const time = width / velocity!;
  const args = { id: data.id, velocity: data.velocity, seconds: time, startTime: now };
  sendRequest(toDriveSwitchEngine(id!), startDrive, args);
  startAnimation(id!, time);
  winnersArray.push(args);
}

export function showWinner() {
  const lastFinished = winnersArray.reduce((p, i) => {
    if (p.seconds! < i.seconds!) {
      return i;
    }
    return p;
  });
  const timeNow = Date.now();
  const elapsedTime = (Math.round(timeNow - lastFinished.startTime!) / 1000) * 1000;
  const timeMs = Math.round(1000 * lastFinished.seconds!);
  const timeLeft = timeMs - elapsedTime;
  setTimeout(() => {
    const winner = winnersArray.reduce((p, i) => {
      if (p.seconds! > i.seconds!) {
        return i;
      }
      return p;
    });
    const args = { id: winner.id, finishTime: winner.seconds };
    checkWinner(args);
  }, timeLeft);
}

export function renderer(func: Function, args: FunctionArguments) {
  func(args);
}

export function carDelete(args: FunctionArguments) {
  const { id } = args;
  sendRequest(deleteCar(id!), deleteCarElement, args);
}

function preStart(res: CarObject, data: FunctionArguments) {
  if (res) {
    const args = { id: data.id, velocity: res.velocity, distance: res.distance };
    renderer(readyDrive, args);
  }
}

export function carStart(args: FunctionArguments) {
  const { id } = args;
  sendRequest(startStopEngine(id!, 'started'), preStart, args);
  isNoReset = true;
}

export function carStop(data: CarObject) {
  const { id } = data;
  getResponse(startStopEngine(id!, 'stoped'));
  const selector = document.getElementById(`car-${id}`);
  const car = selector?.querySelector('svg');
  const errorMessage = selector?.querySelector('.car__error');
  car!.removeAttribute('style');
  errorMessage!.removeAttribute('style');
  const startButton = selector?.querySelector('.car__start-button');
  startButton?.removeAttribute('disabled');
  const stopButton = selector?.querySelector('.car__stop-button');
  stopButton?.setAttribute('disabled', 'true');
}

export function updateDefault(status: number, data: FunctionArguments) {
  if (status === 200) {
    const changeNameInput = document.getElementById('change-name-input') as HTMLInputElement;
    const changeColorInput = document.getElementById('change-color-input') as HTMLInputElement;
    const updateButton = document.getElementById('update-button') as HTMLButtonElement;
    changeNameInput.setAttribute('disabled', 'true');
    changeNameInput.value = '';
    changeColorInput.setAttribute('disabled', 'true');
    changeColorInput.value = '#ffffff';
    updateButton.setAttribute('disabled', 'true');
    const { needRender } = data;
    needRender!.key = true;
  }
}

export function selectCar(data: FunctionArguments) {
  const { name, color } = data;
  const changeNameInput = document.getElementById('change-name-input') as HTMLInputElement;
  const changeColorInput = document.getElementById('change-color-input') as HTMLInputElement;
  const updateButton = document.getElementById('update-button') as HTMLButtonElement;
  changeNameInput.removeAttribute('disabled');
  changeNameInput.value = name!;
  changeColorInput.removeAttribute('disabled');
  changeColorInput.value = color!;
  updateButton.removeAttribute('disabled');
}

export function carReset(data: FunctionArguments) {
  carStop(data);
  winnersArray = [];
  isNoReset = false;
  const { needRender } = data;
  needRender!.key = true;
}

export function startRace() {
  const cars = document.querySelectorAll('.car');
  cars.forEach((car) => {
    const carId = +car.id.replace('car-', '');
    const args = { id: carId };
    carStart(args);
  });
  setTimeout(showWinner, 2000);
}

export function resetRace(renderObject: RenderObject) {
  const cars = document.querySelectorAll('.car');
  cars.forEach((car) => {
    const carId = +car.id.replace('car-', '');
    const args = { id: carId, needRender: renderObject };
    carReset(args);
  });
  isNoReset = true;
}
