# Assets Folder

## Adding Your Custom Logo

### Step 1: Add Your Logo Image
Place your logo file in this folder. Supported formats:
- PNG (recommended for transparency)
- JPG/JPEG
- SVG
- GIF

Example: `logo.png`, `company-logo.svg`, etc.

### Step 2: Configure Environment
Edit `src/environments/environment.ts`:

```typescript
appConfig: {
  // ... other config
  logoUrl: 'assets/logo.png',  // Path to your logo
  useCustomLogo: true          // Enable custom logo
}
```

### Logo Specifications

**Recommended Dimensions:**
- Square format: 200x200px or larger
- Transparent background (PNG) works best
- Maximum file size: 500KB recommended

**Logo Display:**
- Login page: Displayed in a circular container (140px diameter)
- The image will be automatically scaled to fit
- `object-fit: contain` ensures proper aspect ratio

### Using External Logo URL

You can also use an external URL:

```typescript
logoUrl: 'https://example.com/logo.png',
useCustomLogo: true
```

### Switching Back to Default SVG Icon

To use the default textile/fabric SVG icon:

```typescript
useCustomLogo: false
```

### Examples

**Local Logo:**
```typescript
logoUrl: 'assets/my-company-logo.png',
useCustomLogo: true
```

**Remote Logo:**
```typescript
logoUrl: 'https://cdn.yourcompany.com/logo.svg',
useCustomLogo: true
```

**Default Icon:**
```typescript
useCustomLogo: false  // logoUrl is ignored when false
```

## Notes

- The logo is currently displayed on the login page
- You can extend this to show in the header by updating `app.component.html`
- Ensure the logo has good contrast against the purple gradient background
- For best results, use a white or light-colored logo on transparent background
