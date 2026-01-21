/**
 * Skeleton Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  AppointmentSkeleton,
  PatientCardSkeleton,
  VitalsSkeleton,
  LabResultSkeleton,
} from '../../src/components/Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('renders with custom dimensions', () => {
    render(<Skeleton width={200} height={100} data-testid="skeleton" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('renders with circular variant', () => {
    render(<Skeleton variant="circular" data-testid="skeleton" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('renders with pulse animation', () => {
    render(<Skeleton animation="pulse" data-testid="skeleton" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders with no animation', () => {
    render(<Skeleton animation="none" data-testid="skeleton" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).not.toHaveClass('animate-pulse');
  });

  it('has accessible label', () => {
    render(<Skeleton aria-label="Loading content" data-testid="skeleton" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
  });
});

describe('SkeletonText', () => {
  it('renders the correct number of lines', () => {
    render(<SkeletonText lines={3} />);
    // Container has role=status with aria-label
    const container = screen.getByRole('status', { name: /loading text/i });
    expect(container).toBeInTheDocument();
    // Check for 3 child skeleton elements (they have bg-gray-200 class)
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBe(3);
  });

  it('renders specified number of lines', () => {
    render(<SkeletonText lines={5} />);
    const container = screen.getByRole('status', { name: /loading text/i });
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBe(5);
  });

  it('has last line with reduced width', () => {
    const { container } = render(<SkeletonText lines={3} lastLineWidth="50%" />);
    const skeletonLines = container.querySelectorAll('.bg-gray-200');
    const lastLine = skeletonLines[skeletonLines.length - 1];
    expect(lastLine).toHaveStyle({ width: '50%' });
  });
});

describe('SkeletonAvatar', () => {
  it('renders with medium size by default', () => {
    render(<SkeletonAvatar />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('renders with small size', () => {
    render(<SkeletonAvatar size="sm" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('renders with large size', () => {
    render(<SkeletonAvatar size="lg" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('renders with xl size', () => {
    render(<SkeletonAvatar size="xl" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '64px', height: '64px' });
  });
});

describe('SkeletonCard', () => {
  it('renders basic card', () => {
    render(<SkeletonCard />);
    const skeleton = screen.getByRole('status', { name: /loading card/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with avatar', () => {
    render(<SkeletonCard hasAvatar />);
    const skeleton = screen.getByRole('status', { name: /loading card/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with image', () => {
    render(<SkeletonCard hasImage />);
    const skeleton = screen.getByRole('status', { name: /loading card/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with actions', () => {
    render(<SkeletonCard hasActions />);
    const skeleton = screen.getByRole('status', { name: /loading card/i });
    expect(skeleton).toBeInTheDocument();
  });
});

describe('SkeletonTable', () => {
  it('renders with default rows and columns', () => {
    render(<SkeletonTable />);
    const skeleton = screen.getByRole('status', { name: /loading table/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders specified rows', () => {
    render(<SkeletonTable rows={3} />);
    const skeleton = screen.getByRole('status', { name: /loading table/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders without header', () => {
    render(<SkeletonTable hasHeader={false} />);
    const skeleton = screen.getByRole('status', { name: /loading table/i });
    expect(skeleton).toBeInTheDocument();
  });
});

describe('AppointmentSkeleton', () => {
  it('renders compact variant', () => {
    render(<AppointmentSkeleton variant="compact" />);
    const skeleton = screen.getByRole('status', { name: /loading appointment/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders detailed variant', () => {
    render(<AppointmentSkeleton variant="detailed" />);
    const skeleton = screen.getByRole('status', { name: /loading.*appointment/i });
    expect(skeleton).toBeInTheDocument();
  });
});

describe('PatientCardSkeleton', () => {
  it('renders with vitals', () => {
    render(<PatientCardSkeleton showVitals />);
    const skeleton = screen.getByRole('status', { name: /loading patient/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders without vitals', () => {
    render(<PatientCardSkeleton showVitals={false} />);
    const skeleton = screen.getByRole('status', { name: /loading patient/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders without actions', () => {
    render(<PatientCardSkeleton showActions={false} />);
    const skeleton = screen.getByRole('status', { name: /loading patient/i });
    expect(skeleton).toBeInTheDocument();
  });
});

describe('VitalsSkeleton', () => {
  it('renders grid layout', () => {
    render(<VitalsSkeleton layout="grid" />);
    const skeleton = screen.getByRole('status', { name: /loading vital/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders row layout', () => {
    render(<VitalsSkeleton layout="row" />);
    const skeleton = screen.getByRole('status', { name: /loading vital/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders compact layout', () => {
    render(<VitalsSkeleton layout="compact" />);
    const skeleton = screen.getByRole('status', { name: /loading vital/i });
    expect(skeleton).toBeInTheDocument();
  });
});

describe('LabResultSkeleton', () => {
  it('renders with specified result count', () => {
    render(<LabResultSkeleton resultCount={10} />);
    const skeleton = screen.getByRole('status', { name: /loading lab/i });
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with chart', () => {
    render(<LabResultSkeleton showChart />);
    const skeleton = screen.getByRole('status', { name: /loading lab/i });
    expect(skeleton).toBeInTheDocument();
  });
});
