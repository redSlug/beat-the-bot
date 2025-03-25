import { NextResponse } from "next/server";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
// import { supabase } from "@/utils/supabase";
// import { Database } from './database.types'; // Ensure this path is correct

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// export async function GET() {
//   console.log(
//     "hark we are here",
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_API_KEY
//   );

//   try {
//     const client = await createClient(
//       process.env.SUPABASE_URL!,
//       process.env.SUPABASE_API_KEY!
//     );
//     const { error, data } = await client.from("winners").select();
//     return NextResponse.json({ data, error, JSOND: JSON.stringify(data) });
//   } catch (e) {
//     console.log("hark an error is occurring", e);
//     return NextResponse.json(
//       { error: " HARK internal server error, no!!!!" },
//       { status: 500 }
//     );
//   }
// }

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

export async function POST(request: Request) {
  try {
    const { name, score } = await request.json();

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
