export default class Api {
  url: string;

  constructor() {
    this.url = 'http://127.0.0.1:3000';
  }

  getCars() {
    return fetch(`${this.url}/garage`, {
      method: 'GET',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  getCar(carId: number) {
    return fetch(`${this.url}/garage/${carId}`, {
      method: 'GET',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  createCar(name: string, color: string) {
    const data = { name, color };
    return fetch(`${this.url}/garage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  deleteCar(carId: number) {
    return fetch(`${this.url}/garage/${carId}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        return res.status;
      }
      return null;
    });
  }

  updateCar(carId: number, name: string, color: string) {
    const data = { name, color };
    return fetch(`${this.url}/garage/${carId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        return res.status;
      }
      return null;
    });
  }

  startStopEngine(carId: number, status: string) {
    return fetch(`${this.url}/engine?id=${carId}&status=${status}`, {
      method: 'GET',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  toDriveSwitchEngine(carId: number) {
    return fetch(`${this.url}/engine?id=${carId}&status=drive`, {
      method: 'GET',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      if (res.status === 500) {
        return { success: false };
      }
      return null;
    });
  }

  getWinners(sortedParam: string, direction: string) {
    return fetch(`${this.url}/winners?_sort=${sortedParam}&_order=${direction}`, {
      method: 'GET',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  getWinner(carId: number) {
    return fetch(`${this.url}/winners/${carId}`, {
      method: 'GET',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  createWinner(id: number, wins: number, time: number) {
    const data = { id, wins, time };
    return fetch(`${this.url}/winners`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  deleteWinner(carId: number) {
    return fetch(`${this.url}/winners/${carId}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }

  updateWinner(carId: number, wins: number, time: number) {
    const data = { wins, time };
    return fetch(`${this.url}/winners/${carId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return null;
    });
  }
}
