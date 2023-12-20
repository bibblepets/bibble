import { Schema } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsBucketRegion = process.env.AWS_BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!awsAccessKey || !awsSecretAccessKey || !awsBucketRegion) {
  throw new Error('AWS credentials or region are not defined');
}

const s3Client = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretAccessKey
  },
  region: awsBucketRegion
});

export const putMedia = async (
  listingId: Schema.Types.ObjectId,
  files: Express.Multer.File[],
  media?:
    | {
        name?: string;
        url?: string;
      }[]
) => {
  let clientMediaNames: Array<string | undefined> | undefined;
  let s3MediaNames: Array<string | undefined> | undefined;
  const uploadedMedia = [];

  if (Array.isArray(media) && media.length > 0) {
    clientMediaNames = media.map((media) => media.name);

    const listCommand = new ListObjectsV2Command({
      Bucket: awsBucketName,
      Prefix: listingId.toString() + '/',
      MaxKeys: 20
    });

    s3MediaNames = await s3Client
      .send(listCommand)
      .then((response) => response.Contents?.map((s3Object) => s3Object.Key));

    const deleteMediaNames = s3MediaNames?.filter(
      (s3MediaName) => !clientMediaNames?.includes(s3MediaName)
    );

    if (Array.isArray(deleteMediaNames) && deleteMediaNames.length > 0) {
      for (const deleteMediaName of deleteMediaNames) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: awsBucketName,
          Key: deleteMediaName
        });

        await s3Client.send(deleteCommand);
      }
    }

    clientMediaNames.forEach((clientMediaName) => {
      uploadedMedia.push({ name: clientMediaName, url: undefined });
    });
  }

  for (const file of files) {
    const name = `${listingId.toString()}/${generateName()}`;

    const putCommand = new PutObjectCommand({
      Bucket: awsBucketName,
      Key: name,
      Body: file.buffer
    });

    await s3Client.send(putCommand);

    uploadedMedia.push({ name: name, url: undefined });
  }

  return uploadedMedia;
};

export const getMediaUrl = async (media: { name: string }) => {
  const getCommand = new GetObjectCommand({
    Bucket: awsBucketName,
    Key: media.name
  });

  const url = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 60 * 60 * 24 // 1 day
  });

  return { name: media.name, url: url };
};

const generateName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
