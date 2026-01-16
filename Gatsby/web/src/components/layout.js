import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import * as styles from "./layout.module.scss";

export default function Layout({ title = "Espacios Culturales de Canarias", children }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link to="/" className={styles.brandLink}>
          <h1 className={styles.h1}>{title}</h1>
        </Link>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerImage}>
          <StaticImage
            src="../images/footer.png"
            alt="Paisaje de Canarias"
            placeholder="blurred"
            layout="fixed"
            height={25}
          />
        </div>

        <div className={styles.footerText}>
          © {new Date().getFullYear()} - Espacios Culturales
        </div>

      </footer>
    </div>
  );
}
