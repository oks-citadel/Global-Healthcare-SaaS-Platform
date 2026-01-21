/**
 * Type declarations for i18next and i18next-fs-backend
 *
 * These declarations provide minimal type definitions needed for the i18n.ts module.
 * For full type definitions, the actual packages should be installed.
 */

declare module 'i18next' {
  export interface TFunction {
    (key: string, options?: Record<string, unknown>): string;
    (key: string, defaultValue: string, options?: Record<string, unknown>): string;
  }

  export interface InitOptions {
    resources?: Record<string, Record<string, unknown>>;
    fallbackLng?: string | string[];
    defaultNS?: string;
    ns?: string[];
    supportedLngs?: string[];
    interpolation?: {
      escapeValue?: boolean;
      [key: string]: unknown;
    };
    initImmediate?: boolean;
    debug?: boolean;
    [key: string]: unknown;
  }

  export interface i18n {
    init(options?: InitOptions): Promise<TFunction>;
    createInstance(): i18n;
    getFixedT(lng: string, ns?: string): TFunction;
    t: TFunction;
    language: string;
    languages: string[];
    changeLanguage(lng: string): Promise<TFunction>;
    use(module: unknown): i18n;
    [key: string]: unknown;
  }

  const i18next: i18n;
  export default i18next;
  export { i18next };
}

declare module 'i18next-fs-backend' {
  interface BackendOptions {
    loadPath?: string;
    addPath?: string;
    [key: string]: unknown;
  }

  interface Backend {
    type: 'backend';
    init?(services: unknown, backendOptions: BackendOptions, i18nextOptions: unknown): void;
    read?(language: string, namespace: string, callback: (err: Error | null, data: unknown) => void): void;
  }

  const FsBackend: Backend;
  export default FsBackend;
}
