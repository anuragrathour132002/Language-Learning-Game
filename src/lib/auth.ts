import { randomBytes, scryptSync } from 'crypto';
import prisma from "@/lib/prisma"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Pass the password string and get hashed password back
// ( and store only the hashed string in your database)
const encryptPassword = (password: string, salt: string) => {
    return scryptSync(password, salt, 32).toString('hex');
};

export const hashPassword = (password: string): string => {
    // Any random string here (ideally should be at least 16 bytes)
    const salt = randomBytes(16).toString('hex');
    return encryptPassword(password, salt) + salt;
};

// fetch the user from your db and then use this function

/**
 * Match password against the stored hash
 */
export const matchPassword = (password: string, hash: string): Boolean => {
    // extract salt from the hashed string
    // our hex password length is 32*2 = 64
    const salt = hash.slice(64);
    const originalPassHash = hash.slice(0, 64);
    const currentPassHash = encryptPassword(password, salt);
    return originalPassHash === currentPassHash;
};

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                if (!credentials || !credentials.email || !credentials.password) return null;

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) return null


                // If no error and we have user data, return it
                if (matchPassword(credentials.password, user.hash)) {
                    const responseUser: Partial<typeof user> = user;
                    delete responseUser.hash;
                    return responseUser
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    secret: "SECRET",
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token, user }) {
            const sanitizedToken = Object.keys(token).reduce((p, c) => {
                // strip unnecessary properties
                if (
                    c !== "iat" &&
                    c !== "exp" &&
                    c !== "hash" &&
                    c !== "jti" &&
                    c !== "apiToken"
                ) {
                    return { ...p, [c]: token[c] }
                } else {
                    return p
                }
            }, {})
            return { ...session, user: sanitizedToken, apiToken: token.apiToken }
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                // user has just signed in so the user object is populated
                return user;
            }
            return token
        }
    }
}

