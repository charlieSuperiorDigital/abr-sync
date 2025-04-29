import React, { useState } from 'react';
import { useWeather } from '@/app/api/hooks/useWeather';
import { format } from 'date-fns';
import WarningIcon from './WarningIcon';

interface WeatherDropdownProps {
  latitude?: number;
  longitude?: number;
}

interface WeatherOption {
  value: string;
  label: string;
  needsWarning: boolean;
}

const WeatherDropdown: React.FC<WeatherDropdownProps> = ({ latitude, longitude }) => {
  const { weatherData, isLoading } = useWeather({ latitude, longitude });
  const [selectedOption, setSelectedOption] = useState<string>('current');

  if (isLoading || !weatherData) {
    return (
      <div className="px-6 py-2 text-lg font-semibold text-white bg-black rounded-full">
        Loading weather...
      </div>
    );
  }

  // Get current weather and forecast data
  const { current, location, forecast } = weatherData;
  const forecastDays = forecast?.forecastday || [];

  // Format the current date
  const currentDate = location.localtime 
    ? format(new Date(location.localtime), 'EEE, MM/dd')
    : '';

  // Get weather icon representation
  const getWeatherIconText = (code: number): string => {
    if (code === 1000) return '☀️'; // Sunny
    if (code === 1003) return '🌤️'; // Partly cloudy
    if (code >= 1006 && code <= 1030) return '☁️'; // Cloudy
    if (code >= 1063 && code <= 1153) return '🌧️'; // Rain
    if (code >= 1180 && code <= 1201) return '🌧️'; // Rain
    if (code >= 1135 && code <= 1147) return '🌫️'; // Fog
    if (code >= 1150 && code <= 1207) return '🌦️'; // Drizzle
    return '☁️';
  };

  // Check if weather conditions need warning (rain, snow, fog, heavy winds, or temp below 60°F)
  const needsWarning = (code: number, tempF: number, windMph?: number): boolean => {
    // Rain conditions (1063-1276)
    const isRain = code >= 1063 && code <= 1276;
    
    // Snow conditions (1066-1282)
    const isSnow = (code >= 1066 && code <= 1072) || 
                  (code >= 1114 && code <= 1117) || 
                  (code >= 1210 && code <= 1282);
    
    // Fog conditions
    const isFog = code >= 1135 && code <= 1147;
    
    // Heavy wind (> 20mph if available)
    const isHeavyWind = windMph ? windMph > 20 : false;
    
    // Temperature below 60°F
    const isCold = tempF < 60;
    
    return isRain || isSnow || isFog || isHeavyWind || isCold;
  };

  // Current weather needs warning?
  const currentNeedsWarning = needsWarning(
    current.condition.code, 
    current.temp_f,
    current.wind_mph
  );

  // Format weather label
  const currentWeatherIcon = getWeatherIconText(current.condition.code);
  const currentWeatherText = `${currentWeatherIcon} ${current.condition.text.toUpperCase()} ${Math.round(current.temp_f)}°F ${currentDate}`;

  // Create forecast options with text labels only (SVG icons are handled in the render)
  const weatherOptions: WeatherOption[] = [
    {
      value: 'current',
      label: currentWeatherText,
      needsWarning: currentNeedsWarning
    },
    ...forecastDays.map((day, index) => {
      const dayIcon = getWeatherIconText(day.day.condition.code);
      
      // Use maxtemp_f as fallback if avgtemp_f is not available
      const dayTemp = day.day.avgtemp_f || day.day.maxtemp_f;
      
      const dayNeedsWarning = needsWarning(
        day.day.condition.code, 
        dayTemp,
        day.day.maxwind_mph
      );
      
      const dayText = `${dayIcon} ${day.day.condition.text.toUpperCase()} ${Math.round(day.day.maxtemp_f)}°F ${format(new Date(day.date), 'EEE, MM/dd')}`;
      
      return {
        value: `day-${index}`,
        label: dayText,
        needsWarning: dayNeedsWarning
      };
    })
  ];

  // Find the currently selected option
  const currentSelectedOption = weatherOptions.find(opt => opt.value === selectedOption) || weatherOptions[0];

  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative inline-block">
        <select
          className="px-6 py-2 pl-10 pr-10 text-lg font-semibold text-white bg-black rounded-full appearance-none cursor-pointer focus:outline-none"
          style={{ minWidth: 280 }}
          value={selectedOption}
          onChange={handleSelectChange}
        >
          {weatherOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Dropdown arrow icon */}
        <svg className="absolute text-white transform -translate-y-1/2 pointer-events-none right-3 top-1/2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
        
        {/* Custom Warning Icon - Only shown when the selected option needs warning */}
        {currentSelectedOption.needsWarning && (
          <div className="absolute transform -translate-y-1/2 pointer-events-none left-3 top-1/2">
            <WarningIcon size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDropdown;
