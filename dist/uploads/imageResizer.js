"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_type_1 = require("file-type");
const fs_1 = __importDefault(require("fs"));
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const sharp_1 = __importDefault(require("sharp"));
const fileExists_1 = __importDefault(require("./fileExists"));
/**
 * Sanitize the image name and extract the extension from the source image
 *
 * @param sourceImage - the source image
 * @returns the sanitized name and extension
 */
const getSanitizedImageData = (sourceImage) => {
    const extension = sourceImage.split('.').pop();
    const name = (0, sanitize_filename_1.default)(sourceImage.substring(0, sourceImage.lastIndexOf('.')) || sourceImage);
    return { name, ext: extension };
};
/**
 * Create a new image name based on the output image name, the dimensions and
 * the extension.
 *
 * Ignore the fact that duplicate names could happen if the there is one
 * size with `width AND height` and one with only `height OR width`. Because
 * space is expensive, we will reuse the same image for both sizes.
 *
 * @param outputImageName - the sanitized image name
 * @param bufferInfo - the buffer info
 * @param extension - the extension to use
 * @returns the new image name that is not taken
 */
const createImageName = (outputImageName, { width, height }, extension) => `${outputImageName}-${width}x${height}.${extension}`;
/**
 * Create the result object for the image resize operation based on the
 * provided parameters. If the name is not provided, an empty result object
 * is returned.
 *
 * @param name - the name of the image
 * @param filename - the filename of the image
 * @param width - the width of the image
 * @param height - the height of the image
 * @param filesize - the filesize of the image
 * @param mimeType - the mime type of the image
 * @param sizesToSave - the sizes to save
 * @returns the result object
 */
const createResult = (name, filename = null, width = null, height = null, filesize = null, mimeType = null, sizesToSave = []) => ({
    sizesToSave,
    sizeData: {
        [name]: {
            width,
            height,
            filename,
            filesize,
            mimeType,
        },
    },
});
/**
 * Check if the image needs to be resized according to the requested dimensions
 * and the original image size. If the resize options withoutEnlargement or withoutReduction are provided,
 * the image will be resized regardless of the requested dimensions, given that the
 * width or height to be resized is provided.
 *
 * @param resizeConfig - object containing the requested dimensions and resize options
 * @param original - the original image size
 * @returns true if the image needs to be resized, false otherwise
 */
const needsResize = ({ width: desiredWidth, height: desiredHeigth, withoutEnlargement, withoutReduction }, original) => {
    // allow enlargement or prevent reduction (our default is to prevent
    // enlargement and allow reduction)
    if (withoutEnlargement !== undefined || withoutReduction !== undefined) {
        return true; // needs resize
    }
    const isWidthOrHeightNotDefined = !desiredHeigth || !desiredWidth;
    if (isWidthOrHeightNotDefined) {
        // If with and height are not defined, it means there is a format conversion
        // and the image needs to be "resized" (transformed).
        return true; // needs resize
    }
    const hasInsufficientWidth = original.width < desiredWidth;
    const hasInsufficientHeight = original.height < desiredHeigth;
    if (hasInsufficientWidth && hasInsufficientHeight) {
        // doesn't need resize - prevent enlargement. This should only happen if both width and height are insufficient.
        // if only one dimension is insufficient and the other is sufficient, resizing needs to happen, as the image
        // should be resized to the sufficient dimension.
        return false;
    }
    return true; // needs resize
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
async function resizeAndTransformImageSizes({ req, file, dimensions, staticPath, config, savedFilename, mimeType, }) {
    const { imageSizes } = config.upload;
    // Noting to resize here so return as early as possible
    if (!imageSizes)
        return { sizeData: {}, sizesToSave: [] };
    const sharpBase = (0, sharp_1.default)(file.tempFilePath || file.data).rotate(); // pass rotate() to auto-rotate based on EXIF data. https://github.com/payloadcms/payload/pull/3081
    const results = await Promise.all(imageSizes.map(async (imageResizeConfig) => {
        // This checks if a resize should happen. If not, the resized image will be
        // skipped COMPLETELY and thus will not be included in the resulting images.
        // All further format/trim options will thus be skipped as well.
        if (!needsResize(imageResizeConfig, dimensions)) {
            return createResult(imageResizeConfig.name);
        }
        let resized = sharpBase.clone().resize(imageResizeConfig);
        if (imageResizeConfig.formatOptions) {
            resized = resized.toFormat(imageResizeConfig.formatOptions.format, imageResizeConfig.formatOptions.options);
        }
        if (imageResizeConfig.trimOptions) {
            resized = resized.trim(imageResizeConfig.trimOptions);
        }
        const { data: bufferData, info: bufferInfo } = await resized.toBuffer({
            resolveWithObject: true,
        });
        const sanitizedImage = getSanitizedImageData(savedFilename);
        if (req.payloadUploadSizes) {
            req.payloadUploadSizes[imageResizeConfig.name] = bufferData;
        }
        const mimeInfo = await (0, file_type_1.fromBuffer)(bufferData);
        const imageNameWithDimensions = createImageName(sanitizedImage.name, bufferInfo, (mimeInfo === null || mimeInfo === void 0 ? void 0 : mimeInfo.ext) || sanitizedImage.ext);
        const imagePath = `${staticPath}/${imageNameWithDimensions}`;
        if (await (0, fileExists_1.default)(imagePath)) {
            fs_1.default.unlinkSync(imagePath);
        }
        const { width, height, size } = bufferInfo;
        return createResult(imageResizeConfig.name, imageNameWithDimensions, width, height, size, (mimeInfo === null || mimeInfo === void 0 ? void 0 : mimeInfo.mime) || mimeType, [{ path: imagePath, buffer: bufferData }]);
    }));
    return results.reduce((acc, result) => {
        Object.assign(acc.sizeData, result.sizeData);
        acc.sizesToSave.push(...result.sizesToSave);
        return acc;
    }, { sizeData: {}, sizesToSave: [] });
}
exports.default = resizeAndTransformImageSizes;
//# sourceMappingURL=imageResizer.js.map