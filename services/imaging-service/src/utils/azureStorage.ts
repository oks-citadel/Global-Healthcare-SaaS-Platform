/**
 * Azure Storage Compatibility Layer
 *
 * This module provides backward compatibility with Azure Storage API
 * while redirecting all calls to AWS S3.
 *
 * @deprecated This module is deprecated. Use s3Storage.ts instead.
 */

// Re-export everything from S3 Storage for backward compatibility
import s3Storage from './s3Storage';

export default s3Storage;
