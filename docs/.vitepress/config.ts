import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Fledge',
  description:
    'Streamline project scaffolding and future-proof your development with flexible, scalable templates.',

  head: [
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/fledge/icons/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/fledge/icons/favicon.svg',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/fledge/icons/favicon-48x48.png',
      },
    ],
  ],

  srcDir: 'src',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: {
      light: '/images/fledge-black.svg',
      dark: '/images/fledge-white.svg',
    },

    siteTitle: false,

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Config', link: '/config/' },
    ],

    sidebar: {
      '/guide': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'CLI', link: '/guide/cli/' },
          ],
        },
      ],
      '/config': [
        {
          text: 'Config',
          items: [
            { text: 'Configuring Fledge', link: '/config/' },
            { text: 'Create Fledge stack(s)', link: '/config/create-stack/' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/schapka/fledge' }],
  },
});
