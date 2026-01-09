// const message = require('../utils/handlers/response.constants')
import { message, statusCode } from '../utils/handlers/response.constants.js';
import { useSuccessResponse, useErrorResponse, useInterServerErrorResponse } from '../utils/handlers/response.handlers.js';
import Junk from "../models/junk.model.js";
import User from '../models/user.model.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const uploadProfilePic = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return useErrorResponse(res, message.noFileProvided, statusCode.badRequest);
    }

    const results = [];

    for (const file of files) {
      let publicFilePath = file.filename;
      const fileExt = path.extname(file.originalname).toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.svg'];
      const isImage = imageExtensions.includes(fileExt);

      try {
        if (isImage) {
          // Generate new filename with .webp extension
          const newFilename = file.filename.replace(/\.[^/.]+$/, '') + '.webp';
          const newPath = path.join(path.dirname(file.path), newFilename);
          const tempPath = path.join(path.dirname(file.path), 'temp_' + newFilename);

          try {
            // Convert image to WebP using a temporary file
            await sharp(file.path)
              .webp({ quality: 80 })
              .toFile(tempPath);

            // Remove original file
            fs.unlinkSync(file.path);

            // Rename the temp file to the final filename
            fs.renameSync(tempPath, newPath);

            // Update the public file path to use the new WebP file
            publicFilePath = newFilename;
          } catch (error) {
            // Clean up temp file if it exists
            if (fs.existsSync(tempPath)) {
              fs.unlinkSync(tempPath);
            }
            throw error;
          }
        }

        const existing = await Junk.findOne({ path: publicFilePath });
        if (existing) {
          existing.inUse = true;
          await existing.save();
        } else {
          await Junk.create({
            name: file.originalname,            // ✅ REQUIRED
            type: isImage ? "image" : "file",
            path: publicFilePath,
            inUse: false,
            uploadedBy: req.user?._id,
          });
        }
      } catch (error) {
        // If conversion fails, delete the uploaded file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        throw error;
      }

      results.push({ path: publicFilePath });
    }

    return useSuccessResponse(res, message.createSuccess, { files: results }, statusCode.created);
  } catch (error) {
    return useInterServerErrorResponse(res, error.message);
  }
};
