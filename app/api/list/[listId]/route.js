import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/lib/firebaseAdmin";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { listId } = params;

  try {
    if (listId) {
      const result = await prisma.list.findUnique({
        where: { id: Number(listId) },
        include: { notes: true },
      });
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json("list not found", { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const { listId } = params;

    const updated = await prisma.list.update({
      where: { id: Number(listId) },
      data,
      include: { notes: true },
    });
    return NextResponse.json("list updated!");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { listId } = params;
    const apiKey = request.headers.get("x-api-key");

    if (apiKey !== process.env.ADMIN_API_KEY) {
      const authHeader = request.headers.get("authorization");

      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const token = authHeader.replace("Bearer ", "");

      let decoded;

      try {
        decoded = await adminAuth.verifyIdToken(token);
      } catch (error) {
        console.log("VERIFY TOKEN ERROR");
        console.log(error);

        return NextResponse.json(
          {
            error: error.message,
            code: error.code,
          },
          {
            status: 401,
          }
        );
      }

      // ====== BUSCAR USUARIO REAL ======
      const loggedUser = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (!loggedUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const list = await prisma.list.findUnique({
        where: {
          id: Number(listId),
        },
      });

      if (!list) {
        return NextResponse.json(
          { error: "List not found" },
          { status: 404 }
        );
      }

      if (list.userID !== loggedUser.id) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    await prisma.list.delete({
      where: { id: Number(listId) },
    });
    return NextResponse.json("list deleted!");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
