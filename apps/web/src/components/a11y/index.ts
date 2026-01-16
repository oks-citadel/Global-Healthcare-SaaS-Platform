/**
 * Accessibility Components
 *
 * A collection of accessible UI components that help meet WCAG 2.1 AA standards.
 * These components provide essential functionality for keyboard navigation,
 * screen reader support, and focus management.
 */

export { SkipLink, SkipLinks } from './SkipLink';
export type { SkipLinkProps, SkipLinksProps } from './SkipLink';

export {
  VisuallyHidden,
  ScreenReaderOnly,
  useVisuallyHidden,
} from './VisuallyHidden';
export type { VisuallyHiddenProps } from './VisuallyHidden';

export { FocusTrap, useFocusTrap } from './FocusTrap';
export type { FocusTrapProps } from './FocusTrap';

export {
  LiveRegion,
  Announcer,
  useAnnouncer,
  StatusMessage,
} from './LiveRegion';
export type {
  LiveRegionProps,
  AnnouncerProps,
  StatusMessageProps,
} from './LiveRegion';
