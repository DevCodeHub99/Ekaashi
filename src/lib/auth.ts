import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Temporary admin user for demo purposes
const ADMIN_USER = {
  id: "admin-1",
  email: "admin@ekaashi.com",
  name: "Admin User",
  role: "ADMIN",
  password: "admin123" // Plain text for comparison
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check against admin user first
          if (credentials.email === ADMIN_USER.email) {
            if (credentials.password === ADMIN_USER.password) {
              return {
                id: ADMIN_USER.id,
                email: ADMIN_USER.email,
                name: ADMIN_USER.name,
                role: ADMIN_USER.role,
              }
            }
          }

          // Check against Supabase database users
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (user && user.password) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (isPasswordValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              }
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}