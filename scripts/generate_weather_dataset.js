const fs = require('fs');
const path = require('path');

const stations = [
  'BASEL', 'BUDAPEST', 'DE', 'DRESDEN', 'DUSSELDORF', 'HEATHROW',
  'KASSEL', 'LJUBLJANA', 'MAASTRICHT', 'MALMO', 'MONTELIMAR',
  'MUENCHEN', 'OSLO', 'PERPIGNAN', 'SONNBLICK', 'STOCKHOLM', 'TOURS'
];

let headers = ['DATE'];
stations.forEach(s => {
  headers.push(`${s}_precipitation`);
  headers.push(`${s}_temp_mean`);
  headers.push(`${s}_humidity`);
  headers.push(`${s}_wind_speed`);
  headers.push(`${s}_wind_gust`);
});

let rows = [headers.join(',')];
const startDate = new Date('2023-01-01T00:00:00Z');

for (let i = 0; i < 365; i++) {
  const d = new Date(startDate.getTime() + i * 86400000);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  const row = [dateStr];
  const season = Math.sin((i / 365) * Math.PI);
  const baseTemp = 5 + season * 20;

  stations.forEach(s => {
    const isRain = Math.random() < 0.35;
    const precip = isRain ? (Math.random() * 25).toFixed(2) : '0.00';
    const temp = (baseTemp + (Math.random() * 8 - 4)).toFixed(1);
    const humidity = (50 + Math.random() * 45).toFixed(1);
    const windSpeed = (2 + Math.random() * 8).toFixed(1);
    const windGust = (parseFloat(windSpeed) + Math.random() * 5).toFixed(1);
    row.push(precip, temp, humidity, windSpeed, windGust);
  });

  rows.push(row.join(','));
}

const targetPath = path.join(__dirname, '..', 'archive (1) 2', 'weather_prediction_dataset.csv');
fs.writeFileSync(targetPath, rows.join('\n'));
console.log('Successfully generated clean weather_prediction_dataset.csv with ' + (rows.length - 1) + ' days of data');
