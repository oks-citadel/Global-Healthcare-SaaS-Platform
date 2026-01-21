/**
 * Weather Trigger
 * Evaluates weather-based conditions for smart reminders
 */

import {
  TriggerCondition,
  TriggerEvaluationResult,
  // @ts-ignore - WeatherConditionParams imported for type reference
  WeatherConditionParams,
} from '../models/TriggerCondition.js';
import { logger } from '../utils/logger.js';

// Weather data interface (from external weather service)
interface WeatherData {
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temperature: number;
    temperatureUnit: 'celsius' | 'fahrenheit';
    humidity: number;
    condition: string;
    conditionCode: string;
    uvIndex: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    pressure: number;
    feelsLike: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    conditionCode: string;
    precipitationProbability: number;
    humidity: number;
    uvIndex: number;
  }>;
  alerts: Array<{
    type: string;
    severity: string;
    headline: string;
    description: string;
    startTime: string;
    endTime: string;
  }>;
  airQuality?: {
    index: number;
    category: string;
    primaryPollutant: string;
  };
  pollen?: {
    tree: 'low' | 'medium' | 'high' | 'very_high';
    grass: 'low' | 'medium' | 'high' | 'very_high';
    weed: 'low' | 'medium' | 'high' | 'very_high';
    overall: 'low' | 'medium' | 'high' | 'very_high';
  };
  retrievedAt: string;
}

// Weather service interface
interface WeatherService {
  getWeatherData(
    latitude: number,
    longitude: number,
    forecastHours?: number
  ): Promise<WeatherData>;
  getWeatherDataByLocationId(locationId: string): Promise<WeatherData>;
}

// Mock weather service for development
class MockWeatherService implements WeatherService {
  async getWeatherData(
    latitude: number,
    longitude: number,
    forecastHours: number = 24
  ): Promise<WeatherData> {
    // Generate realistic mock data
    const now = new Date();
    const temperature = 65 + Math.random() * 30; // 65-95°F
    const humidity = 30 + Math.random() * 50; // 30-80%

    return {
      location: {
        city: 'Mock City',
        country: 'US',
        latitude,
        longitude,
      },
      current: {
        temperature,
        temperatureUnit: 'fahrenheit',
        humidity,
        condition: 'Partly Cloudy',
        conditionCode: 'partly_cloudy',
        uvIndex: Math.floor(Math.random() * 11),
        windSpeed: Math.random() * 20,
        windDirection: 'NW',
        visibility: 10,
        pressure: 1013,
        feelsLike: temperature + (humidity > 60 ? 5 : 0),
      },
      forecast: Array.from({ length: Math.ceil(forecastHours / 24) }, (_, i) => ({
        date: new Date(now.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
        high: temperature + 5 + Math.random() * 5,
        low: temperature - 10 - Math.random() * 5,
        condition: 'Sunny',
        conditionCode: 'sunny',
        precipitationProbability: Math.random() * 30,
        humidity: humidity + Math.random() * 10 - 5,
        uvIndex: Math.floor(Math.random() * 11),
      })),
      alerts: [],
      airQuality: {
        index: Math.floor(50 + Math.random() * 100),
        category: 'Moderate',
        primaryPollutant: 'PM2.5',
      },
      pollen: {
        tree: 'medium',
        grass: 'low',
        weed: 'low',
        overall: 'medium',
      },
      retrievedAt: now.toISOString(),
    };
  }

  async getWeatherDataByLocationId(_locationId: string): Promise<WeatherData> {
    // Default to NYC coordinates for mock
    return this.getWeatherData(40.7128, -74.006);
  }
}

// Weather trigger evaluator
export class WeatherTrigger {
  private weatherService: WeatherService;

  constructor(weatherService?: WeatherService) {
    this.weatherService = weatherService || new MockWeatherService();
  }

