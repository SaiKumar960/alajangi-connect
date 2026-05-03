import styles from './Loader.module.css';

/**
 * @param {boolean} fullPage  - centers spinner in full viewport
 * @param {boolean} inline    - small inline spinner
 * @param {string}  text      - optional label below spinner
 */
const Loader = ({ fullPage = false, inline = false, text = '' }) => {
  if (inline) {
    return <span className={styles.inlineSpinner} aria-label="Loading" />;
  }

  return (
    <div className={fullPage ? styles.fullPage : styles.section} role="status">
      <div className={styles.ring}>
        <div />
        <div />
        <div />
        <div />
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Loader;
