import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();
	const { data } = await supabase.from('locations').select();
	return { locations: data ?? [] };
};