  async evaluate(
    trigger: TriggerCondition,
    userContext: {
      latitude?: number;
      longitude?: number;
      locationId?: string;
    }
  ): Promise<TriggerEvaluationResult> {
    const params = trigger.weatherParams;
    if (!params) {
      return this.createResult(trigger, false, 'No weather parameters configured');
    }

    try {
      // Get weather data
      let weatherData: WeatherData;
      if (params.locationId) {
        weatherData = await this.weatherService.getWeatherDataByLocationId(params.locationId);
      } else if (params.usePatientLocation && userContext.latitude && userContext.longitude) {
        weatherData = await this.weatherService.getWeatherData(
          userContext.latitude,
          userContext.longitude,
          params.forecastHours
        );
      } else if (userContext.locationId) {
        weatherData = await this.weatherService.getWeatherDataByLocationId(userContext.locationId);
      } else {
        return this.createResult(trigger, false, 'No location available for weather check');
      }

      // Evaluate conditions
      const results: Array<{ condition: string; met: boolean; detail: string }> = [];

      // Check weather conditions
      if (params.conditions && params.conditions.length > 0) {
        for (const condition of params.conditions) {
          const met = this.checkWeatherCondition(condition, weatherData);
          results.push({
            condition: `weather_${condition}`,
            met,
            detail: met ? `${condition} condition detected` : `No ${condition} detected`,
          });
        }
      }

      // Check temperature threshold
      if (params.temperatureThreshold) {
        const temp = this.normalizeTemperature(
          weatherData.current.temperature,
          weatherData.current.temperatureUnit,
          params.temperatureThreshold.unit
        );

        if (params.temperatureThreshold.min !== undefined) {
          const met = temp < params.temperatureThreshold.min;
          results.push({
            condition: 'temperature_low',
            met,
            detail: `Temperature ${temp.toFixed(1)}° vs min ${params.temperatureThreshold.min}°`,
          });
        }

        if (params.temperatureThreshold.max !== undefined) {
          const met = temp > params.temperatureThreshold.max;
          results.push({
            condition: 'temperature_high',
            met,
            detail: `Temperature ${temp.toFixed(1)}° vs max ${params.temperatureThreshold.max}°`,
          });
        }
      }

      // Check humidity threshold
      if (params.humidityThreshold) {
        const humidity = weatherData.current.humidity;

        if (params.humidityThreshold.min !== undefined) {
          const met = humidity < params.humidityThreshold.min;
          results.push({
            condition: 'humidity_low',
            met,
            detail: `Humidity ${humidity}% vs min ${params.humidityThreshold.min}%`,
          });
        }

        if (params.humidityThreshold.max !== undefined) {
          const met = humidity > params.humidityThreshold.max;
          results.push({
            condition: 'humidity_high',
            met,
            detail: `Humidity ${humidity}% vs max ${params.humidityThreshold.max}%`,
          });
        }
      }

      // Check pollen level
      if (params.pollenLevel && weatherData.pollen) {
        const pollenLevels = ['low', 'medium', 'high', 'very_high'];
        const currentLevel = pollenLevels.indexOf(weatherData.pollen.overall);
        const thresholdLevel = pollenLevels.indexOf(params.pollenLevel);
        const met = currentLevel >= thresholdLevel;
        results.push({
          condition: 'pollen',
          met,
          detail: `Pollen level: ${weatherData.pollen.overall} vs threshold: ${params.pollenLevel}`,
        });
      }

      // Check UV index
      if (params.uvIndex) {
        const uv = weatherData.current.uvIndex;

        if (params.uvIndex.min !== undefined) {
          const met = uv >= params.uvIndex.min;
          results.push({
            condition: 'uv_high',
            met,
            detail: `UV index ${uv} vs min ${params.uvIndex.min}`,
          });
        }

        if (params.uvIndex.max !== undefined) {
          const met = uv > params.uvIndex.max;
          results.push({
            condition: 'uv_extreme',
            met,
            detail: `UV index ${uv} vs max ${params.uvIndex.max}`,
          });
        }
      }

      // Check air quality
      if (params.airQualityIndex && weatherData.airQuality) {
        const aqi = weatherData.airQuality.index;

        if (params.airQualityIndex.min !== undefined) {
          const met = aqi >= params.airQualityIndex.min;
          results.push({
            condition: 'air_quality_poor',
            met,
            detail: `AQI ${aqi} vs min ${params.airQualityIndex.min}`,
          });
        }
      }

      // Determine if trigger should fire (any condition met)
      const triggeredConditions = results.filter((r) => r.met);
      const triggered = triggeredConditions.length > 0;

      logger.info(
        `Weather trigger ${trigger.id} evaluated: ${triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}`,
        {
          triggerId: trigger.id,
          results,
          triggered,
        }
      );

      return this.createResult(
        trigger,
        triggered,
        triggered
          ? `Conditions met: ${triggeredConditions.map((c) => c.condition).join(', ')}`
          : 'No weather conditions met',
        {
          weatherData: {
            temperature: weatherData.current.temperature,
            humidity: weatherData.current.humidity,
            condition: weatherData.current.condition,
            uvIndex: weatherData.current.uvIndex,
            airQuality: weatherData.airQuality?.index,
            pollen: weatherData.pollen?.overall,
          },
          evaluatedConditions: results,
        }
      );
    } catch (error) {
      logger.error(`Weather trigger evaluation failed: ${error}`, {
        triggerId: trigger.id,
        error,
      });
      return this.createResult(trigger, false, `Evaluation error: ${error}`);
    }
  }

