import dotenv from 'dotenv';

dotenv.config();

class Config {
  constructor() {}

  public static getVars() {
    const SERVER_PORT = process.env.SERVER_PORT;
    const KENNEL_API_URL = process.env.BIBBLE_KENNEL_API_URL;
    const USER_API_URL = process.env.BIBBLE_USER_API_URL;
    const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

    return { SERVER_PORT, KENNEL_API_URL, USER_API_URL, SECRET_JWT_CODE };
  }
}

export default Config;
