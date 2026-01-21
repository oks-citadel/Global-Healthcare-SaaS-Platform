/**
 * Type declarations for clamscan module
 */

declare module 'clamscan' {
  import { Readable } from 'stream';

  interface ClamScanConfig {
    removeInfected?: boolean;
    quarantineInfected?: boolean;
    scanLog?: string | null;
    debugMode?: boolean;
    fileList?: string | null;
    scanRecursively?: boolean;
    clamdscan?: {
      socket?: string;
      host?: string;
      port?: number;
      timeout?: number;
      localFallback?: boolean;
      path?: string;
      configFile?: string;
      multiscan?: boolean;
      reloadDb?: boolean;
      active?: boolean;
      bypassTest?: boolean;
    };
    clamscan?: {
      path?: string;
      db?: string | null;
      scanArchives?: boolean;
      active?: boolean;
    };
    preference?: 'clamdscan' | 'clamscan';
  }

  interface ScanResult {
    isInfected: boolean;
    viruses?: string[];
    file?: string;
  }

  class NodeClam {
    init(config?: ClamScanConfig): Promise<NodeClam>;
    scanFile(filePath: string): Promise<ScanResult>;
    scanStream(stream: Readable): Promise<ScanResult>;
    scanDir(dirPath: string): Promise<ScanResult>;
    getVersion(): Promise<string>;
    passthrough(): Readable;
  }

  export = NodeClam;
}
