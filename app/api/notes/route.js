import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const categoriesArray = searchParams.getAll("cat"); 

    let whereCondition = {};

    if (categoriesArray.length > 0) {
      whereCondition.category = {
        hasSome: categoriesArray,
      };
    }

    const response = await prisma.note.findMany({
      where: whereCondition,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await prisma.note.create({
      data: data,
    });
    return NextResponse.json("note created!");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

