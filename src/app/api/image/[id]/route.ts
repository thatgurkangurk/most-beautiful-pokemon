import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    // code from https://github.com/t3dotgg/faster-round/blob/main/src/pages/api/image/%5Bid%5D.ts
    const { id } = params;

    const rawId = id.replace(".png", "");
    const mon = parseInt(rawId, 10);
    if (typeof mon !== "number")
        return new NextResponse("Not found", { status: 404 });

    const data = await fetch(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mon}.png`
    );

    const newRes = new NextResponse(data.body);

    newRes.headers.set("Cache-Control", "max-age=31536000, immutable");

    return newRes;
}