import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface BaseProps {
  label: string;
  error?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

type FloatingInputProps = (
  | (BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false })
  | (BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true })
);

export const FloatingInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FloatingInputProps
>(
  ({ label, error, className = '', multiline = false, rows, ...props }, ref) => {
    const value = (props as any).value;
    return (
      <div className="relative z-0 w-full mb-6 group">
        {multiline ? (
          <textarea
            ref={ref as any}
            rows={rows || 3}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={`block py-2.5 px-0 w-full text-sm text-neutral dark:text-base-100 bg-transparent border-0 border-b-2 ${
              error
                ? 'border-error focus:border-error'
                : 'border-neutral/30 dark:border-base-100/30 focus:border-primary'
            } appearance-none focus:outline-none focus:ring-0 peer resize-none ${className}`}
            placeholder=" "
          />
        ) : (
          <input
            ref={ref as any}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            className={`block py-2.5 px-0 w-full text-sm text-neutral dark:text-base-100 bg-transparent border-0 border-b-2 ${
              error
                ? 'border-error focus:border-error'
                : 'border-neutral/30 dark:border-base-100/30 focus:border-primary'
            } appearance-none focus:outline-none focus:ring-0 peer ${className}`}
            placeholder=" "
          />
        )}
        <motion.label
          initial={false}
          animate={{
            y: value ? -24 : 0,
            scale: value ? 0.75 : 1,
            color: error
              ? 'rgb(220, 38, 38)'
              : value
              ? 'rgb(3, 169, 244)'
              : 'rgb(107, 114, 128)',
          }}
          transition={{ duration: 0.2 }}
          className="absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0"
        >
          {label}
        </motion.label>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-error mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput'; 