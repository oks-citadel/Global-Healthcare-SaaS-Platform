/**
 * Toast notification utility
 * Wraps sonner toast library with custom styling and default options
 *
 * NOTE: Requires 'sonner' package to be installed:
 * npm install sonner
 */

import { toast as sonnerToast, type ExternalToast } from 'sonner';

const defaultOptions: ExternalToast = {
  duration: 4000,
  position: 'top-right',
};

export const toast = {
  success: (message: string, options?: ExternalToast) => {
    return sonnerToast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ExternalToast) => {
    return sonnerToast.error(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ExternalToast) => {
    return sonnerToast.info(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ExternalToast) => {
    return sonnerToast.warning(message, { ...defaultOptions, ...options });
  },

  loading: (message: string, options?: ExternalToast) => {
    return sonnerToast.loading(message, { ...defaultOptions, ...options });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ExternalToast
  ) => {
    return sonnerToast.promise(promise, messages, { ...defaultOptions, ...options });
  },

  custom: (message: string | React.ReactNode, options?: ExternalToast) => {
    return sonnerToast(message, { ...defaultOptions, ...options });
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },
};

export default toast;
