import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Styled input with label, error, and optional icon
 */
const Input = forwardRef(({
  label,
  id,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...rest
}, ref) => {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputRow}>
        {Icon && (
          <span className={styles.icon} aria-hidden="true">
            <Icon size={16} />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={[
            styles.input,
            Icon ? styles.withIcon : '',
            error ? styles.hasError : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
