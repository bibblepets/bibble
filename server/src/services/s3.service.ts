import * as multer from 'multer';
import { Schema } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
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

export const putMedia = async (files: Express.Multer.File[]) => {
  const media = [];

  for (const file of files) {
    const name = generateName();

    const putCommand = new PutObjectCommand({
      Bucket: awsBucketName,
      Key: name,
      Body: file.buffer
    });

    await s3Client.send(putCommand);

    media.push({ name: name, url: undefined });
  }

  return media;
};

export const getMediaUrl = async (media: { name: string}) => {
  const getCommand = new GetObjectCommand({
    Bucket: awsBucketName,
    Key: media.name
  });

  const url = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 60 * 60 * 24 // 1 day
  });

  return { name: media.name, url: url };
};

export const deleteMedia = async (media: { name: string }) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: awsBucketName,
    Key: media.name
  });

  await s3Client.send(deleteCommand);
};

const generateName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
