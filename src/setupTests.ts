import '@testing-library/jest-dom';

declare global {
  interface Window {
    import: {
      meta: {
        env: Record<string, string>;
      };
    };
  }
}

(globalThis as any).import = {
  meta: {
    env: { VITE_BASE_URL: 'https://api.github.com' }
  }
};

export {};

declare global {
  interface Window {
    expect: jest.Expect;
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    toBeInTheDocument(): void;
  }
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}