// Two web builds come out of this one project, chosen with APP_VARIANT:
//   client   — the admin app: add and delete orders (the default).
//   customer — read-only order list, deployed to its own URL.
// `npm run build:all` writes them to dist/client and dist/customer.
const variant = process.env.APP_VARIANT === 'customer' ? 'customer' : 'client';
const isCustomer = variant === 'customer';

module.exports = () => ({
  expo: {
    name: isCustomer ? 'Orders' : 'Orders Admin',
    slug: 'cashflow-pending-orders',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'cashflowpendingorders',
    userInterfaceStyle: 'automatic',
    web: {
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: { appVariant: variant },
  },
});
