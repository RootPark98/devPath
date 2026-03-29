import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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