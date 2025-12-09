# Application Customization Guide

## How to Change the Application Name

The application name "Textile Shop" and all related text is now fully configurable through environment variables. You can easily rebrand the entire application by editing a single configuration file.

## How to Add Your Custom Logo

You can replace the default SVG icon with your own logo image.

### Step 1: Add Your Logo File

1. Place your logo image in the `src/assets/` folder
2. Supported formats: PNG, JPG, SVG, GIF
3. Recommended: Square format (200x200px or larger) with transparent background

### Step 2: Configure Environment

Edit `src/environments/environment.ts`:

```typescript
appConfig: {
  // ... other properties
  logoUrl: 'assets/your-logo.png',  // Path to your logo
  useCustomLogo: true               // Enable custom logo
}
```

**Options:**
- **Local file:** `'assets/logo.png'`
- **External URL:** `'https://yoursite.com/logo.png'`
- **Default SVG icon:** Set `useCustomLogo: false`

### For Development Environment

Edit the file: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appConfig: {
    appName: 'Your Business Name',           // Used in footer
    appTitle: 'Your Business Management',    // Used in header
    appSubtitle: 'Your Custom Subtitle',     // Used in header tagline
    version: '1.0',                          // Version number
    poweredBy: 'Angular',                    // Technology name
    logoUrl: 'assets/logo.png',              // Path to logo image
    useCustomLogo: false                     // Set true to use custom logo
  }
};
```

### For Production Environment

Edit the file: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  appConfig: {
    appName: 'Your Business Name',
    appTitle: 'Your Business Management',
    appSubtitle: 'Your Custom Subtitle',
    version: '1.0',
    poweredBy: 'Angular',
    logoUrl: 'assets/logo.png',
    useCustomLogo: false
  }
};
```

### Configuration Properties

| Property | Used In | Example |
|----------|---------|---------|
| `appName` | Footer, Login page title | "Textile Shop" |
| `appTitle` | Main header | "Textile Shop Management" |
| `appSubtitle` | Header tagline, Login page | "Product & Billing Management System" |
| `version` | Footer | "1.0" |
| `poweredBy` | Footer | "Angular" |
| `logoUrl` | Login page logo | "assets/logo.png" |
| `useCustomLogo` | Enable/disable custom logo | true or false |

### Example: Rebranding for a Different Business

**For a Fashion Boutique:**
```typescript
appConfig: {
  appName: 'Fashion Boutique',
  appTitle: 'Fashion Boutique Management',
  appSubtitle: 'Inventory & Sales Management System',
  version: '1.0',
  poweredBy: 'Angular',
  logoUrl: 'assets/boutique-logo.png',
  useCustomLogo: true
}
```

**For a Hardware Store:**
```typescript
appConfig: {
  appName: 'Hardware Store',
  appTitle: 'Hardware Store Management',
  appSubtitle: 'Product & Billing Management System',
  version: '1.0',
  poweredBy: 'Angular',
  logoUrl: 'https://yoursite.com/hardware-logo.svg',
  useCustomLogo: true
}
```

**For a General Retail Shop:**
```typescript
appConfig: {
  appName: 'Retail Pro',
  appTitle: 'Retail Pro Management',
  appSubtitle: 'Complete Business Management Solution',
  version: '2.0',
  poweredBy: 'Angular',
  logoUrl: 'assets/retail-logo.png',
  useCustomLogo: true
}
```

### Where These Values Appear

1. **Login Page:**
   - `appName` appears in the logo section title
   - `appSubtitle` appears below the app name

2. **Main Application Header:**
   - `appTitle` appears in the header (with 🧵 emoji)
   - `appSubtitle` appears as the tagline

3. **Footer:**
   - `appName` in copyright text
   - `version` displays version number
   - `poweredBy` shows the technology

### After Making Changes

1. Stop the development server if it's running (Ctrl+C)
2. Save your changes to the environment file
3. Restart the development server:
   ```bash
   npm start
   ```

The changes will be reflected immediately throughout the entire application!

### Notes

- No code changes are needed - just update the environment file
- All text updates automatically across all pages
- Use different configurations for development and production
- The emoji (🧵) in the header can be removed by editing `app.component.html` if desired
