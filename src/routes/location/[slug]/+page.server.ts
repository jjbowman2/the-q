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
				created_by: session?.user?.id,
				created_by_anon
			})
			.select()
			.single();
		
		if (error) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}
		const { error: playerError, data: playerResult } = await locals.supabase
			.from('players')
			.insert(players.map((player) => ({
				game_id: game.id,
				player_name: player,
				created_by: session?.user?.id,
				created_by_anon,
				location: slug
			})));
		
		if (playerError) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}

		return {
			success: true,
			game: {
				...game,
				players: playerResult
			}
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
		const created_at = data.get('created-at')?.toString() ?? null; 
		if (!created_at) {
			return fail(400, { error: 'Please enter a valid date.' });
		}

		const { data: nextGame } = await locals.supabase
			.from('games')
			.select('*')
			.eq('location', slug)
			.gt('created_at', created_at)
			.order('created_at', { ascending: true })
			.range(0, 0)
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
		const playerId = data.get('player-id')?.toString() ?? null;
		const { data: sessionHolder } = await locals.supabase.auth.getSession();
		const user = sessionHolder?.session?.user;
		const created_by_anon = data.get('created_by_anon')?.toString() ?? null;
		const newPlayer =
			data.get('player-name')?.toString() ?? user?.user_metadata?.name ?? user?.user_metadata?.full_name;

		if (!newPlayer) {
			return fail(400, { error: 'Please enter a name.' });
		}

		// if existing player id, rename and return
		if (playerId) {
			const { error } = await locals.supabase
			.from('players')
			.update({
				player_name: newPlayer
			})
			.eq('id', playerId)
			.single();
			if (error) {
				return fail(500, { data: 'Something went wrong, please try again.' });
			}
			return {
				success: true
			};
		}
		
		// else check if game has capacity
		const { data: game } = await locals.supabase
			.from('games')
			.select('*, players(*)')
			.eq('id', data.get('game-id'))
			.single();

		if (!game) {
			return fail(404, { error: 'Game was not found, please try again.' });
		}

		let playerCount = 1;
		if (Array.isArray(game.players)) playerCount = game.players.length;
		
		const gameSize = game.game_size ?? 4;

		if (playerCount >= gameSize) {
			return fail(400, { error: 'Game is full, please try again.' });
		}

		const { error } = await locals.supabase
			.from('players')
			.insert({
				game_id: game.id,
				player_name: newPlayer,
				created_by: user?.id,
				created_by_anon,
				location: game.location
			})

		if (error) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}

		return {
			success: true
		};
	},
	leaveGame: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();
		const playerId = data.get('player-id')?.toString() ?? null;
		const { error } = await locals.supabase
			.from('players')
			.delete()
			.eq('id', playerId)
			.single();

		if (error) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}

		return {
			success: true
		};
	},
	renamePlayer: async ({ request, locals }: RequestEvent) => {
		const data = await request.formData();
		const playerId = data.get('player-id')?.toString() ?? null;
		const newPlayer = data.get('player-name')?.toString() ?? null;

		if (!newPlayer) {
			return fail(400, { error: 'Please enter a name.' });
		}

		const { error } = await locals.supabase
			.from('players')
			.update({
				player_name: newPlayer
			})
			.eq('id', playerId)
			.single();

		if (error) {
			return fail(500, { data: 'Something went wrong, please try again.' });
		}

		return {
			success: true
		};
	}
};
