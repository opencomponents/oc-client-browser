type Callback<T> = (err: NodeJS.ErrnoException | null, data: T) => void;

declare const ocClient: {
  getLib: (cb: Callback<string>) => void;
  getMap: (cb: Callback<string>) => void;
  string: string;
};

export = ocClient;
