import { useState, useEffect } from 'react';
import { getWeatherByCoordinates, WeatherData } from '../services/weather';

interface UseWeatherOptions {
  latitude?: number;
  longitude?: number;
}

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useWeather = ({ latitude, longitude }: UseWeatherOptions): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeather = async () => {
    if (!latitude || !longitude) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherByCoordinates(latitude, longitude);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred fetching weather data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [latitude, longitude]);

  return {
    weatherData,
    isLoading,
    error,
    refetch: fetchWeather
  };
}; 