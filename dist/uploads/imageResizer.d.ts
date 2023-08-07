import { UploadedFile } from 'express-fileupload';
import { SanitizedCollectionConfig } from '../collections/config/types';
import { PayloadRequest } from '../express/types';
import { FileSizes, FileToSave, ProbedImageSize } from './types';
type ResizeArgs = {
    req: PayloadRequest;
    file: UploadedFile;
    dimensions: ProbedImageSize;
    staticPath: string;
    config: SanitizedCollectionConfig;
    savedFilename: string;
    mimeType: string;
};
/** Result from resizing and transforming the requested image sizes */
type ImageSizesResult = {
    sizeData: FileSizes;
    sizesToSave: FileToSave[];
};
/**
 * For the provided image sizes, handle the resizing and the transforms
 * (format, trim, etc.) of each requested image size and return the result object.
 * This only handles the image sizes. The transforms of the original image
 * are handled in {@link ./generateFileData.ts}.
 *
 * The image will be resized according to the provided
 * resize config. If no image sizes are requested, the resolved data will be empty.
 * For every image that dos not need to be resized, an result object with `null`
 * parameters will be returned.
 *
 * @param resizeConfig - the resize config
 * @returns the result of the resize operation(s)
 */
export default function resizeAndTransformImageSizes({ req, file, dimensions, staticPath, config, savedFilename, mimeType, }: ResizeArgs): Promise<ImageSizesResult>;
export {};
