import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { env } from "~/env";
import type { UserRole } from "~/lib/shared/types/user";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER" as UserRole,
        input: false,
      },
    },
    changeEmail: {
      enabled: true,
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: (user) =>
          new Promise((resolve) =>
            resolve({
              data: {
                ...user,
                image: "",
                role: (user.email === env.MAIN_ADMIN_EMAIL
                  ? "admin"
                  : "user") as UserRole,
              },
            }),
          ),
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],
  // trustedOrigins: [
  //   "https://gosha.w1png.ru",
  //   "http://localhost:3000"
  // ]
});

export type Session = Awaited<ReturnType<(typeof auth)["api"]["getSession"]>>;
