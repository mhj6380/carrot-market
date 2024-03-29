import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";


interface Routes {
    [key: string]: boolean
}

const publicOnlyUrl: Routes = { // 오직 로그인되지 않았을때만 조회 가능한 path  
    "/": true,
    "/login": true,
    "/sms": true,
    "/login/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
    "/google/start": true,
    "/google/complete": true
}

// return NextResponse.redirect(new URL("/", request.url))
export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrl[request.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            //
            return NextResponse.redirect(new URL("/", request.url))
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/products", request.url))
        }
    }
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
    // matcher: ["/", "/profile", "/create-account", "/user/:path*", "/adm/:path*"]
}
// matcher에 특정 경로 아래 모든경로 추가할때  "/user/:path*"
