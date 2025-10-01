const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'Underleaf',
    executableName: 'underleaf',
    appBundleId: 'com.underleaf.editor',
    appCategoryType: 'public.app-category.productivity',
    // icon: './build/icon', // Uncomment when you have proper icon files
    ignore: [
      /^\/src/,
      /^\/electron/,
      /^\/public/,
      /^\/\.vscode/,
      /^\/node_modules\/(?!.*\.(node|dll|dylib|so)$)/,
      /\.ts$/,
      /\.tsx$/,
      /\.md$/,
      /^\/tsconfig/,
      /^\/vite\.config/,
      /^\/tailwind\.config/,
      /^\/postcss\.config/,
      /^\/build-electron\.js$/,
      /^\/electron-dev\.js$/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'underleaf',
        setupExe: 'UnderleafSetup.exe',
        // setupIcon: './build/icon.ico', // Uncomment when you have an ICO file
        // loadingGif: './build/install-spinner.gif', // Optional: add a loading animation
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'Underleaf',
        // icon: './build/icon.icns', // Uncomment when you have an ICNS file
        // background: './build/dmg-background.png', // Optional: custom background
        format: 'ULFO',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Your Name',
          homepage: 'https://github.com/yourusername/underleaf',
          description: 'A beautiful local LaTeX editor with live preview',
          categories: ['Office', 'TextEditor'],
          // icon: './build/icon.png', // Uncomment when you have a PNG icon
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'Your Name',
          homepage: 'https://github.com/yourusername/underleaf',
          description: 'A beautiful local LaTeX editor with live preview',
          categories: ['Office', 'TextEditor'],
          // icon: './build/icon.png', // Uncomment when you have a PNG icon
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
