import { displayName } from '@root/package.json';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';

import { ConfigProvider } from '@/hooks/config';

import appCss from '@/styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: displayName },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <ConfigProvider>
        <body>
          {children}
          <Scripts />
        </body>
      </ConfigProvider>
    </html>
  );
}
