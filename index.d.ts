type Callback<T> = (err: NodeJS.ErrnoException | null, data: T) => void;

declare const ocClient: {
  getLib: {
    (cb: Callback<string>): void;
    (): Promise<string>;
  };
  getMap: {
    (cb: Callback<string>): void;
    (): Promise<string>;
  };
  version: string;
};

export = ocClient;
