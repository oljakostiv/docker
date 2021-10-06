module.exports = {
    PORT: process.env.PORT || 3000,
    // DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://localhost:27017/nodefls',
    DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://user:password@db:27017/docker',

    ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY || 'Secret_Info',
    ADMIN_KEY: process.env.ADMIN_KEY || 'Secret_by_admin',
    BACKEND_KEY: process.env.BACKEND_KEY || 'Backend',
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY || 'Refresh',

    ACTIVATE_URL: process.env.ACTIVATE_URL || 'http://localhost:5000/auth/activate/',
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://www.skyatnightmagazine.com/advice/stargazing-what-to-see-in-the-night-sky-this-year/',
    FRONTEND_URL_TOKEN: process.env.FRONTEND_URL_PASSWORD || 'https://www.skyatnightmagazine.com/',
    NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL || 'example@gmail.com',
    NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD || '1235',

    OWNER_BORN_YEAR: process.env.OWNER_BORN_YEAR || 1996,
    OWNER_EMAIL: process.env.OWNER_EMAIL || 'oljakostivv@gmail.com',
    OWNER_NAME: process.env.OWNER_NAME || 'Olha',
    OWNER_PASSWORD: process.env.OWNER_PASSWORD || 'Secret_by_owner',

    AWS_S3_NAME: process.env.AWS_S3_NAME || '',
    AWS_S3_REGION: process.env.AWS_S3_REGION || '',
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY || '',
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY || '',

    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
};
