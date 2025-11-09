import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log("DB HOST:",process.env.DB_HOST);


export const auth = betterAuth({
    database: createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DB_NAME,
        port: 3306,
    }),
    emailAndPassword: { 
        enabled: true, 
    },
    session: {
    // default settings or your custom
    expiresIn: 60 * 60 * 24 * 7,   // 7 days etc
    cookie: {
      name: 'auth_session',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }
  },
  // trusted origins; set your React frontend origin
  trustedOrigins: ['http://localhost:5173'],
})