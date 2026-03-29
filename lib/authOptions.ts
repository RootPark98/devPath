import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId) {
  throw new Error("Missing GOOGLE_CLIENT_ID");
}

if (!googleClientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET");
}

if (!nextAuthSecret) {
  throw new Error("Missing NEXTAUTH_SECRET");
}


export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: googleClientId, //process.env.GOOGLE_CLIENT_ID!,
      clientSecret: googleClientSecret,// process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database", // 🔥 JWT → database로 변경
  },

  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id; // 🔥 핵심
      }
      return session;
    },
  },

  // ✅ 커스텀 로그인 페이지
  pages: {
    signIn: "/login",
  },
};