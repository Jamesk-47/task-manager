// app/GlobalStyles.tsx
'use client';

export default function GlobalStyles() {
  return (
    <style jsx global>{`
      :root {
        --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      body {
        font-family: var(--font-inter, var(--font-sans));
      }
    `}</style>
  );
}