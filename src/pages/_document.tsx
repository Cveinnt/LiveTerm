import { Html, Head, Main, NextScript } from 'next/document';

// Dark mode is enforced regardless of system settings: the `dark` class on
// <html> makes every Tailwind `dark:` variant apply (darkMode: 'class').
export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
