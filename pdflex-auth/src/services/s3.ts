import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const region = process.env.S3_REGION || "us-east-1";
const bucket = process.env.S3_BUCKET;
const endpoint = process.env.S3_ENDPOINT || undefined;
const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";
const accessKeyId = process.env.S3_ACCESS_KEY || "";
const secretAccessKey = process.env.S3_SECRET_KEY || "";

if (!bucket) {
  throw new Error("Missing S3_BUCKET in environment.");
}

export const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle,
  credentials: { accessKeyId, secretAccessKey },
});

export async function getPresignedUploadUrl(opts: {
  key: string;
  contentType: string;
  expiresIn?: number; // seconds
}) {
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: opts.key,
    ContentType: opts.contentType,
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: opts.expiresIn ?? 900 });
  return {
    url,
    method: "PUT",
    key: opts.key,
    headers: { "Content-Type": opts.contentType },
  };
}

export async function getPresignedDownloadUrl(opts: {
  key: string;
  expiresIn?: number; // seconds
}) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: opts.key });
  return getSignedUrl(s3, cmd, { expiresIn: opts.expiresIn ?? 900 });
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/* ---------- nové: priama práca s bufferom ---------- */

function readableToBuffer(readable: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readable.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export async function getObjectBuffer(key: string): Promise<Buffer> {
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!res.Body) throw new Error("S3 getObject returned empty Body");
  if (res.Body instanceof Readable) {
    return readableToBuffer(res.Body);
  }
  // @ts-ignore - v edge runtimes môže byť Body typu ReadableStream | Blob
  if (typeof res.Body?.transformToByteArray === "function") {
    // @ts-ignore
    const arr = await res.Body.transformToByteArray();
    return Buffer.from(arr);
  }
  throw new Error("Unsupported S3 Body stream type");
}

export async function putObjectBuffer(opts: {
  key: string;
  contentType: string;
  body: Buffer | Uint8Array;
}) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
    })
  );
  return { key: opts.key };
}