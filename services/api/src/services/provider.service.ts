import { providerRepository } from '../repositories/provider.repository.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Provider Service
 * Handles business logic for provider operations
 */
export const providerService = {
  /**
   * Get provider by user ID
   * Used for authorization checks to verify provider access
   */
  async getProviderByUserId(userId: string) {
    return providerRepository.findByUserId(userId);
  },

  /**
   * Get provider by ID
   */
  async getProviderById(id: string) {
    const provider = await providerRepository.findById(id);
    if (!provider) {
      throw new NotFoundError('Provider not found');
    }
    return provider;
  },

  /**
   * Get provider with full details
   */
  async getProviderWithDetails(id: string) {
    const provider = await providerRepository.findWithFullDetails(id);
    if (!provider) {
      throw new NotFoundError('Provider not found');
    }
    return provider;
  },

  /**
   * Get available providers by specialty
   */
  async getAvailableProvidersBySpecialty(specialty: string) {
    return providerRepository.findAvailableBySpecialty(specialty);
  },

  /**
   * Search providers
   */
  async searchProviders(query: string, options?: { limit?: number; onlyAvailable?: boolean }) {
    return providerRepository.searchProviders(query, {
      ...options,
      includeUser: true,
    });
  },

  /**
   * Get provider statistics
   */
  async getProviderStats(providerId: string) {
    return providerRepository.getProviderStats(providerId);
  },
};
