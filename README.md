# KatGrapher.Studio Portfolio

A modern, responsive portfolio website showcasing photography and web development work, built with HTML, Tailwind CSS, and Sanity CMS.

## 🌟 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark UI with custom brand colors
- **Photography Gallery**: Dynamic photo gallery with filtering capabilities
- **Project Showcase**: Web development portfolio with Sanity CMS integration
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA labels
- **Performance**: Optimized Tailwind CSS build and efficient asset loading
- **GitHub Pages Ready**: Automated deployment to custom domain

## 📁 Project Structure

```
katgrapher-studio/
├── .github/workflows/          # GitHub Pages deployment workflow
│   └── pages.yml
├── assets/                     # Static assets
│   └── input.css              # Tailwind CSS source
├── dist/                      # Compiled CSS output
│   └── output.css             # Production-ready CSS
├── sanity-schemas/            # Sanity CMS schemas
│   ├── schema.js              # Main schema configuration
│   ├── category.js            # Photo categories
│   ├── photo.js               # Photography content
│   ├── project.js             # Web development projects
│   └── settings.js            # Site configuration
├── scripts/                   # JavaScript modules
│   ├── main.js                # Homepage functionality
│   ├── gallery.js             # Photo gallery features
│   ├── render.js              # Content rendering from CMS
│   ├── sanity-client.js       # Sanity API client
│   ├── lightbox.js            # Photo lightbox functionality
│   └── config.js              # Sanity configuration
├── index.html                 # Homepage
├── gallery.html               # Photography gallery page
├── package.json               # Node.js dependencies
├── tailwind.config.js         # Tailwind CSS configuration
├── CNAME                      # GitHub Pages custom domain
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub account (for deployment)
- Sanity.io account (for content management)

### Local Development

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd katgrapher-studio
   npm install
   ```

2. **Build the CSS:**
   ```bash
   npm run build
   ```

3. **View the site:**
   Open `index.html` in your browser or serve with a local server:
   ```bash
   # Using Python (if installed)
   python -m http.server 8000

   # Using Node.js
   npx serve .
   ```

## 🎨 Customization

### Brand Colors

The site uses custom brand colors defined in `tailwind.config.js`:

- **Brand Green**: `#22c55e` (primary color)
- **Brand Green Dark**: `#16a34a` (hover states)
- **Brand Neon**: `#00ff66` (accents)
- **Brand Yellow**: `#facc15` (secondary color)

To modify colors, edit the `tailwind.config.js` file:

```javascript
colors: {
  brand: {
    green: {
      DEFAULT: '#your-color',
      dark: '#your-darker-color',
      neon: '#your-neon-color',
    },
    yellow: {
      DEFAULT: '#your-color',
      dark: '#your-darker-color',
    },
  },
}
```

## 🔧 Setup Instructions

### GitHub Pages Configuration

1. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Select "GitHub Actions" as the source

2. **Custom Domain (katgrapher.studio):**
   - Add `CNAME` file with your domain: `katgrapher.studio`
   - Configure DNS settings with your domain registrar:
     - `CNAME` record pointing to `yourusername.github.io`
     - Or `A` records pointing to GitHub Pages IPs

3. **SSL Certificate:**
   - GitHub Pages automatically provides HTTPS
   - Ensure your domain registrar supports CAA records for Let's Encrypt

### DNS Setup for katgrapher.studio

If using a custom domain, configure these DNS records:

```dns
# Required
CNAME   katgrapher.studio   yourusername.github.io

# Alternative (if CNAME not supported)
A       katgrapher.studio   185.199.108.153
A       katgrapher.studio   185.199.109.153
A       katgrapher.studio   185.199.110.153
A       katgrapher.studio   185.199.111.153

# Optional: Enforce HTTPS
CAA     katgrapher.studio   0 issue "letsencrypt.org"
```

## 🛠 Sanity CMS Setup

### Creating a New Sanity Project

1. **Install Sanity CLI:**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Initialize Project:**
   ```bash
   sanity init
   ```
   - Select "Clean project with no predefined schemas"
   - Choose your project name (e.g., "katgrapher-studio")
   - Select dataset name (e.g., "production")

3. **Copy Schema Files:**
   ```bash
   # Copy schema files to your Sanity project
   cp -r sanity-schemas/* your-sanity-project/schemas/
   ```

4. **Update Sanity Configuration:**
   ```javascript
   // sanity.config.js
   import {defineConfig} from 'sanity'
   import {schemaTypes} from './schemas/schema'

   export default defineConfig({
     name: 'default',
     title: 'KatGrapher Studio',

     projectId: 'your-project-id', // From sanity.io
     dataset: 'production',

     schema: {
       types: schemaTypes,
     },

     plugins: [
       // Add any additional plugins here
     ],
   })
   ```

### Deploy Sanity Schemas

1. **Deploy to Sanity:**
   ```bash
   cd your-sanity-project
   sanity deploy
   ```

