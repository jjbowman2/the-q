import { fail } from '@sveltejs/kit';
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

		const created_by_anon = data.get('created_by_anon')?.toString() ?? null;

		if (!location) {
			return fail(404, { error: 'Location was not found, please try again.' });
		}
		if (players.length == 0) {
			return fail(400, { error: 'Please enter at least one player.' });
		}

		const { data: sessionHolder } = await locals.supabase.auth.getSession();
		const session = sessionHolder?.session;

		const { error, data: game } = await locals.supabase
			.from('games')
			.insert({
				game_size: isFourPlayers ? 4 : 2,
				location: location.id,
				players,
				created_by: session?.user?.id,
				created_by_anon
			})
			.select()
			.single();
		if (error) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}

		return {
			success: true,
			game
		};
	},
	deleteGame: async ({ request, params, locals }: RequestEvent) => {
		const { slug } = params;
		const data = await request.formData();

		const { data: location } = await locals.supabase
			.from('locations')
			.select('*')
			.eq('id', slug)
			.single();

		if (!location) {
			return fail(404, { error: 'Location was not found, please try again.' });
		}

		const { error } = await locals.supabase
			.from('games')
			.delete()
			.eq('id', data.get('game-id'))
			.single();

		if (error) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}

		return {
			success: true
		};
	},
	delayGame: async ({ request, params, locals }: RequestEvent) => {
		const { slug } = params;
		const data = await request.formData();

		const { data: location } = await locals.supabase
			.from('locations')
			.select('*')
			.eq('id', slug)
			.single();

		if (!location) {
			return fail(404, { error: 'Location was not found, please try again.' });
		}

		// find the game with created at larger than the current game
		const { data: game } = await locals.supabase
			.from('games')
			.select('*')
			.eq('id', data.get('game-id'))
			.single();

		if (!game) {
			return fail(404, { error: 'Game was not found, please try again.' });
		}

		const { data: nextGame } = await locals.supabase
			.from('games')
			.select('*')
			.eq('location', location.id)
			.gt('created_at', game.created_at)
			.order('created_at', { ascending: true })
			.single();

		const nextTime = Date.parse(nextGame?.created_at ?? new Date().toISOString()) + 1;
		const updatedDate = new Date(nextTime).toISOString();

		const { error } = await locals.supabase
			.from('games')
			.update({
				created_at: updatedDate
			})
			.eq('id', data.get('game-id'))
			.single();

		if (error) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}

		return {
			success: true
		};
	}
};
