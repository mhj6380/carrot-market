import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    console.log(request);
    return Response.json({
        ok: true,
        date: [{
            title: "TEST1",
            content: "CONTENT1"
        }, {
            title: "TEST1",
            content: "CONTENT1"
        }, {
            title: "TEST1",
            content: "CONTENT1"
        }, {
            title: "TEST1",
            content: "CONTENT1"
        }, {
            title: "TEST1",
            content: "CONTENT1"
        }]
    })
}

export async function POST(request: NextRequest) {
    // request.cookies.get(""); 
    const data = await request.json();
    return Response.json(data)
}

export async function PUT(request: NextRequest) {
    // request.cookies.get(""); 
    const data = await request.json();
    return Response.json(data)
}

export async function DELETE(request: NextRequest) {
    // request.cookies.get(""); 
    const data = await request.json();
    return Response.json(data)
} 