2. **Set Dataset to Public Read:**
   - Go to sanity.io → Your Project → Settings → API
   - Enable "Public read access" for your dataset

3. **Add CORS Origins:**
   ```bash
   # For production
   sanity cors add https://katgrapher.studio

   # For development
   sanity cors add http://localhost:3000
   sanity cors add http://localhost:8000
   ```

### Update Configuration

1. **Get your Project ID:**
   - Go to sanity.io → Your Project → Settings → API
   - Copy the Project ID

2. **Update `scripts/config.js`:**
   ```javascript
   export const sanityConfig = {
     projectId: 'your-actual-project-id', // Replace with real ID
     dataset: 'production',
     apiVersion: 'v2024-01-01',
     cdnUrl: 'https://cdn.sanity.io',
   };
   ```

## 📝 Content Management

### Adding Projects

1. **In Sanity Studio:**
   - Go to your-project.sanity.studio
   - Navigate to "Projects"
   - Click "Create new project"

2. **Required Fields:**
   - **Title**: Project name
   - **Slug**: URL-friendly version (auto-generated)
   - **Description**: Project overview
   - **Technologies**: Tech stack used
   - **Featured**: Mark as featured to show on homepage
   - **Images**: Project screenshots or photos
   - **Links**: Live demo and source code URLs

### Adding Photography

1. **Create Categories First:**
   - Go to "Categories" in Sanity Studio
   - Add: Animals, Insects, People, Plants, etc.

2. **Add Photos:**
   - Navigate to "Photos"
   - Click "Create new photo"
   - **Required Fields:**
     - **Title**: Photo title
     - **Image**: Upload photo file
     - **Category**: Select from existing categories
     - **Featured**: Mark for homepage display

3. **Photo Guidelines:**
   - Use high-quality images (recommended: 2000px+ on longest side)
   - Optimize for web (JPEG/WebP format)
   - Add descriptive titles and alt text
   - Organize with consistent categories

### Site Settings

Configure global site settings through Sanity:

1. **Navigate to "Settings" in Sanity Studio**
2. **Configure:**
   - Site title and description
   - Contact information
   - Social media links
   - SEO settings

## 🔄 Deployment Workflow

### Automatic Deployment

The project is configured for automatic deployment via GitHub Actions:

1. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **GitHub Actions will:**
   - Install dependencies
   - Build Tailwind CSS
   - Deploy to GitHub Pages

### Manual Deployment

1. **Build the project:**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   - Push the `dist/` folder contents to your repository
   - Or use GitHub Pages "Deploy from a branch" option

### Build Process

The `npm run build` command:
- Compiles `./assets/input.css` with Tailwind
- Processes custom brand colors and utilities
- Minifies output for production
- Generates `./dist/output.css`

## 🔧 Development

### Available Scripts

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development (add watch mode if needed)
# npm run dev
```

### File Watching

For development, you can use tools like:

```bash
# Using browser-sync
npx browser-sync start --server --files "*.html,scripts/*.js,dist/*.css"

# Using live-server
npx live-server --port=8000
```

### Code Organization

- **HTML**: Semantic, accessible markup
- **CSS**: Tailwind utilities + custom components
- **JavaScript**: Modular ES6+ code
- **CMS**: Sanity for content management

### Adding New Features

1. **HTML Structure**: Add semantic markup
2. **Styling**: Use Tailwind utility classes
3. **JavaScript**: Add functionality in appropriate modules
4. **CMS Integration**: Update Sanity schemas if needed

## 📊 Performance Optimization

### Images
- Use Sanity's image processing for responsive images
- Implement lazy loading for below-fold content
- Optimize images for web delivery

### CSS
- Tailwind CSS is pre-compiled and minified
- Critical CSS is inlined in HTML head
- Unused styles are purged in production

### JavaScript
- ES6 modules for better tree-shaking
- Defer loading for non-critical scripts
- Error boundaries for graceful failures

## 🔒 Security

### Content Security Policy
Consider adding CSP headers for enhanced security:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io">
```

### HTTPS
- GitHub Pages provides free SSL certificates
- Ensure all external resources use HTTPS
- Configure security headers appropriately

## 🆘 Troubleshooting

### Common Issues

1. **CSS not loading:**
   - Ensure `dist/output.css` exists
   - Check file paths in HTML
   - Run `npm run build`

2. **Content not loading:**
   - Verify Sanity project ID and dataset
   - Check CORS settings in Sanity
   - Confirm public read access is enabled

3. **Build failures:**
   - Update Node.js to latest LTS version
   - Clear npm cache: `npm cache clean --force`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Getting Help

1. **Check browser console** for JavaScript errors
2. **Verify Sanity configuration** in `scripts/config.js`
3. **Test API endpoints** in Sanity dashboard
4. **Check GitHub Actions logs** for deployment issues

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**KatGrapher Studio**
- Photography & Web Development
- Contact: me@jordanclark.email

---

**Built with ❤️ using Tailwind CSS, Sanity CMS, and modern web technologies**