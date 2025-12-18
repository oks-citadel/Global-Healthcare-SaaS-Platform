# Azure Key Vault Integration - Installation Steps

## Quick Installation

Run the following command in the `services/api` directory:

```bash
npm install @azure/keyvault-secrets @azure/identity
```

## Package Details

The following packages will be added to your dependencies:

### @azure/keyvault-secrets
- **Description**: Azure Key Vault Secrets client library for JavaScript
- **Purpose**: Provides access to Azure Key Vault for storing and retrieving encryption keys
- **Version**: Latest stable version (will be auto-installed)

### @azure/identity
- **Description**: Azure Identity client library for JavaScript
- **Purpose**: Provides authentication methods including DefaultAzureCredential
- **Version**: Latest stable version (will be auto-installed)

## Updated package.json

After installation, your `package.json` dependencies section will include:

```json
{
  "dependencies": {
    "@azure/identity": "^4.0.0",
    "@azure/keyvault-secrets": "^4.8.0",
    // ... existing dependencies
  }
}
```

## Verification

After installation, verify the packages are installed correctly:

```bash
npm list @azure/keyvault-secrets @azure/identity
```

Expected output:
```
@unified-health/api@1.0.0
├── @azure/identity@4.x.x
└── @azure/keyvault-secrets@4.x.x
```

## TypeScript Types

Both packages include TypeScript definitions, so no additional `@types` packages are needed.

## Next Steps

1. Install the packages using the command above
2. Configure environment variables (see AZURE_KEY_VAULT_SETUP.md)
3. Set up Azure Key Vault in Azure Portal
4. Test the integration using examples in encryption.example.ts

## Troubleshooting

### Installation Fails

If installation fails, try:
```bash
npm cache clean --force
npm install @azure/keyvault-secrets @azure/identity
```

### TypeScript Errors

If you see TypeScript errors after installation:
```bash
npm run typecheck
```

If errors persist, ensure your TypeScript version is up to date:
```bash
npm install -D typescript@latest
```

### Module Resolution Issues

If you encounter module resolution issues, ensure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## Security Note

These packages communicate with Azure services. Ensure you:
- Use HTTPS for all Azure connections (default)
- Store credentials securely (use environment variables, never commit)
- Use managed identities in production when possible
- Follow Azure security best practices

## Support

For issues with Azure packages:
- [@azure/keyvault-secrets](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-secrets)
- [@azure/identity](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity)
