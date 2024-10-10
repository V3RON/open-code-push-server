import { put, del, getDownloadUrl } from '@vercel/blob';
import { BlobService } from './blob-service';

export const getCloudStorageBlobService = (): BlobService => {
  return {
    getContainerClient: (containerName) => {
      return {
        deleteBlob: async (blobName) => {
          await del(`${containerName}/${blobName}`);
        },
        uploadBlockBlob: async (blobName, body) => {
          await put(`${containerName}/${blobName}`, body, {
            access: 'public',
          });
        },
        getBlobClient: (blobName) => {
          const url = getDownloadUrl(`${containerName}/${blobName}`);

          return {
            url,
            downloadToBuffer: async () => {
              const response = await fetch(url);
              const buffer = await response.arrayBuffer();
              return Buffer.from(buffer);
            },
          };
        },
      };
    },
  };
};
