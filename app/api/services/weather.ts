import axios from 'axios';

// Define the expected response type from WeatherAPI.com
export interface WeatherData {
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph?: number;
    wind_kph?: number;
  };
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_f?: number;
        maxwind_mph?: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
    }>;
  };
}

export const getWeatherByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  // Using WeatherAPI.com service
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'e2ad326b8b1d4e03a7a02522252504';
  
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json`,
      {
        params: {
          key: apiKey,
          q: `${latitude},${longitude}`,
          days: 3,
          aqi: 'no',
          alerts: 'yes'
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}; 