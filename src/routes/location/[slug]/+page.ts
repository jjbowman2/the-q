import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, session } = await parent();
	const { data: locations } = await supabase.from('locations').select().eq('id', params.slug);
	if (!locations || locations.length === 0) {
		throw error(404, {
			message: 'Not found'
		});
	}
	// fetch all the games for this location
	const { data: games, status } = await supabase.from('games')
		.select('*, players(*)')
		.eq('location', params.slug);
	if (status !== 200) {
		throw error(500, {
			message: 'Something went wrong'
		});
	}
	return { location: locations[0], games, user: session?.user };
};
