import '@testing-library/jest-dom';

declare global {
  interface Window {
    import: {
      meta: {
        env: typeof mockedEnv;
      };
    };
  }
}

const mockedEnv = {
  VITE_BASE_URL: 'https://api.github.com'
};

window.import = {
  meta: {
    env: mockedEnv
  }
};