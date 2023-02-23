import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { data } = await supabase.from('locations').select().eq('id', params.slug);
	if (!data || data.length === 0) {
		throw error(404, {
			message: 'Not found'
		});
	}
	return { location: data[0] };
};
