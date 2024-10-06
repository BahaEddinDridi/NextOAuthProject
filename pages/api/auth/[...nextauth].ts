import NextAuth, { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface CustomSession extends Session {
    accessToken?: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            const customSession = session as CustomSession;
            customSession.accessToken = token.accessToken;
            return customSession;
        },
    },
};

export default NextAuth(authOptions);
