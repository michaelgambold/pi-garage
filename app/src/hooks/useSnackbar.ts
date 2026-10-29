import { useState, useRef, useCallback, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface UseSnackbarOptions {
  duration?: number;
  errorColor?: string;
}

export interface SnackbarProps {
  key: number;
  visible: boolean;
  onDismiss: () => void;
  duration: number;
  style?: StyleProp<ViewStyle>;
  children: string;
}

export interface UseSnackbarResult {
  showSnackbar: (message: string, isError?: boolean) => void;
  dismissSnackbar: () => void;
  snackbarMessage: string | null;
  snackbarColor: string | undefined;
  snackbarVisible: boolean;
  snackbarKey: number;
  snackbarProps: SnackbarProps;
}

export const useSnackbar = (options?: UseSnackbarOptions): UseSnackbarResult => {
  const defaultDuration = options?.duration ?? 3000;
  const errorColor = options?.errorColor ?? '#D32F2F';

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarColor, setSnackbarColor] = useState<string | undefined>(undefined);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dismissSnackbar = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSnackbarVisible(false);
  }, []);

  const showSnackbar = useCallback(
    (newMessage: string, isError = false) => {
      // Clear any pending dismissal timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setSnackbarMessage(newMessage);
      setSnackbarColor(isError ? errorColor : undefined);

      setSnackbarVisible((prevVisible) => {
        // Only bump the key if the snackbar was not previously visible.
        // If already visible, bumping key causes an unmount/remount flicker during spamming.
        // If not visible (or mid-dismissal), bumping key ensures a fresh instance without animation desync.
        if (!prevVisible) {
          setSnackbarKey((prevKey) => prevKey + 1);
        }
        return true;
      });

      // Manage duration manually with duration=Infinity on Paper's Snackbar
      // so rapid spamming reliably extends the timer from the latest call.
      timerRef.current = setTimeout(() => {
        setSnackbarVisible(false);
        timerRef.current = null;
      }, defaultDuration);
    },
    [defaultDuration, errorColor],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return {
    showSnackbar,
    dismissSnackbar,
    snackbarMessage,
    snackbarColor,
    snackbarVisible,
    snackbarKey,
    snackbarProps: {
      key: snackbarKey,
      visible: snackbarVisible,
      onDismiss: dismissSnackbar,
      duration: Infinity,
      style: snackbarColor ? { backgroundColor: snackbarColor } : undefined,
      children: snackbarMessage || '',
    },
  };
};
