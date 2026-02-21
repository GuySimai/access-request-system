import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Toast } from '@vibe/core';

type ToastType = (typeof Toast.types)[keyof typeof Toast.types];

export const TOAST_TYPES = Toast.types;

export type TToastRaiseOptions = {
  closeable?: boolean;
  loading?: boolean;
  autoClose?: boolean;
};

type TToastContext = {
  show: boolean;
  loading: boolean;
  closeable: boolean;
  message: string | ReactNode;
  type: ToastType;
  autoClose: boolean;
  close: () => void;
  raise: (
    message: string | ReactNode,
    type: ToastType,
    options?: TToastRaiseOptions
  ) => void;
};

const ToastContext = createContext<TToastContext | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | ReactNode>('');
  const [type, setType] = useState<ToastType>(TOAST_TYPES.NORMAL);
  const [loading, setLoading] = useState(false);
  const [closeable, setCloseable] = useState(true);
  const [autoClose, setAutoClose] = useState(true);

  const close = useCallback(() => {
    setShow(false);
  }, []);

  const raise = useCallback(
    (msg: string | ReactNode, t: ToastType, options?: TToastRaiseOptions) => {
      setMessage(msg);
      setType(t);
      setLoading(options?.loading ?? false);
      setCloseable(options?.closeable ?? true);
      setAutoClose(options?.autoClose ?? true);
      setShow(true);
    },
    []
  );

  return (
    <ToastContext.Provider
      value={{
        show,
        closeable,
        loading,
        message,
        type,
        autoClose,
        close,
        raise,
      }}
    >
      {children}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
        }}
      >
        <Toast
          open={show}
          closeable={closeable}
          loading={loading}
          type={type}
          onClose={close}
          autoHideDuration={autoClose ? 3000 : undefined}
        >
          {message}
        </Toast>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
