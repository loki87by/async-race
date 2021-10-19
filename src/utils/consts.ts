export const BRENDS = [
  [
    'Tesla',
    'Aston Martin',
    'Bugatti',
    'Ferrari',
    'Lamborghini',
    'Porshe',
    'Ford',
    'Maybach',
    'Rollce Royse',
    'Audi',
    'Peugeot',
    'Hiunday',
    'ВАЗ',
    'ГАЗ',
    'Mazda',
    'Cadillac',
    'Chevrolet',
    'Citroen',
    'Alfa Romeo',
    'Hiunday',
    'Geely',
    'Fiat',
    'Yaguar',
    'Chrysler',
    'Mersedes',
    'BMW',
    'Lotus',
    'Nissan',
    'Dodge',
  ],
  [
    'Kawasaki',
    'Suzuki',
    'Yamaha',
    'Ducati',
    'Aprilia',
    'Harley Davidson',
    'Иж',
    'Mercury',
    'Triumph',
    'Honda',
    'Minsk',
    'Jawa',
    'MV Agusta',
  ],
  [
    'Volvo',
    'Kenworth',
    'MAZ',
    'KAMAZ',
    'Iveco',
    'БелАЗ',
    'VolksWagen',
    'Зил',
    'MAN',
    'DAF',
    'Scania',
    'Renault',
    'Mitsubishi',
  ],
  ['Ту', 'Ан', 'Boening', 'Airbus', 'Ил', 'Су', 'МиГ', 'АНТ', 'Як', 'Stealth', 'Eurofighter', 'Panavia'],
];

const TYPES = ['auto', 'moto', 'truck', 'plane'];

export const transportType = (arg: string) => {
  const name = arg.split(' ')[0].toLowerCase();
  const brendIndex = BRENDS.map((item, index) => {
    if (item.some((brend) => brend.split(' ')[0].toLowerCase() === name)) {
      return index;
    }
    return false;
  }).find((item) => item !== false);
  return TYPES[+brendIndex!];
};

export const CARS_PER_PAGE = 7;

export const WINNERS_PER_PAGE = 10;
