import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Lazy import to avoid edge runtime issues
        const { prisma } = await import("@/lib/prisma");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { workSchedule: true },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // Check work schedule restriction for staff/admin
        if (
          (user.role === "STAFF" || user.role === "ADMIN") &&
          user.workSchedule?.isRestricted
        ) {
          const now = new Date();
          const currentHour = now.getHours();
          const currentDay = now.getDay();
          const workDays = user.workSchedule.workDays
            .split(",")
            .map((d: string) => parseInt(d));

          if (
            !workDays.includes(currentDay) ||
            currentHour < user.workSchedule.startHour ||
            currentHour >= user.workSchedule.endHour
          ) {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          userType: user.userType,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.userType = (user as { userType?: string }).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { userType?: string }).userType =
          token.userType as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
