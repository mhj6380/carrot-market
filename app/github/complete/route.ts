import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return notFound();
    }


    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,

    }).toString();

    const accessTokenURL = `https://github.com/login/oauth/access_token?${params}`;

    const accessTokenResponse = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    });
    const { error, access_token } = await accessTokenResponse.json();

    if (error) {
        // accessTokenData 객체에 error 키가 포함된경우 에러
        return new Response(null, {
            status: 400
        })
    }

    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`
        },
        cache: "no-cache" // important 
    });

    const userProfileData = await userProfileResponse.json();

    const { id, avatar_url, login } = userProfileData;

    const user = await db.user.findUnique({
        where: {
            github_id: id + ""
        }, select: {
            id: true
        }
    });
    if (user) {
        // 유저정보가 이미 있다면 로그인처리
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/products");

    }


    const newUser = await db.user.create({
        data: {
            username: login,    // github Username 값
            github_id: id + "",     // 고유 ID 값 
            avatar: avatar_url
        }, select: {
            id: true
        }
    });
    const session = await getSession();
    session.id = newUser.id;
    await session.save();
    return redirect("/profile");

    // return Response.json({ userProfileData }); 
}