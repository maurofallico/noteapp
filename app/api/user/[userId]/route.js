import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!user) {
      return NextResponse.json("Usuario no encontrado");
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({
      message: "Error al buscar usuario",
      error: error.message,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = params;
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
      } catch {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
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

      // ====== SOLO PUEDE BORRARSE A SÍ MISMO ======
      if (loggedUser.id !== Number(userId)) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    // ====== EXISTE EL USUARIO? ======
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // ====== BORRADO ======
    await prisma.$transaction(async (tx) => {

      const lists = await tx.list.findMany({
        where: {
          userID: Number(userId),
        },
        select: {
          id: true,
        },
      });

      const listIds = lists.map((l) => l.id);

      if (listIds.length > 0) {
        await tx.note.deleteMany({
          where: {
            listID: {
              in: listIds,
            },
          },
        });
      }

      await tx.list.deleteMany({
        where: {
          userID: Number(userId),
        },
      });

      await tx.user.delete({
        where: {
          id: Number(userId),
        },
      });
    });

    return NextResponse.json({
      message: `Usuario ${userId} eliminado correctamente`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error al intentar eliminar el usuario",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
export async function PUT(request, { params }) {
  try {
    const { userId } = await params;

    const { email } = await request.json();
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        email,
      },
    });

    return NextResponse.json({
      message: "Información del usuario actualizada exitosamente",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error al intentar actualizar el usuario",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
