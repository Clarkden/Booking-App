import supabase from "$lib/db";
import type { LayoutLoad } from "./$types";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async (event) => {
  const { session, supabaseClient } = await getSupabase(event);


  if (!session) throw redirect(307, "/auth");

  let business: any;
  let services: any[] = [];

  {
    const { data } = await supabaseClient
      .from("businesses")
      .select("*")
      .eq("owner_id", session?.user.id);

    if (data) business = data[0];
  }
  if (business) {
    const { data } = await supabaseClient
      .from("services")
      .select("*")
      .eq("business_id", business.id);

    if (data) services = data;
  }

  return {
    user: session.user,
    business: business,
    services: services,
  };
};
