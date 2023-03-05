import { error } from '@sveltejs/kit';
import type { PageLoad } from '../../$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const { data } = await supabase.from('locations').select().eq('id', params.slug);
	if (!data || data.length === 0) {
		throw error(404, {
			message: 'Not found'
		});
	}
	return { location: data[0] };
};
