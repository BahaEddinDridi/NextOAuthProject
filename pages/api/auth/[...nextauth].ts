import NextAuth, { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
// Extend the Session type to include accessToken
interface CustomSession extends Session {
    accessToken?: string; // Optional: Mark as optional
}

// Extend the JWT type to include accessToken
interface CustomToken extends JWT {
    accessToken?: string; // Optional: Mark as optional
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
                // Ensure token is of type CustomToken
                const customToken = token as CustomToken;
                customToken.accessToken = account.access_token; // Set accessToken from account
            }
            return token;
        },
        async session({ session, token }) {
            const customSession = session as CustomSession;
            // Ensure token is of type CustomToken
            const customToken = token as CustomToken;
            customSession.accessToken = customToken.accessToken; // Assign accessToken to the session
            return customSession;
        },
    },
};

export default NextAuth(authOptions);
