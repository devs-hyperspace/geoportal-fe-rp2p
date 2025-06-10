import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {db} from "./db";
import { compare } from "bcrypt";


export const AuthOptions:NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy : 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if(!credentials?.username || !credentials.password){
                throw new Error("Invalid credentials");
            }

            const existingUserByUsername = await db.user.findUnique(
                {
                    where: {
                        username: credentials.username
                    },
                    include:{
                        role:true,
                        group: true,
                        kabkot: true
                    }
                }
            )

            if(!existingUserByUsername){
                return null;
            }

            const passwordMatch = await compare(credentials.password, existingUserByUsername.password)
            
            if(!passwordMatch){
                return null;
            }

            return {
                id: `${existingUserByUsername.id}`,
                name: existingUserByUsername.name,
                username: existingUserByUsername.username,
                roleId: existingUserByUsername.roleId,
                geonodeUid: existingUserByUsername.geonodeUid,
                geonodeAccessToken: existingUserByUsername.geonodeAccessToken,
                kabkot: existingUserByUsername.kabkot ?? undefined,
                group: existingUserByUsername.group ?? undefined
            } as any;

          }
        })
    ],
    callbacks:{
        
        
        async jwt( {token, user}){
            if(user){
                return {
                    ...token,
                    username: user.username,
                    name: user.name,
                    geonodeUid: user.geonodeUid,
                    geonodeAccessToken: user.geonodeAccessToken,
                    roleId: user.roleId,
                    kabkot: user.kabkot,
                    group: user.group,
                }
            }
            return token
        },
        async session({session, token}){
            return {
                ...session,
                user:{
                    ...session.user,
                    username: token.username,
                    name: token.name,
                    geonodeUid: token.geonodeUid,
                    geonodeAccessToken: token.geonodeAccessToken,
                    roleId: token.roleId,
                    kabkot:token.kabkot,
                    group: token.group,
                }
            }
            
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    }
}

