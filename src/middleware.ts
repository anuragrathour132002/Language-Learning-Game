import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

const redirectIfLoggedIn = ['/register']
/*** 
    export default withAuth({
    callbacks: {
        authorized: async ({ req, token }) => {
            const pathname = req.nextUrl.pathname;
            console.log({ pathname, token })
            if (!token) return false;

            if (redirectIfLoggedIn.includes(pathname)) return NextResponse.redirect('/');

            return false;
        },
    },
    secret: "SECRET"
});
***/


export const middleware = async (req: NextRequest) => {
    const token = await getToken({ req })
    if (req.nextUrl.pathname.startsWith('/admin')) {

    }
    if (!token && req.nextUrl.pathname !== '/register') return NextResponse.redirect(`${req.nextUrl.origin}/register`)

    // User logged in
    if (token && redirectIfLoggedIn.includes(req.nextUrl.pathname)) return NextResponse.redirect(req.nextUrl.origin)
}
export const config = {
    matcher: ['/register', '/quiz/:path*', '/admin/:path*'],
};
