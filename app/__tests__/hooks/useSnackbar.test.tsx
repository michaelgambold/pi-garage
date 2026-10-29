import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useSnackbar } from '../../src/hooks/useSnackbar';

describe('useSnackbar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const HookHarness: React.FC<{
    onHook: (hook: ReturnType<typeof useSnackbar>) => void;
    duration?: number;
  }> = ({ onHook, duration }) => {
    const hook = useSnackbar({ duration });
    onHook(hook);
    return null;
  };

  it('initializes with hidden state', () => {
    let hookState: any;
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <HookHarness onHook={(h) => (hookState = h)} />,
      );
    });

    expect(hookState.snackbarVisible).toBe(false);
    expect(hookState.snackbarMessage).toBeNull();
    expect(hookState.snackbarColor).toBeUndefined();
    expect(hookState.snackbarProps.visible).toBe(false);
    expect(hookState.snackbarProps.duration).toBe(Infinity);
  });

  it('shows message and sets error color', () => {
    let hookState: any;
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <HookHarness onHook={(h) => (hookState = h)} />,
      );
    });

    ReactTestRenderer.act(() => {
      hookState.showSnackbar('Door changing state is locked out', true);
    });

    expect(hookState.snackbarVisible).toBe(true);
    expect(hookState.snackbarMessage).toBe('Door changing state is locked out');
    expect(hookState.snackbarColor).toBe('#D32F2F');
    expect(hookState.snackbarKey).toBe(1);
    expect(hookState.snackbarProps.visible).toBe(true);
    expect(hookState.snackbarProps.style).toEqual({ backgroundColor: '#D32F2F' });
    expect(hookState.snackbarProps.children).toBe('Door changing state is locked out');
  });

  it('automatically hides after duration', () => {
    let hookState: any;
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <HookHarness duration={3000} onHook={(h) => (hookState = h)} />,
      );
    });

    ReactTestRenderer.act(() => {
      hookState.showSnackbar('Test message');
    });

    expect(hookState.snackbarVisible).toBe(true);

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(hookState.snackbarVisible).toBe(true);

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(hookState.snackbarVisible).toBe(false);
  });

  it('extends duration and does not bump key when spammed with the same message', () => {
    let hookState: any;
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <HookHarness duration={3000} onHook={(h) => (hookState = h)} />,
      );
    });

    // First call
    ReactTestRenderer.act(() => {
      hookState.showSnackbar('Door changing state is locked out', true);
    });
    expect(hookState.snackbarKey).toBe(1);
    expect(hookState.snackbarVisible).toBe(true);

    // Advance 2 seconds
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(hookState.snackbarVisible).toBe(true);

    // Spam call with the identical message at t=2000ms
    ReactTestRenderer.act(() => {
      hookState.showSnackbar('Door changing state is locked out', true);
    });

    // Key should NOT bump (to prevent flicker)
    expect(hookState.snackbarKey).toBe(1);
    expect(hookState.snackbarVisible).toBe(true);

    // Advance another 2 seconds (t=4000ms total, 2000ms after second call)
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(2000);
    });
    // Should STILL be visible because timer was extended from t=2000ms to t=5000ms!
    expect(hookState.snackbarVisible).toBe(true);

    // Advance remaining 1000ms to reach 3000ms after second call
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(hookState.snackbarVisible).toBe(false);
  });

  it('bumps key on subsequent show after dismissal', () => {
    let hookState: any;
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <HookHarness duration={3000} onHook={(h) => (hookState = h)} />,
      );
    });

    ReactTestRenderer.act(() => {
      hookState.showSnackbar('First call');
    });
    expect(hookState.snackbarKey).toBe(1);

    // Dismiss by timer
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(hookState.snackbarVisible).toBe(false);

    // Show again after dismissal
    ReactTestRenderer.act(() => {
      hookState.showSnackbar('Second call');
    });
    expect(hookState.snackbarKey).toBe(2);
    expect(hookState.snackbarVisible).toBe(true);
  });

  it('allows manual dismissal', () => {
    let hookState: any;
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <HookHarness duration={3000} onHook={(h) => (hookState = h)} />,
      );
    });

    ReactTestRenderer.act(() => {
      hookState.showSnackbar('Manual dismiss');
    });
    expect(hookState.snackbarVisible).toBe(true);

    ReactTestRenderer.act(() => {
      hookState.dismissSnackbar();
    });
    expect(hookState.snackbarVisible).toBe(false);
  });
});
