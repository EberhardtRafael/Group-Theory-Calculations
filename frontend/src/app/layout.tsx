import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

export function generateStaticParams() {
  return [{ locale: 'en' }];
}
