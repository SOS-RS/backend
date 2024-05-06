import { Logger } from '@nestjs/common';

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

function parseStringToObject(path: string, value: any) {
  const keys = path.split('.');
  const currentObj = {};
  let temp = currentObj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      temp[key] = value;
    } else {
      temp[key] = {};
      temp = temp[key];
    }
  });

  return currentObj;
}

function getSearchWhere(search: string, or?: boolean) {
  const where = {};
  if (search !== '') {
    const terms = search.split(',');
    const groups: Record<string, { condition: string; mode?: string }[]> =
      terms.reduce((prev, current) => {
        const [key, condition, value] = current.split(':');
        const isBoolean = ['true', 'false'].includes(value);
        const mode =
          isBoolean || ['in', 'notIn'].includes(condition)
            ? undefined
            : 'insensitive';
        const parsedValue = isBoolean ? value === 'true' : value;

        return {
          ...prev,
          [key]: [
            ...(prev[key] ?? []),
            {
              [condition]: ['in', 'notIn'].includes(condition)
                ? [parsedValue]
                : parsedValue,
              mode,
            },
          ],
        };
      }, {});

    const parsed = Object.entries(groups).reduce((prev, [key, current]) => {
      if (current.length > 1) {
        return {
          ...prev,
          AND: current.map((c) => parseStringToObject(key, c)),
        };
      } else return deepMerge(prev, parseStringToObject(key, current[0]));
    }, {});
    Object.assign(where, parsed);
  }
  if (or) {
    return {
      OR: Object.entries(where).reduce(
        (prev, [key, value]) => [...prev, { [key]: value }],
        [] as any[],
      ),
    };
  } else return where;
}

export {
  ServerResponse,
  removeNotNumbers,
  getSessionData,
  deepMerge,
  parseStringToObject,
  getSearchWhere,
  capitalize,
};
