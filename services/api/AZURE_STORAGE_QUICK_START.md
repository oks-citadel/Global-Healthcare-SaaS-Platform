# Azure Blob Storage - Quick Start Guide

Get up and running with Azure Blob Storage in 5 minutes.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed ([Download](https://docs.microsoft.com/cli/azure/install-azure-cli))
- Node.js 18+ and npm

## Quick Setup (Automated)

### 1. Login to Azure

```bash
az login
```

### 2. Run Setup Script

```bash
cd services/api
chmod +x scripts/setup-azure-storage.sh
./scripts/setup-azure-storage.sh dev
```

The script will:
- Create resource group
- Create storage account
- Enable versioning and soft delete
- Create containers
- Apply lifecycle policies
- Configure CORS
- Output connection string

### 3. Configure Environment

Copy the connection string from the script output and add to `.env`:

```bash
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_CONTAINER_NAME=healthcare-documents
MAX_FILE_SIZE=104857600
```

### 4. Test the Integration

```bash
npm run dev
```

Test upload:
```bash
curl -X POST http://localhost:8080/api/documents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-123",
    "type": "lab-result",
    "fileName": "test.pdf",
    "mimeType": "application/pdf"
  }'
```

## Manual Setup

### 1. Create Storage Account

```bash
az storage account create \
  --name healthcarestoragedev \
  --resource-group healthcare-dev-rg \
  --location eastus \
  --sku Standard_GRS \
  --https-only true
```

### 2. Get Connection String

```bash
az storage account show-connection-string \
  --name healthcarestoragedev \
  --resource-group healthcare-dev-rg
```

### 3. Create Container

```bash
az storage container create \
  --name healthcare-documents \
  --account-name healthcarestoragedev \
  --public-access off
```

### 4. Add to .env

```bash
AZURE_STORAGE_CONNECTION_STRING=<your-connection-string>
AZURE_STORAGE_CONTAINER_NAME=healthcare-documents
```

## Local Development (Azurite)

For local development without Azure:

### 1. Install Azurite

```bash
npm install -g azurite
```

### 2. Start Azurite

```bash
azurite --silent --location /tmp/azurite
```

### 3. Use Development Connection String

Add to `.env`:

```bash
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
```

## Virus Scanning Setup

### Option 1: ClamAV (Recommended for development)

```bash
# Install ClamAV
sudo apt-get install clamav clamav-daemon  # Ubuntu/Debian
brew install clamav                        # macOS

# Update virus definitions
sudo freshclam

# Start daemon
sudo systemctl start clamav-daemon

# Configure in .env
CLAMAV_ENABLED=true
CLAMAV_HOST=localhost
CLAMAV_PORT=3310
```

### Option 2: Azure Defender (Recommended for production)

Enable in Azure Portal:
1. Navigate to Storage Account
2. Security → Microsoft Defender for Cloud
3. Enable Microsoft Defender for Storage

Configure in `.env`:
```bash
AZURE_DEFENDER_ENABLED=true
```

## Testing the Integration

### 1. Generate Upload URL

```bash
curl -X POST http://localhost:8080/api/documents/{doc-id}/upload-url \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000
  }'
```

Response:
```json
{
  "uploadUrl": "https://...?sig=...",
  "blobName": "patient-123/lab-result/...",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### 2. Upload File Directly to Azure

```bash
curl -X PUT "$UPLOAD_URL" \
  -H "x-ms-blob-type: BlockBlob" \
  -H "Content-Type: application/pdf" \
  --data-binary @test.pdf
```

### 3. Generate Download URL

```bash
curl -X GET http://localhost:8080/api/documents/{doc-id}/download-url \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "downloadUrl": "https://...?sig=...",
  "expiresAt": "2024-01-01T13:00:00Z"
}
```

### 4. Download File

```bash
curl -o downloaded.pdf "$DOWNLOAD_URL"
```

## Common Configuration

### Production Settings

```bash
# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=<production-connection-string>
AZURE_STORAGE_CONTAINER_NAME=healthcare-documents
MAX_FILE_SIZE=104857600

# Security
SAS_ALLOWED_IP_RANGE=10.0.0.0/24
AZURE_DEFENDER_ENABLED=true

# Retry
STORAGE_MAX_RETRIES=3
STORAGE_RETRY_DELAY=1000
STORAGE_RETRY_BACKOFF=2
```

### Development Settings

```bash
# Azure Storage (Azurite)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;...
AZURE_STORAGE_CONTAINER_NAME=healthcare-documents
MAX_FILE_SIZE=104857600

# Security (relaxed for dev)
CLAMAV_ENABLED=false
AZURE_DEFENDER_ENABLED=false
```

## Troubleshooting

### Issue: Container not found

**Solution:**
```bash
# Create container manually
az storage container create \
  --name healthcare-documents \
  --account-name <your-account> \
  --public-access off
```

### Issue: Authentication failed

**Solution:**
1. Verify connection string is correct
2. Check storage account key hasn't been rotated
3. Regenerate connection string:
   ```bash
   az storage account show-connection-string \
     --name <your-account> \
     --resource-group <your-rg>
   ```

### Issue: Upload fails with CORS error

**Solution:**
```bash
# Update CORS settings
az storage cors add \
  --account-name <your-account> \
  --services b \
  --origins "http://localhost:3000" \
  --methods GET PUT POST DELETE HEAD OPTIONS
```

### Issue: Virus scan failing

**Solution:**
1. Check ClamAV is running:
   ```bash
   systemctl status clamav-daemon
   ```
2. Update virus definitions:
   ```bash
   sudo freshclam
   ```
3. Verify connectivity:
   ```bash
   telnet localhost 3310
   ```

## Next Steps

1. Review full documentation: [README_AZURE_BLOB_STORAGE.md](./README_AZURE_BLOB_STORAGE.md)
2. Configure lifecycle policies for production
3. Set up monitoring and alerts
4. Implement backup strategy
5. Review security settings

## Support

- Documentation: [README_AZURE_BLOB_STORAGE.md](./README_AZURE_BLOB_STORAGE.md)
- Azure Docs: https://docs.microsoft.com/azure/storage/blobs/
- Internal Support: support@yourdomain.com
