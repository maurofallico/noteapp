import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { noteId } = params;
  try {
    if (noteId) {
      
      const result = await prisma.note.findUnique({
        where: {
          id: Number(noteId),
        },
        include: { list: true },
      });
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json("note not found", { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const { noteId } = params;

    await prisma.note.update({
      where: {id: Number(noteId)},
      data: data,
    });
    return NextResponse.json("note updated!");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(request, { params }) {
    try {
      const { noteId } = params;
  
      await prisma.note.delete({
        where: {id: Number(noteId)},
      });
      return NextResponse.json("note deleted!");
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error.message });
    }
  }
