import { NextRequest, NextResponse } from 'next/server';

import { winnersTable } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(winnersTable);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch winners' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, score } = await req.json();

    if (!name || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Name and score are required' },
        { status: 400 },
      );
    }

    const data = await db
      .select()
      .from(winnersTable)
      .where(eq(winnersTable.name, name));

    if (data.length == 1) {
      await db
        .update(winnersTable)
        .set({
          score,
        })
        .where(eq(winnersTable.name, name));
      console.log('User info updated!');
    } else {
      const winner: typeof winnersTable.$inferInsert = {
        name,
        score,
      };
      await db.insert(winnersTable).values(winner);
    }

    return NextResponse.json({
      success: true,
      message: 'Winner added or updated.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add or update winner' },
      { status: 500 },
    );
  }
}
