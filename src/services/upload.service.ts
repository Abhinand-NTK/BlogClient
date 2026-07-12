import axios from 'axios';
import { apiClient } from '@/api/client';
import type { UploadSignature } from '@/types/blog';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const unsignedPreset = import.meta.env.VITE_UPLOAD_PRESET as string | undefined;

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

type ProgressCb = (percent: number) => void;

/**
 * Uploads an image directly to Cloudinary (never through our server).
 *
 * Strategy:
 *  1. Prefer a *signed* upload — ask our backend for a signature. This works
 *     even without an unsigned preset and keeps the account locked down.
 *  2. Fall back to an *unsigned* preset if the backend signature isn't available
 *     (e.g. backend Cloudinary secret not configured but a public preset is).
 */
export const uploadService = {
  async upload(file: File, onProgress?: ProgressCb): Promise<UploadResult> {
    // Try signed upload first.
    try {
      const { data } = await apiClient.post<{ success: boolean; data: UploadSignature }>(
        '/upload/signature',
        { folder: 'blogcraft' },
      );
      return await this.uploadSigned(file, data.data, onProgress);
    } catch {
      if (!cloudName || !unsignedPreset) {
        throw new Error(
          'Image upload is not configured. Set Cloudinary env vars on the client or server.',
        );
      }
      return this.uploadUnsigned(file, onProgress);
    }
  },

  async uploadSigned(
    file: File,
    sig: UploadSignature,
    onProgress?: ProgressCb,
  ): Promise<UploadResult> {
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.apiKey);
    form.append('timestamp', String(sig.timestamp));
    form.append('signature', sig.signature);
    form.append('folder', sig.folder);

    const { data } = await axios.post(sig.uploadUrl, form, {
      onUploadProgress: (e) =>
        onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
    });
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    };
  },

  async uploadUnsigned(file: File, onProgress?: ProgressCb): Promise<UploadResult> {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', unsignedPreset as string);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      form,
      {
        onUploadProgress: (e) =>
          onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
      },
    );
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    };
  },
};
