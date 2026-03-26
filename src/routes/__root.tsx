import { displayName } from '@root/package.json';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { Nav } from '@/components/nav';
import { BrowsingProvider } from '@/hooks/browsing';
import { ConfigProvider } from '@/hooks/config';
import { NavProvider } from '@/hooks/nav';

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
        <NavProvider>
          <BrowsingProvider>
            <body>
              <div className='grid h-dvh max-h-dvh min-h-dvh grid-rows-[auto_1fr] overflow-hidden wrap-anywhere'>
                <Nav />
                <main className='@container overflow-y-auto p-4'>{children}</main>
              </div>
              <TanStackDevtools
                config={{ position: 'bottom-right' }}
                plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
              />
              <Scripts />
            </body>
          </BrowsingProvider>
        </NavProvider>
      </ConfigProvider>
    </html>
  );
}
