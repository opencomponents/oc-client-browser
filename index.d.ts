type Callback<T> = (err: NodeJS.ErrnoException | null, data: T) => void;

type Template = {
  externals: Array<{ global: string | string[]; url: string }>;
};
type CompileOptions = { templates?: Record<string, Template> };
type Compiled = { code: string; map: string };

declare const ocClient: {
  compile: {
    (options?: CompileOptions): Promise<Compiled>;
  };
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
