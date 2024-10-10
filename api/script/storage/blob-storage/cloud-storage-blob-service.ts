import { Storage } from '@google-cloud/storage';
import { BlobService } from './blob-service';

export const getCloudStorageBlobService = (config): BlobService => {
  const storage = new Storage(config);

  return {
    getContainerClient: (containerName) => {
      const bucket = storage.bucket(containerName);

      return {
        deleteBlob: async (blobName) => {
          await bucket.file(blobName).delete();
        },
        uploadBlockBlob: async (blobName, body, contentLength) => {
          const file = bucket.file(blobName);
          await file.save(Buffer.from(body), {
            metadata: {
              contentLength: contentLength,
            },
          });
          console.log(`Blob ${blobName} uploaded.`);
        },
        getBlobClient: (blobName) => {
          const file = bucket.file(blobName);
          return {
            url: `https://storage.googleapis.com/${containerName}/${blobName}`,
            downloadToBuffer: async () => {
              const [data] = await file.download();
              return Buffer.from(data);
            },
          };
        },
      };
    },
  };
};