  private checkWeatherCondition(
    condition: string,
    weatherData: WeatherData
  ): boolean {
    const currentCondition = weatherData.current.conditionCode.toLowerCase();
    const alerts = weatherData.alerts.map((a) => a.type.toLowerCase());

    switch (condition) {
      case 'rain':
        return currentCondition.includes('rain') || currentCondition.includes('shower');
      case 'snow':
        return currentCondition.includes('snow') || currentCondition.includes('blizzard');
      case 'extreme_heat':
        return weatherData.current.temperature > 95 || alerts.includes('heat');
      case 'extreme_cold':
        return weatherData.current.temperature < 20 || alerts.includes('cold');
      case 'high_humidity':
        return weatherData.current.humidity > 80;
      case 'low_humidity':
        return weatherData.current.humidity < 30;
      case 'high_pollen':
        return (
          weatherData.pollen?.overall === 'high' ||
          weatherData.pollen?.overall === 'very_high'
        );
      case 'high_uv':
        return weatherData.current.uvIndex >= 8;
      case 'air_quality_poor':
        return weatherData.airQuality ? weatherData.airQuality.index > 100 : false;
      case 'storm_warning':
        return alerts.some(
          (a) =>
            a.includes('storm') ||
            a.includes('thunder') ||
            a.includes('tornado') ||
            a.includes('hurricane')
        );
      case 'wind_advisory':
        return weatherData.current.windSpeed > 30 || alerts.includes('wind');
      default:
        return false;
    }
  }

  private normalizeTemperature(
    temp: number,
    fromUnit: 'celsius' | 'fahrenheit',
    toUnit: 'celsius' | 'fahrenheit'
  ): number {
    if (fromUnit === toUnit) return temp;

    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      return (temp * 9) / 5 + 32;
    }

    return ((temp - 32) * 5) / 9;
  }

  private createResult(
    trigger: TriggerCondition,
    triggered: boolean,
    reason: string,
    context?: Record<string, unknown>
  ): TriggerEvaluationResult {
    return {
      triggerId: trigger.id,
      triggerType: 'weather',
      triggered,
      evaluatedAt: new Date().toISOString(),
      reason,
      context,
      confidence: triggered ? 0.95 : 1.0,
      nextEvaluationAt: new Date(
        Date.now() + trigger.evaluationIntervalMinutes * 60 * 1000
      ).toISOString(),
    };
  }
}

export default WeatherTrigger;
