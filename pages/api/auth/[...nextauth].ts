import NextAuth, { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

interface CustomSession extends Session {
    accessToken?: string;
}

interface CustomToken extends JWT {
    accessToken?: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                const customToken = token as CustomToken;
                customToken.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            const customSession = session as CustomSession;
            const customToken = token as CustomToken;
            customSession.accessToken = customToken.accessToken;
            return customSession;
        },
    },
};

export default NextAuth(authOptions);
