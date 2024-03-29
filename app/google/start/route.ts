import { redirect } from "next/navigation";

export function GET() {
    const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";

    // https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
    // process.env.VUE_APP_GOOGLE_CLIENT_ID +
    //     '&redirect_uri=' +
    //     process.env.VUE_APP_GOOGLE_REDIRECT_URL +
    //     '&response_type=code' +
    //     '&scope=email profile';


    const params = {
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: "http://localhost:3000/google/complete",
        response_type: "code",
        scope: "email profile"
    }

    const formattedParams = new URLSearchParams(params).toString();
    const finalUrl = `${baseURL}?${formattedParams}`;

    return redirect(finalUrl);
} 