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

		const created_by_anon = data.get('created_by_anon')?.toString() ?? null;

		if (players.length == 0) {
			return fail(400, { error: 'Please enter at least one player.' });
		}

		const { data: sessionHolder } = await locals.supabase.auth.getSession();
		const session = sessionHolder?.session;

		const { error, data: game } = await locals.supabase
			.from('games')
			.insert({
				game_size: isFourPlayers ? 4 : 2,
				location: slug,
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
	deleteGame: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();
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

		const { data: nextGame } = await locals.supabase
			.from('games')
			.select('*')
			.eq('location', slug)
			.gt('created_at', data.get('created-at'))
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
	},
	joinGame: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();

		const { data: game } = await locals.supabase
			.from('games')
			.select('*')
			.eq('id', data.get('game-id'))
			.single();

		if (!game) {
			return fail(404, { error: 'Game was not found, please try again.' });
		}

		const { data: sessionHolder } = await locals.supabase.auth.getSession();
		const user = sessionHolder?.session?.user;
		const newPlayer =
			data.get('player-name')?.toString() ??
			user?.user_metadata?.name ??
			user?.user_metadata?.full_name;

		if (!newPlayer) {
			return fail(400, { error: 'Please enter a name.' });
		}

		if (game.players.length >= game.game_size) {
			return fail(400, { error: 'Game is full, please try again.' });
		}

		const { error } = await locals.supabase
			.from('games')
			.update({
				players: [...game.players, newPlayer]
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
