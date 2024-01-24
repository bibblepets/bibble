import dotenv from 'dotenv';

dotenv.config();

class Config {
  constructor() {}

  public static getVars() {
    const SERVER_PORT = process.env.SERVER_PORT;
    const MONGO_URI = process.env.MONGO_URI;

    return { SERVER_PORT, MONGO_URI };
  }

  public static getAwsVars() {
    const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
    const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    const USER_BUCKET_NAME = process.env.USER_BUCKET_NAME;
    const BUSINESS_BUCKET_NAME = process.env.BUSINESS_BUCKET_NAME;

    return {
      AWS_BUCKET_REGION,
      AWS_ACCESS_KEY,
      AWS_SECRET_ACCESS_KEY,
      USER_BUCKET_NAME,
      BUSINESS_BUCKET_NAME
    };
  }
}

export default Config;
