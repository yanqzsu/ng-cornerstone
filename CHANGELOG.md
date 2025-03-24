# [3.4.2](https://github.com/yanqzsu/ng-corner/compare/3.4.0...3.4.2) (2025-03-24)

### Features

- **chore(version)**: update to 3.4.2 and clean up configuration files
  - Updated package versions in package.json and package-lock.json.
  - Removed unused assets from angular.json.
  - Simplified extra-webpack.config.js by removing unnecessary code.
  - Adjusted layout configurations in various components for better viewport handling.
  - Refactored image loading logic in viewer component to improve performance and maintainability.
  - Updated viewport component initialization to ensure proper rendering of images and segments.

# [3.4.0](https://github.com/yanqzsu/ng-corner/compare/1.85.0...3.4.0) (2025-03-23)

### Bug Fixes

- **worker:** worker not found ([19480e5](https://github.com/yanqzsu/ng-corner/commit/19480e5474cce0da40f96e07034a3b09852471d1))

### Features

- **core:** update to cs 3.0 ([26e38f4](https://github.com/yanqzsu/ng-corner/commit/26e38f4cd71951f171b539371f9989ccd38d0c99))
- **core:** update to cs2.0 ([a7d1e00](https://github.com/yanqzsu/ng-corner/commit/a7d1e007f237f60b2862ee4f7b3fc100813aa604))
- **eslint:** update eslint to 17 ([1473789](https://github.com/yanqzsu/ng-corner/commit/147378910752bf595e769cd3d1a01cbf60fc6e8c))
- **layout:** new layout ([7b8a6eb](https://github.com/yanqzsu/ng-corner/commit/7b8a6ebc99e229c0e78de70576e1ff3b61076019))
- **ng:** update to 17 ([1cd566d](https://github.com/yanqzsu/ng-corner/commit/1cd566d6b9cd22a8bfc03a95c5cbf80e9bce33ca))
- **viewport:** refactor viewport to support multiple viewport types ([b0b019b](https://github.com/yanqzsu/ng-corner/commit/b0b019b8bb794161c0fd4ca30a0e929e663c03f9))

### BREAKING CHANGES

- **core:** cs3.0

## [1.85.0](https://github.com/yanqzsu/ng-corner/compare/1.84.1...1.85.0) (2025-01-07)

### Bug Fixes

- **toolbar:** toolbar lifestyles handles incorrectly ([7d7005c](https://github.com/yanqzsu/ng-corner/commit/7d7005c346d133805ebaabd0361ff479da58a3c0)), closes [#17](https://github.com/yanqzsu/ng-corner/issues/17))
- **viewport:** resize event is not working properly ([7d7005c](https://github.com/yanqzsu/ng-corner/commit/7d7005c346d133805ebaabd0361ff479da58a3c0)), closes [#3](https://github.com/yanqzsu/ng-corner/issues/3)

### Features

- **layout:** nc-viewer support a new input: layout ([c05e7c3](https://github.com/yanqzsu/ng-corner/commit/c05e7c3de3a51d41e2e81a72a74c41576e664381)), closes [#16](https://github.com/yanqzsu/ng-corner/issues/16)

## [1.84.1](https://github.com/yanqzsu/ng-corner/compare/1.84.0...1.84.1) (2024-09-27)

### BREAKING CHANGES

- **version-up:** volumeLoaderScheme not used any more

## [1.84.0](https://github.com/yanqzsu/ng-corner/compare/1.77.0...1.84.0) (2024-09-27)

### Features

- **segment:** init support segment ([b138921](https://github.com/yanqzsu/ng-corner/commit/b138921269ee7862e6744703fa0a2696b9b62985))
- **version:** update cs to 1.84.4 ([eeff675](https://github.com/yanqzsu/ng-corner/commit/eeff675c9beb21a3b3c5ba818e205c8114006167))
- **viewport:** add viewer component and optimzie initialize logical ([70e9b3f](https://github.com/yanqzsu/ng-corner/commit/70e9b3f40a6aff58309c5d402f17eb1539ab218c))

## [1.77.0](https://github.com/yanqzsu/ng-corner/compare/0.0.7...1.77.0) (2024-05-29)

### Features

- **nifti:** support nifti loader ([8c4316c](https://github.com/yanqzsu/ng-corner/commit/8c4316c3eba9383810ca9a41936bde7617249a0d))

## [1.45.1](https://github.com/yanqzsu/ng-corner/compare/0.0.7...1.45.1) (2024-04-09)

### Features

- **angular:** update to angular 16 ([0763b55](https://github.com/yanqzsu/ng-corner/commit/0763b5526652d8481756d6b40a2dcef896affded))
- **volume3d:** support volume3d, update cornerstone to 1.45.1 ([d1d54c6](https://github.com/yanqzsu/ng-corner/commit/d1d54c619636f56674bc3e082db366bcedf04a05))

## [0.0.7](https://github.com/yanqzsu/ng-corner/compare/0.0.6...0.0.7) (2023-07-03)

### Features

- **life-cycle:** add destroy method, optimize init hook ([bde15e4](https://github.com/yanqzsu/ng-corner/commit/bde15e449d44175892b3fa80ea7eff030eee1376))

## [0.0.6](https://github.com/yanqzsu/ng-corner/compare/0.0.5...0.0.6) (2023-06-08)

### Bug Fixes

- **gulp:** add gulp task to copy readme.md ([201da44](https://github.com/yanqzsu/ng-corner/commit/201da448460d400fd59b90f85ba388cbb033fbb5)), closes [#6](https://github.com/yanqzsu/ng-corner/issues/6)

## [0.0.5](https://github.com/yanqzsu/ng-corner/compare/c9abb6e463917de7cb440b582db445ffabf48afc...0.0.5) (2023-06-08)

### Bug Fixes

- **core:** remove useless code ([c9abb6e](https://github.com/yanqzsu/ng-corner/commit/c9abb6e463917de7cb440b582db445ffabf48afc))

### Features

- **devtools:** add some dev tools, version up ([69e1529](https://github.com/yanqzsu/ng-corner/commit/69e15299b0e6d076cfde8d00b51cc75b807d8b65)), closes [#4](https://github.com/yanqzsu/ng-corner/issues/4)

## 0.0.3 (2023-06-2)

INIT release
