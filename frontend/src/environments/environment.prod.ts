// Production Environment configuration
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api', // Update this with your production backend URL
  appConfig: {
    appName: 'Textile Shop',
    appTitle: 'Textile Shop Management',
    appSubtitle: 'Product & Billing Management System',
    version: '1.0',
    poweredBy: 'Angular',
    logoUrl: 'assets/logo.png', // Path to your logo image (or external URL)
    useCustomLogo: false // Set to true to use logoUrl instead of SVG icon
  }
};
