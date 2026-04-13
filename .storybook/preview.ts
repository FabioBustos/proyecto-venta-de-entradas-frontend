import type { Preview } from '@storybook/react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
    nextjs: {
      appDirectory: true,
      router: {
        basePath: '',
        pathname: '/',
        route: '/',
        asPath: '/',
        query: {},
        push: async () => true,
        replace: async () => true,
        reload: () => {},
        back: () => {},
        prefetch: async () => undefined,
        beforePopState: () => {},
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        isPreview: false,
        locale: 'es',
        domains: [],
        localeDomains: {},
      },
    },
  },
}

export default preview