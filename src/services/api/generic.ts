import axios from 'axios';

/**
 * Generic API service for fetching data from any API endpoint
 */

/**
 * Fetch data from any API URL
 */
export const fetchGenericAPI = async (url: string): Promise<any> => {
    try {
        const response = await axios.get(url, {
            timeout: 10000, // 10 second timeout
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            throw new Error('No response from API. Check your network connection.');
        } else {
            throw new Error(`Request failed: ${error.message}`);
        }
    }
};

/**
 * Recursively extract all field paths from a JSON object
 * Example: { data: { rates: { USD: 100 } } } => ["data.rates.USD"]
 */
export const extractFieldPaths = (
    obj: any,
    prefix: string = '',
    maxDepth: number = 5,
    currentDepth: number = 0
): string[] => {
    if (currentDepth >= maxDepth) return [];
    if (obj === null || obj === undefined) return [];

    const paths: string[] = [];

    if (Array.isArray(obj)) {
        // For arrays, explore the first item
        if (obj.length > 0) {
            const arrayPaths = extractFieldPaths(obj[0], `${prefix}[0]`, maxDepth, currentDepth + 1);
            paths.push(...arrayPaths);
        }
    } else if (typeof obj === 'object') {
        // For objects, explore all keys
        Object.keys(obj).forEach(key => {
            const newPrefix = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            if (value !== null && typeof value === 'object') {
                // Recursively explore nested objects/arrays
                const nestedPaths = extractFieldPaths(value, newPrefix, maxDepth, currentDepth + 1);
                paths.push(...nestedPaths);
            } else {
                // Leaf node - add the path
                paths.push(newPrefix);
            }
        });
    }

    return paths;
};

/**
 * Get value from nested object path
 * Example: getNestedValue({ data: { rates: { USD: 100 } } }, "data.rates.USD") => 100
 */
export const getNestedValue = (obj: any, path: string): any => {
    if (!path || !obj) return undefined;

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        // Handle array notation like [0]
        if (key.includes('[') && key.includes(']')) {
            const arrayKey = key.substring(0, key.indexOf('['));
            const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));

            if (arrayKey) {
                current = current[arrayKey];
            }
            if (Array.isArray(current) && !isNaN(index)) {
                current = current[index];
            }
        } else {
            current = current?.[key];
        }

        if (current === undefined || current === null) {
            return undefined;
        }
    }

    return current;
};

/**
 * Detect if a value is numeric
 */
export const isNumeric = (value: any): boolean => {
    if (typeof value === 'number') return true;
    if (typeof value === 'string') {
        return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
    }
    return false;
};

/**
 * Format value for display based on type
 */
export const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    if (isNumeric(value)) {
        const num = parseFloat(value);
        // If it looks like a price (has decimals), format as currency
        if (num > 0 && num < 1000000 && num.toString().includes('.')) {
            return `$${num.toFixed(2)}`;
        }
        return num.toLocaleString();
    }
    return String(value);
};

/**
 * Extract array data from API response
 * Useful for table widgets that need to display multiple rows
 */
export const extractArrayData = (obj: any, arrayPath: string): any[] => {
    const arrayValue = getNestedValue(obj, arrayPath);
    if (Array.isArray(arrayValue)) {
        return arrayValue;
    }
    return [];
};

/**
 * Get field type for better display formatting
 */
export const getFieldType = (value: any): 'string' | 'number' | 'boolean' | 'object' | 'array' => {
    if (Array.isArray(value)) return 'array';
    if (value === null || value === undefined) return 'string';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'boolean') return 'boolean';
    if (isNumeric(value)) return 'number';
    return 'string';
};

/**
 * Get field information including type and sample value
 */
export const getFieldInfo = (field: string, data: any) => {
    const value = getNestedValue(data, field);
    const type = getFieldType(value);
    let sample = '';

    if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
            sample = JSON.stringify(value).substring(0, 30) + '...';
        } else {
            sample = String(value).substring(0, 30);
        }
    }

    return {
        path: field,
        type,
        sample,
        value
    };
};

