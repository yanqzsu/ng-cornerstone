/**
 * Similar to {@link addVolumesToViewports} it adds volumes to viewports; however,
 * this method will Set the volumes on the viewports which means that the previous
 * volumes will be removed.
 *
 * @param renderingEngine - The rendering engine to use to get viewports from
 * @param volumeInputs - Array of volume inputs including volumeId. Other properties
 * such as visibility, callback, blendMode, slabThickness are optional
 * @param viewportIds - Array of viewport IDs to add the volume to
 * @param immediateRender - If true, the volumes will be rendered immediately
 * @returns A promise that resolves when all volumes have been added
 */
import { IRenderingEngine, IStackViewport } from '@cornerstonejs/core/dist/esm/types';
import { StackViewport } from '@cornerstonejs/core';
import { ctVoiRange } from './setCtTransferFunctionForVolumeActor';

async function setStacksForViewports(
  renderingEngine: IRenderingEngine,
  viewportIds: Array<string>,
  imageIds: Array<string>,
  currentImageIdIndex?: number,
): Promise<void> {
  // Check if all viewports are StackViewport
  viewportIds.forEach((viewportId) => {
    const viewport = renderingEngine.getViewport(viewportId);
    if (!viewport) {
      throw new Error(`Viewport with Id ${viewportId} does not exist`);
    }
    // if not instance of VolumeViewport, throw
    if (!(viewport instanceof StackViewport)) {
      throw new Error('setStacksForViewports only supports StackViewport');
    }
  });

  const setStackPromises = viewportIds.map(async (viewportId) => {
    const viewport = renderingEngine.getViewport(viewportId) as IStackViewport;
    await viewport.setStack(imageIds, currentImageIdIndex);
    // Set the VOI of the stack
    viewport.setProperties({ voiRange: ctVoiRange });
    // Render the image
    viewport.render();
  });

  await Promise.all(setStackPromises);

  return;
}

export { setStacksForViewports };
