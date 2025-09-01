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
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!user) {
      return NextResponse.json("Usuario no encontrado");
    }

    await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    return NextResponse.json(
      `Usuario con id ${userId} fue eliminado correctamente`
    );
  } catch (error) {
    return NextResponse.json({
      message: "Error al intentar eliminar el usuario",
      error: error.message,
    });
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
        email
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
