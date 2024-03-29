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
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!
    }).toString();

    const accessTokenURL = `https://oauth2.googleapis.com/token?${params}`;

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

    // console.log({ access_token });

    const userProfileResponse = await fetch(`https://www.googleapis.com/userinfo/v2/me?access_token=${access_token}`, {
        // headers: {
        //     Authorization: `Bearer ${access_token}`
        // },
        cache: "no-cache" // important 
    });

    const userProfileData = await userProfileResponse.json();

    const { id, picture, name } = userProfileData;

    const user = await db.user.findUnique({
        where: {
            github_id: id + ""
        }, select: {
            id: true
        }
    });
    console.log({ user });
    if (user) {
        // 유저정보가 이미 있다면 로그인처리
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/products");

    }


    const newUser = await db.user.create({
        data: {
            username: name,    // github Username 값 
            github_id: id + "",     // 고유 ID 값 
            avatar: picture
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