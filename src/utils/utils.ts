import { Logger } from '@nestjs/common';
import { GeolocationFilter } from 'src/shelter/types/search.types';
import * as crypto from 'crypto';

class ServerResponse<T> {
  readonly message: string;
  private readonly statusCode: number;
  private readonly respData?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.respData = data;
  }

  public get data(): { statusCode: number; message: string; data?: T } {
    const resp = {
      statusCode: this.statusCode,
      message: this.message,
      data: this.respData,
    };
    if (!resp?.data) delete resp.data;
    return resp;
  }
}

function removeNotNumbers(input: string): string {
  return input.replace(/[^0-9]/g, '');
}

function capitalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .split(' ')
    .map((t) => t[0].toUpperCase() + t.slice(1))
    .join(' ');
}

function getSessionData(token?: string): { userId: string; sessionId: string } {
  try {
    if (token) {
      const splited = token.split('.');
      if (splited.length === 3) {
        const { userId, sessionId } = JSON.parse(
          Buffer.from(splited[1], 'base64').toString('utf-8'),
        );
        return { userId, sessionId };
      }
    }
  } catch (err) {
    Logger.error(`Error to get session data: ${err}`, getSessionData.name);
  }
  return { userId: '', sessionId: '' };
}

function deepMerge(target: Record<string, any>, source: Record<string, any>) {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  } else if (
    typeof target === 'object' &&
    target !== null &&
    typeof source === 'object' &&
    source !== null
  ) {
    const merged = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        merged[key] = target.hasOwnProperty(key)
          ? deepMerge(target[key], source[key])
          : source[key];
      }
    }
    return merged;
  } else {
    return source;
  }
}

interface Coordinates {
  maxLat: number;
  minLat: number;
  maxLong: number;
  minLong: number;
}

function calculateGeolocationBounds({
  latitude,
  longitude,
  radiusInMeters,
}: GeolocationFilter): Coordinates {
  const earthRadius = 6371000;

  const latRad = (latitude * Math.PI) / 180;

  const radiusRad = radiusInMeters / earthRadius;

  const maxLat = latitude + radiusRad * (180 / Math.PI);
  const minLat = latitude - radiusRad * (180 / Math.PI);

  const deltaLong = Math.asin(Math.sin(radiusRad) / Math.cos(latRad));

  const maxLong = longitude + deltaLong * (180 / Math.PI);
  const minLong = longitude - deltaLong * (180 / Math.PI);

  return {
    maxLat,
    minLat,
    maxLong,
    minLong,
  };
}

function removeEmptyStrings<T>(obj): T {
  return Object.entries(obj).reduce(
    (prev, [key, value]) => (value === '' ? prev : { ...prev, [key]: value }),
    {},
  ) as T;
}

function generateRandomPassword(length: number): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let password = '';
  const values = new Uint32Array(length);
  crypto.randomFillSync(values);
  for (let i = 0; i < length; i++) {
    password += charset[values[i] % charset.length];
  }
  return password;
}

export {
  ServerResponse,
  calculateGeolocationBounds,
  capitalize,
  deepMerge,
  getSessionData,
  removeNotNumbers,
  removeEmptyStrings,
  generateRandomPassword,
};
