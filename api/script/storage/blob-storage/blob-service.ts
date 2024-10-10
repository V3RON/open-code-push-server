export interface BlobService {
  getContainerClient: (containerName: string) => BlobContainerClient
}

export interface BlobContainerClient {
  uploadBlockBlob: (blobName: string, body: ArrayBuffer, contentLength: number) => Promise<void>;
  deleteBlob: (blobName: string) => Promise<void>;
  getBlobClient: (blobName: string) => BlobClient;
}

export interface BlobClient {
  url: string;
  downloadToBuffer: () => Promise<Buffer>;
}
