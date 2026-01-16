# Database Migration Guide - Azure Blob Storage Integration

## Overview

This guide walks you through the database schema changes required for the Azure Blob Storage integration.

## Schema Changes

The following fields have been added to the `Document` model:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `blobName` | String | No | null | Azure Blob Storage blob name/path |
| `version` | Int | Yes | 1 | Document version number |

## Migration Steps

### Development Environment

1. **Ensure Prisma is up to date:**
   ```bash
   cd services/api
   npm install prisma@latest @prisma/client@latest
   ```

2. **Create the migration:**
   ```bash
   npx prisma migrate dev --name add_azure_blob_storage_fields
   ```

   This will:
   - Create a new migration file
   - Apply the migration to your development database
   - Regenerate the Prisma Client

3. **Verify the migration:**
   ```bash
   npx prisma studio
   ```

   Check the `Document` table to ensure the new fields are present.

### Production Environment

1. **Review the migration:**
   ```bash
   # View the generated SQL
   cat prisma/migrations/XXXXXX_add_azure_blob_storage_fields/migration.sql
   ```

   Expected SQL:
   ```sql
   -- AlterTable
   ALTER TABLE "Document" ADD COLUMN "blobName" TEXT,
   ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

   -- CreateIndex
   CREATE INDEX "Document_blobName_idx" ON "Document"("blobName");

   -- CreateIndex
   CREATE INDEX "Document_patientId_type_idx" ON "Document"("patientId", "type");
   ```

2. **Backup your database:**
   ```bash
   # Using pg_dump
   pg_dump -h localhost -U unified_health -d unified_health_prod > backup_$(date +%Y%m%d_%H%M%S).sql

   # Or using the provided script
   npm run db:backup
   ```

3. **Apply the migration:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Verify the migration:**
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

### Rollback (If Needed)

If you need to rollback the migration:

1. **Restore from backup:**
   ```bash
   psql -h localhost -U unified_health -d unified_health_prod < backup_YYYYMMDD_HHMMSS.sql
   ```

2. **Or manually revert:**
   ```sql
   -- Remove indexes
   DROP INDEX IF EXISTS "Document_blobName_idx";
   DROP INDEX IF EXISTS "Document_patientId_type_idx";

   -- Remove columns
   ALTER TABLE "Document" DROP COLUMN IF EXISTS "blobName";
   ALTER TABLE "Document" DROP COLUMN IF EXISTS "version";
   ```

## Data Migration

If you have existing documents, you may need to migrate them to Azure Blob Storage:

### Option 1: Manual Migration Script

Create a migration script to move existing files:

```typescript
// scripts/migrate-documents-to-azure.ts
import { PrismaClient } from '@prisma/client';
import { azureStorageService } from '../src/lib/storage';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function migrateDocuments() {
  // Initialize Azure Storage
  await azureStorageService.initialize();

  // Get all documents
  const documents = await prisma.document.findMany();

  console.log(`Found ${documents.length} documents to migrate`);

  for (const doc of documents) {
    try {
      // Read file from local storage
      const localFilePath = path.join('/path/to/local/storage', doc.fileUrl);
      const fileBuffer = fs.readFileSync(localFilePath);
      const fileStream = bufferToStream(fileBuffer);

      // Upload to Azure
      const uploadResult = await azureStorageService.uploadDocument(fileStream, {
        patientId: doc.patientId,
        documentType: doc.type,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
        fileSize: doc.size,
        uploadedBy: doc.uploadedBy,
        description: doc.description || undefined,
      });

      // Update database
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          fileUrl: uploadResult.url,
          blobName: uploadResult.blobName,
        },
      });

      console.log(`✓ Migrated: ${doc.fileName}`);
    } catch (error) {
      console.error(`✗ Failed to migrate ${doc.fileName}:`, error);
    }
  }

  console.log('Migration complete!');
}

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

migrateDocuments()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run the migration:
```bash
npx tsx scripts/migrate-documents-to-azure.ts
```

### Option 2: Incremental Migration

Gradually migrate documents as they are accessed:

```typescript
// In document.service.ts
async getDocumentById(id: string): Promise<DocumentResponseType> {
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document) {
    throw new NotFoundError('Document not found');
  }

  // Check if document needs migration
  if (!document.blobName && document.fileUrl) {
    // Trigger background migration
    this.migrateDocumentToAzure(document).catch(console.error);
  }

  return document;
}

private async migrateDocumentToAzure(document: Document): Promise<void> {
  // Implement migration logic
}
```

## Testing the Migration

### 1. Test Document Upload

```bash
curl -X POST http://localhost:8080/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf" \
  -F "patientId=patient-uuid" \
  -F "type=lab_result"
```

### 2. Test Document Download

```bash
curl -X GET http://localhost:8080/api/documents/doc-uuid/download \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Verify Database

```sql
-- Check new fields are populated
SELECT id, fileName, blobName, version
FROM "Document"
WHERE blobName IS NOT NULL
LIMIT 10;

-- Check version field
SELECT version, COUNT(*) as count
FROM "Document"
GROUP BY version;
```

## Troubleshooting

### Migration Failed

**Error:** "Column already exists"

```bash
# Reset the migration
npx prisma migrate reset

# Or manually fix
psql -h localhost -U unified_health -d unified_health_dev -c "ALTER TABLE \"Document\" DROP COLUMN IF EXISTS \"blobName\";"
psql -h localhost -U unified_health -d unified_health_dev -c "ALTER TABLE \"Document\" DROP COLUMN IF EXISTS \"version\";"

# Then re-run
npx prisma migrate dev
```

### Prisma Client Out of Sync

**Error:** "Prisma Client not generated"

```bash
npx prisma generate
```

### Database Connection Issues

**Error:** "Can't reach database server"

```bash
# Check database is running
pg_isready -h localhost -p 5432

# Test connection
psql -h localhost -U unified_health -d unified_health_dev -c "SELECT 1;"
```

## Post-Migration Checklist

- [ ] Migration applied successfully
- [ ] Prisma Client regenerated
- [ ] Indexes created
- [ ] Sample document uploaded
- [ ] Sample document downloaded
- [ ] Thumbnail generation working (for images)
- [ ] Document versioning working
- [ ] Soft delete working
- [ ] All tests passing

## Support

If you encounter issues:

1. Check the migration SQL in `prisma/migrations/`
2. Review Prisma logs: `DEBUG="prisma:*" npx prisma migrate deploy`
3. Restore from backup if needed
4. Contact the development team

## Additional Resources

- [Prisma Migrations Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Azure Blob Storage Setup Guide](./AZURE_STORAGE_SETUP.md)
