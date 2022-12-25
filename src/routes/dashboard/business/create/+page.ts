import type { PageLoad } from "./$types";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async (event) => {
    const {session, supabaseClient} = await getSupabase(event);

    if (!session) {
        throw redirect(307, '/auth/login')
    }

    const {data, error} = await supabaseClient
        .from('businesses')
        .select('id')
        .eq('owner_id', session?.user?.id);

    if (data) {
        throw redirect(307, '/dashboard/business/')
    }
}
