declare global {
  interface Window {
    electronAPI: {
      test: (title: string) => string;
    };
  }
}

export {};
