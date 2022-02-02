import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header>
      <Link href="/">
        <div className={styles.container}>
          <img src="/Logo.svg" alt="logo" />
        </div>
      </Link>
    </header>
  );
}
