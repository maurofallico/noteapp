import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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

    await prisma.list.delete({
      where: { id: Number(listId) },
    });
    return NextResponse.json("list deleted!");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
