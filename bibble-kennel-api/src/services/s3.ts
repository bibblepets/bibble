import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Schema } from 'mongoose';
import { IMedia } from '../interfaces/media.interface';

dotenv.config();

const awsBucketRegion = process.env.AWS_BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
export const listingBucketName = process.env.LISTING_BUCKET_NAME;

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
  id: Schema.Types.ObjectId | string,
  files: Express.Multer.File | Express.Multer.File[],
  media?: IMedia | IMedia[],
  bucketName?: string
) => {
  if (!(files instanceof Array)) {
    files = [files];
  }

  if (media && !(media instanceof Array)) {
    media = [media];
  }

  let clientMediaNames: Array<string | undefined> | undefined;
  let s3MediaNames: Array<string | undefined> | undefined;
  const listingMedia: IMedia[] = [];

  if (Array.isArray(media) && media.length > 0) {
    clientMediaNames = media.map((media) => media.name);

    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: id.toString() + '/',
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
          Bucket: bucketName,
          Key: deleteMediaName
        });

        await s3Client.send(deleteCommand);
      }
    }

    clientMediaNames.forEach((clientMediaName) => {
      clientMediaName &&
        clientMediaName !== 'undefined' &&
        listingMedia.push({ name: clientMediaName, url: undefined });
    });
  }

  for (const file of files) {
    const name = `${id.toString()}/${generateName()}`;

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: name,
      Body: file.buffer
    });

    await s3Client.send(putCommand);

    listingMedia.push({ name: name, url: undefined });
  }

  return listingMedia;
};

export const getMediaUrl = async (mediaName: string, bucketName?: string) => {
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: mediaName
  });

  const url = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 60 * 60 * 24 // 1 day
  });

  return url;
};

const generateName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
