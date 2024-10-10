import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { BlobService } from './blob-service';

export const getS3BlobService = (config: S3ClientConfig): BlobService => {
  const client = new S3Client(config);

  return {
    getContainerClient: (containerName) => {
      return {
        deleteBlob: async (blobName) => {
          await client.send(new DeleteObjectCommand({
            Bucket: containerName,
            Key: blobName,
          }));
        },
        uploadBlockBlob: async (blobName, body, contentLength) => {
          await client.send(new PutObjectCommand({
            Bucket: containerName,
            Key: blobName,
            Body: Buffer.from(body),
            ContentLength: contentLength,
          }));
        },
        getBlobClient: (blobName) => {
          return {
            url: `https://${containerName}.s3.amazonaws.com/${blobName}`,
            downloadToBuffer: async () => {
              const response = await client.send(new GetObjectCommand({
                Bucket: containerName,
                Key: blobName,
              }));

              const byteArray = await response.Body.transformToByteArray();
              return Buffer.from(byteArray);
            },
          }
        }
      }
    }
  }
}
