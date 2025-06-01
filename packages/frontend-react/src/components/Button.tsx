import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-base-100 hover:bg-primary/90 dark:bg-primary dark:text-base-100',
  secondary:
    'bg-secondary text-base-100 hover:bg-secondary/90 dark:bg-secondary dark:text-base-100',
  outline:
    'border border-primary text-primary bg-transparent hover:bg-primary/10',
  ghost:
    'bg-transparent text-primary hover:bg-primary/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', isLoading = false, className, children, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <>
          {isLoading ? (
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-base-100 border-r-base-100 rounded-full inline-block align-middle" />
          ) : null}
          {children}
        </>
      </motion.button>
    );
  }
);

Button.displayName = 'Button'; 