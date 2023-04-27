import type { RequestEvent } from './$types.js';

export const actions = {
	createGame: async ({ request, params, locals }: RequestEvent) => {
		const { slug } = params;
		const data = await request.formData();

		const isFourPlayers = data.get('isFourPlayers') === 'on';
		const players = data
			.getAll('player')
			.slice(0, isFourPlayers ? 4 : 2)
			.filter(Boolean)
			.map(String);

		const { data: location } = await locals.supabase
			.from('locations')
			.select('*')
			.eq('id', slug)
			.single();

		if (!location) {
			return {
				status: 404,
				error: 'Location was not found, please try again.'
			};
		}
		const { data: sessionHolder } = await locals.supabase.auth.getSession();
		const session = sessionHolder?.session;

		const { error } = await locals.supabase
			.from('games')
			.insert({
				game_size: isFourPlayers ? 4 : 2,
				location: location.id,
				players,
				created_by: session?.user?.id
			})
			.single();
		if (error) {
			return {
				status: 500,
				error: 'Something went wrong, please try again.'
			};
		}

		return {
			success: true
		};
	}
};
