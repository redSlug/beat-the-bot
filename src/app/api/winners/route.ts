import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("winners")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch winners" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, score } = await req.json();

    if (!name || typeof score !== "number") {
      return NextResponse.json(
        { error: "Name and score are required" },
        { status: 400 }
      );
    }

    const { data: existingWinner } = await supabase
      .from("winners")
      .select("*")
      .eq("name", name)
      .maybeSingle();

    let result;

    if (existingWinner) {
      result = await supabase
        .from("winners")
        .update({ score })
        .eq("name", name);
    } else {
      result = await supabase.from("winners").insert([{ name, score }]);
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Winner added or updated.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add or update winner" },
      { status: 500 }
    );
  }
}
