const dotenv = require("dotenv");

dotenv.config();

function readEnv(name, fallback = "") {
  return process.env[name] || fallback;
}

const nodeEnv = readEnv("NODE_ENV", "development");
const defaultFrontendOrigin =
  nodeEnv === "production" ? "https://jwsocial.vercel.app" : "http://localhost:3000";

const env = {
  nodeEnv,
  appName: readEnv("APP_NAME", "JWSocial"),
  port: Number(readEnv("PORT", readEnv("BACKEND_PORT", 5000))),
  appOrigin: readEnv("APP_ORIGIN", "http://localhost:3000"),
  frontendOrigin: readEnv("FRONTEND_ORIGIN", defaultFrontendOrigin),
  mongoUri: readEnv("MONGODB_URI", "mongodb://localhost:27017/jwsocial"),
  redisUrl: readEnv("REDIS_URL", "redis://localhost:6379"),
  jwtAccessSecret: readEnv("JWT_ACCESS_SECRET", "access-secret"),
  jwtRefreshSecret: readEnv("JWT_REFRESH_SECRET", "refresh-secret"),
  jwtAccessTtl: readEnv("JWT_ACCESS_TTL", "15m"),
  jwtRefreshTtl: readEnv("JWT_REFRESH_TTL", "30d"),
  refreshCookieName: readEnv("COOKIE_REFRESH_NAME", "jwsocial_refresh_token"),
  cloudinary: {
    cloudName: readEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: readEnv("CLOUDINARY_API_KEY"),
    apiSecret: readEnv("CLOUDINARY_API_SECRET"),
    uploadFolder: readEnv("CLOUDINARY_UPLOAD_FOLDER", "jwsocial-community")
  },
  mail: {
    provider: readEnv("MAIL_PROVIDER", "smtp"),
    from: readEnv("EMAIL_FROM", "no-reply@jwsocial.local"),
    smtpHost: readEnv("SMTP_HOST", "localhost"),
    smtpPort: Number(readEnv("SMTP_PORT", 1025)),
    smtpUser: readEnv("SMTP_USER"),
    smtpPass: readEnv("SMTP_PASS"),
    brevoApiKey: readEnv("BREVO_API_KEY")
  },
  moderation: {
    mediaPostingRoles: readEnv("MEDIA_POSTING_ROLES", "user,moderator,admin")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
};

module.exports = env;
