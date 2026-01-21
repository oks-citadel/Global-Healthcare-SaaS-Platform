import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../../src/components/Modal';

describe('Modal Component', () => {
  it('should render modal when isOpen is true', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking inside modal content', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByText('Modal Content'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render modal with title', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Modal Title">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('should support different sizes', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} size="sm">
        <div>Small Modal</div>
      </Modal>
    );
    expect(screen.getByText('Small Modal')).toBeInTheDocument();

    rerender(
      <Modal isOpen onClose={() => {}} size="lg">
        <div>Large Modal</div>
      </Modal>
    );
    expect(screen.getByText('Large Modal')).toBeInTheDocument();
  });

  it('should prevent closing when closeOnOverlay is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose} closeOnOverlay={false}>
        <div>Modal Content</div>
      </Modal>
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(handleClose).not.toHaveBeenCalled();
  });
});
