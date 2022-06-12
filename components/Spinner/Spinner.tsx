import styles from './Spinner.module.css'

export const Spinner = () => {
  return (
    <div className={styles.spinWrapper}>
      <div className={styles.spinner}></div>
    </div>
  )
}
