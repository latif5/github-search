export const env = {
  apiBaseUrl: 'https://api.github.com',
  isDevelopment: true,
  isProduction: false,
  isTest: false,
};

if (typeof process !== 'undefined' && process.env) {
  if (process.env.VITE_BASE_URL) {
    env.apiBaseUrl = process.env.VITE_BASE_URL;
  }
  
  if (process.env.NODE_ENV) {
    env.isDevelopment = process.env.NODE_ENV === 'development';
    env.isProduction = process.env.NODE_ENV === 'production';
    env.isTest = process.env.NODE_ENV === 'test';
  }
}

export default env;
