import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    /* const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    let resonse;

    if (userId){
            response = await prisma.list.many({
              where: {  },
              include: { lists: true }
            })
        } */

    const response = await prisma.list.findMany({
      include: {
        notes: true, 
      },
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
    const response = await prisma.list.create({
      data,
      include: {
        notes: true,
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

