# NgCornerstone

This library is an angular project for [CornerStone3D](https://www.cornerstonejs.org/)
It can be used as viewport of DICOM 


## Prepare
For Npm Run
> npm install @cornerstonejs/core  
> npm install @cornerstonejs/tools  
> npm install @cornerstonejs/streaming-image-volume-loader   

Or Yarn
> yarn add @cornerstonejs/core  
> yarn add @cornerstonejs/tools  
> yarn add @cornerstonejs/streaming-image-volume-loader  

## Install
Run `ng add ng-cornerstone`

## Config Angular.json
### Enable cornerstoneWADOImageLoader
To enable dynamic-import cornerstoneWADOImageLoader, you can use `@angular-builders/custom-webpack`.
The angular json should like: 
```json
"architect": {
  "build": {
    "builder": "@angular-builders/custom-webpack:browser",
    "options": {
      "customWebpackConfig": {
        "path": "./extra-webpack.config.js",
        "mergeRules": {
          "externals": "replace"
        }
      },
      "assets": [
        ...
        {
        "glob": "**/*",
        "input": "./node_modules/cornerstone-wado-image-loader/dist/dynamic-import",
        "output": "/"
        }
      ]
    }
  }
}
```
extra-webpack.config.js should like: 
```js
module.exports = {
  resolve: {
    // We use this alias and the CopyPlugin below to support using the dynamic-import version
    // of WADO Image Loader, but only when building a PWA. When we build a package, we must use the
    // bundled version of WADO Image Loader so we can produce a single file for the viewer.
    // (Note: script-tag version of the viewer will no longer be supported in OHIF v3)
    alias: {
      'cornerstone-wado-image-loader':
        'cornerstone-wado-image-loader/dist/dynamic-import/cornerstoneWADOImageLoader.min.js',
    },
  },
}
```

For more detail, refer to [here](https://github.com/cornerstonejs/cornerstoneWADOImageLoader#upgrade-to-cwil-v4x)
### Import Assets
Edit `angular.json`
```json
...
"architect": {
  "build": {
      ...
      "assets": [
        ...
        {
          "glob": "**/*",
          "input": "./dist/ng-cornerstone/src/assets",
          "output": "/assets/"
        }
      ],
    ...
```

### Enable SharedBufferArray when serve
Edit `angular.json` add two headers:
```json
...
"architect":
...
"serve": {
  ...
  "options": {
    "host": "0.0.0.0",
    "headers": {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin"
    },
    "browserTarget": "ncv-example:build"
  },
  ...
},
```
You should also add the two header when deploy your app as a product.


## Usage
```ts
imports: [ViewportModule]`
```
```html
<nc-viewport
  [toolList]="toolList"
  [imageInfo]="imageInfo"
></nc-viewport>
```
ToolList support follow tools:  
Rese, BaseTool, PanTool, TrackballRotateTool, DragProbeTool, WindowLevelTool,
ZoomTool, StackScrollTool, StackScrollMouseWheelTool,
VolumeRotateMouseWheelTool, MIPJumpToClickTool,
LengthTool, CrosshairsTool, ProbeTool,
RectangleROITool, EllipticalROITool, BidirectionalTool,
PlanarFreehandROITool, ArrowAnnotateTool, AngleTool,
MagnifyTool, SegmentationDisplayTool, RectangleScissorsTool,
CircleScissorsTool, SphereScissorsTool, RectangleROIThresholdTool,
RectangleROIStartEndThresholdTool, BrushTool, FlipV, FlipH,
Rotate, Next, Previous, Coronal,Axial, Sagittal


ImageInfo should provide studyInstanceUID, seriesInstanceUID, urlRoot, viewportType, schema
like:
```js
{
  studyInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
  seriesInstanceUID: '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
  urlRoot: 'https://d1qmxk7r72ysft.cloudfront.net/dicomweb',
  viewportType: ViewportType.ORTHOGRAPHIC,
  schema: RequestSchema.WadoRs,
  volumeLoaderScheme: VolumeLoaderSchema.stream,
}
```

## Build

Run `ng build ng-cornerstone` to build the project.
The build artifacts will be stored in the `dist/` directory.

`
