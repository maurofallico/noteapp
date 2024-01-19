import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    try {
    const archived = searchParams.get("archived");
    const cat = searchParams.get("cat")
        let whereCondition = {
          archive: false,
        };
        if (archived === "true") {
          whereCondition = {
            archive: true,
          };
        }
        if (cat) {
          const categoriesArray = Array.isArray(cat) ? cat : [cat];
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
        return NextResponse.json(error.message);
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

