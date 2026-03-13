import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).lean();

        if (!user || !user.password) {
          throw new Error('No account found with this email.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Incorrect password. Please try again.');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
      console.log('--- DBG: signIn callback start ---');
      console.log('Provider:', account?.provider);
      console.log('User Email:', user.email);

      if (account?.provider === 'google') {
        try {
          await dbConnect();
          console.log('DB Connected');
          
          const userEmail = user.email?.toLowerCase();
          if (!userEmail) {
            console.error('No email provided by Google');
            return false;
          }

          const existingUser = await User.findOne({ email: userEmail });
          console.log('Existing User Found:', !!existingUser);
          
          if (!existingUser) {
            console.log('Creating new Google user...');
            const newUser = await User.create({
              name: user.name || 'User',
              email: userEmail,
              role: 'user',
            });
            console.log('New User Created:', newUser._id);
            user.id = newUser._id.toString();
            (user as any).role = newUser.role;
          } else {
            console.log('Syncing existing Google user...');
            user.id = existingUser._id.toString();
            (user as any).role = existingUser.role;
          }
          
          console.log('Assigned user.id:', user.id);
          console.log('--- DBG: signIn callback success ---');
          return true;
        } catch (error) {
          console.error('CRITICAL: Error during Google Sign-In DB check:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT Callback - User Object present:', user.id);
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        console.log('Session Callback - Token present:', token.id);
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
