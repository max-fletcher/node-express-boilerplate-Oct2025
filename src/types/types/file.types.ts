export type TFieldType =
  | {
      name: string;
      maxCount: number;
    }[]
  | [];

export type TFieldsType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type TFormattedPaths = {
  [key: string]: string[];
};

export type TS3TFieldsType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string | null;
  contentEncoding: string | null;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: { fieldname: string | null };
  location: string;
  etag: string;
  versionId?: string;
};

export type TS3FilePaths = {
  Key: string;
};
