/**
 * Provider/Doctor Hooks
 * Manages provider search, profiles, and availability
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import {
  Provider,
  ProviderSearchParams,
  TimeSlot,
  AvailabilitySlot,
  PaginatedResponse,
} from '../types';

// Search providers with filters
export const useProviderSearch = (params: ProviderSearchParams) => {
  return useInfiniteQuery({
    queryKey: ['providers', 'search', params],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams();

      if (params.query) queryParams.append('query', params.query);
      if (params.specialty) queryParams.append('specialty', params.specialty);
      if (params.location) queryParams.append('location', params.location);
      if (params.acceptingNewPatients !== undefined) {
        queryParams.append('acceptingNewPatients', String(params.acceptingNewPatients));
      }
      if (params.insuranceAccepted) queryParams.append('insuranceAccepted', params.insuranceAccepted);
      if (params.gender) queryParams.append('gender', params.gender);
      if (params.language) queryParams.append('language', params.language);
      if (params.availableDate) queryParams.append('availableDate', params.availableDate);
      if (params.appointmentType) queryParams.append('appointmentType', params.appointmentType);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      queryParams.append('page', String(pageParam));
      queryParams.append('limit', String(params.limit || 20));

      const response = await apiClient.get<PaginatedResponse<Provider>>(
        `/providers/search?${queryParams.toString()}`
      );
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil(lastPage.total / (params.limit || 20));
      return pages.length < totalPages ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Fetch single provider profile
export const useProvider = (id: string) => {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      const response = await apiClient.get<Provider>(`/providers/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

// Fetch provider availability for a specific date range
export const useProviderAvailability = (
  providerId: string,
  startDate: string,
  endDate: string,
  appointmentType?: string
) => {
  return useQuery({
    queryKey: ['provider', providerId, 'availability', startDate, endDate, appointmentType],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      if (appointmentType) params.append('appointmentType', appointmentType);

      const response = await apiClient.get<TimeSlot[]>(
        `/providers/${providerId}/availability?${params.toString()}`
      );
      return response;
    },
    enabled: !!providerId && !!startDate && !!endDate,
  });
};

// Fetch available time slots for a specific date
export const useTimeSlots = (
  providerId: string,
  date: string,
  appointmentType?: string
) => {
  return useQuery({
    queryKey: ['provider', providerId, 'slots', date, appointmentType],
    queryFn: async () => {
      const params = new URLSearchParams({ date });
      if (appointmentType) params.append('appointmentType', appointmentType);

      const response = await apiClient.get<TimeSlot[]>(
        `/providers/${providerId}/slots?${params.toString()}`
      );
      return response;
    },
    enabled: !!providerId && !!date,
    staleTime: 1000 * 60 * 5, // 5 minutes - slots can change frequently
  });
};

// Fetch list of specialties
export const useSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const response = await apiClient.get<string[]>('/providers/specialties');
      return response;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - specialties rarely change
  });
};

// Fetch featured/recommended providers
export const useFeaturedProviders = (limit = 5) => {
  return useQuery({
    queryKey: ['providers', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get<Provider[]>(
        `/providers/featured?limit=${limit}`
      );
      return response;
    },
  });
};

// Fetch nearby providers (requires location)
export const useNearbyProviders = (
  latitude: number,
  longitude: number,
  radiusMiles = 25,
  specialty?: string
) => {
  return useQuery({
    queryKey: ['providers', 'nearby', latitude, longitude, radiusMiles, specialty],
    queryFn: async () => {
      const params = new URLSearchParams({
        lat: String(latitude),
        lng: String(longitude),
        radius: String(radiusMiles),
      });
      if (specialty) params.append('specialty', specialty);

      const response = await apiClient.get<Provider[]>(
        `/providers/nearby?${params.toString()}`
      );
      return response;
    },
    enabled: !!latitude && !!longitude,
  });
};

// Toggle favorite provider
export const useFavoriteProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ providerId, isFavorite }: { providerId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        await apiClient.delete(`/patients/favorites/${providerId}`);
      } else {
        await apiClient.post(`/patients/favorites/${providerId}`);
      }
      return { providerId, isFavorite: !isFavorite };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};

// Fetch patient's favorite providers
export const useFavoriteProviders = () => {
  return useQuery({
    queryKey: ['favorites', 'providers'],
    queryFn: async () => {
      const response = await apiClient.get<Provider[]>('/patients/favorites');
      return response;
    },
  });
};

// Fetch provider reviews
export const useProviderReviews = (providerId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['provider', providerId, 'reviews', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<{
        id: string;
        rating: number;
        comment?: string;
        patientName: string;
        createdAt: string;
      }>>(`/providers/${providerId}/reviews?page=${page}&limit=${limit}`);
      return response;
    },
    enabled: !!providerId,
  });
};

// Submit provider review
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      providerId,
      rating,
      comment,
    }: {
      providerId: string;
      rating: number;
      comment?: string;
    }) => {
      const response = await apiClient.post(`/providers/${providerId}/reviews`, {
        rating,
        comment,
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['provider', variables.providerId, 'reviews']
      });
      queryClient.invalidateQueries({
        queryKey: ['provider', variables.providerId]
      });
    },
  });
};
