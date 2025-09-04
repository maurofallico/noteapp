import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    let user;
    let users;

    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { lists: true },
      });
    } else {
      users = await prisma.user.findMany({
        include: {
          lists: {
            include: {
              notes: true
            },
          },
        },
      });
    }
    if (users) {
      return NextResponse.json(users);
    } else if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json(
        {
          message: "No se encontró ningún usuario con esa informacion",
        },
        { status: 202 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    const emailFound = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailFound) {
      return NextResponse.json(
        { error: `${email} ya existe, por favor ingrese un correo diferente` },
        { status: 409 }
      );
    }
    if (email) {
      const newUser = await prisma.user.create({
        data: {
          email,
          lists: {
            create: [
              { name: "To Do" },
              { name: "In Progress" },
              { name: "Finished" },
            ],
          },
        },
        include: {
          lists: true,
        },
      });

      return NextResponse.json({
        message: "Usuario creado exitosamente",
        data: newUser,
      });
    } else {
      return NextResponse.json(
        "Hace falta informacion para la creacion del usuario"
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Ocurrio un error creando el usuario, intente nuevamente",
        error: error.message,
      },
      { status: 203 }
    );
  }
}
