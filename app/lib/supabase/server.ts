import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const supabase = createServerClient({ cookies });

const { data } = await supabase.from("users").select();
