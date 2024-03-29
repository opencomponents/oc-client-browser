type Callback<T> = (err: NodeJS.ErrnoException | null, data: T) => void;

interface TemplateRenderer {
  getInfo: () => {
    externals: Array<{
      name: string;
      global: string | string[];
      url: string;
      devUrl?: string;
    }>;
    type: string;
    version: string;
  };
}

type Template = {
  externals: Array<{ global: string | string[]; url: string }>;
};
interface CompileOptions {
  templates?: Record<string, Template> | TemplateRenderer[];
  retryInterval?: number;
  retryLimit?: number;
  /**
   * JavaScript as a string code to be executed before rendering the templates
   */
  beforeRender?: string;
}
type Compiled = { code: string; map: string; dev: string };

declare const ocClient: {
  compile: {
    (options?: CompileOptions): Promise<Compiled>;
  };
  compileSync: {
    (options?: CompileOptions): Compiled;
  };
  getLib: {
    (cb: Callback<string>): void;
    (): Promise<string>;
  };
  getLibs: {
    (cb: Callback<{ dev: string; prod: string }>): void;
    (): Promise<{ dev: string; prod: string }>;
  };
  getMap: {
    (cb: Callback<string>): void;
    (): Promise<string>;
  };
  version: string;
};

export = ocClient;
