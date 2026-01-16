/**
 * Type declarations for AWS X-Ray SDK
 */

declare module 'aws-xray-sdk-core' {
  import { IncomingMessage, ServerResponse } from 'http';

  export interface Segment {
    trace_id: string;
    id: string;
    name: string;
    addAnnotation(key: string, value: string | number | boolean): void;
    addMetadata(key: string, value: unknown, namespace?: string): void;
    addError(error: Error): void;
    addNewSubsegment(name: string): Subsegment;
    close(): void;
  }

  export interface Subsegment {
    id: string;
    name: string;
    addAnnotation(key: string, value: string | number | boolean): void;
    addMetadata(key: string, value: unknown, namespace?: string): void;
    addError(error: Error): void;
    close(): void;
  }

  export interface SamplingRules {
    version: number;
    default: {
      fixed_target: number;
      rate: number;
    };
    rules?: Array<{
      description?: string;
      host?: string;
      http_method?: string;
      url_path?: string;
      fixed_target: number;
      rate: number;
    }>;
  }

  export const middleware: {
    setSamplingRules(rules: SamplingRules): void;
    enableDynamicNaming(pattern?: string): void;
  };

  export const plugins: {
    EC2Plugin: unknown;
    ECSPlugin: unknown;
    ElasticBeanstalkPlugin: unknown;
  };

  export function config(plugins: unknown[]): void;
  export function setDaemonAddress(address: string): void;
  export function getSegment(): Segment | undefined;
  export function setSegment(segment: Segment): void;
  export function captureAWSv3Client<T>(client: T): T;
  export function captureHTTPsGlobal(module: typeof import('http') | typeof import('https')): void;
  export function capturePromise(): void;
}

declare module 'aws-xray-sdk-express' {
  import { RequestHandler } from 'express';

  export function openSegment(name: string): RequestHandler;
  export function closeSegment(): RequestHandler;
}
