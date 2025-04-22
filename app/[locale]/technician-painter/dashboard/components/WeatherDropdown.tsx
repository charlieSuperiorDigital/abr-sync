import React from 'react';

const weatherOptions = [
  {
    value: '0',
    label: '🌧️ HEAVY RAIN 46 F  MON, 10/17',
  },
  {
    value: '1',
    label: '☀️ SUNNY 49 F  TUE, 10/18',
  },
  {
    value: '2',
    label: '☁️ CLOUDY 47 F  WED, 10/19',
  },
];

const WeatherDropdown: React.FC = () => (
  <div className="relative">
    <select
      className="px-6 py-1 pr-10 text-lg font-semibold text-white bg-black appearance-none cursor-pointer focus:outline-none"
      style={{ minWidth: 220, borderRadius: 9999 }}
      value="0"
      onChange={e => e.preventDefault()}
      tabIndex={-1}
    >
      {weatherOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <svg className="absolute right-3 top-1/2 text-white transform -translate-y-1/2 pointer-events-none" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>
);

export default WeatherDropdown;
