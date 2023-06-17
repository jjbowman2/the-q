<script lang="ts">
	import { enhance } from '$app/forms';
	import Dialog from '$lib/components/Dialog.svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';
	import type { Database } from '../../../types/supabase';
	import type { ActionData, PageData } from './$types';
	import Game from '$lib/components/Game.svelte';
	import { anonymousAuthToken } from '$lib/stores/anonymousAuthStore';
	type Game = Database['public']['Tables']['games']['Row'];
	type Player = Database['public']['Tables']['players']['Row'];
	type GameWithPlayers = Game & { players: Player[] };
	export let form: ActionData;
	export let data: PageData;
	let {
		location: { location_name, id: location_id },
		games,
		user,
		supabase
	} = data;

	let playerName = user?.user_metadata?.name ?? user?.user_metadata?.full_name ?? '';
	let joinDialogOpen = false;
	let fourPlayers = true;

	let playerNames = [playerName, '', '', ''];
	let gameSubscription: RealtimeChannel;
	let playerSubscription: RealtimeChannel;
	$: sortedGames = games?.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
	onMount(() => {
		gameSubscription = supabase
			.channel('gameChannel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'games',
					filter: `location=eq.${location_id}`
				},
				async (payload) => {
					if (payload.eventType === 'INSERT') {
						// if a game is inserted, fetch the players (these may not be populated yet)
						let newGame = payload.new as Omit<Game, 'players'>;
						let { error, data: gameWithPlayers } = await supabase
							.from('games')
							.select('*, players(*)')
							.eq('id', newGame.id)
							.single();
						if (error || !gameWithPlayers) {
							console.error(error);
							return;
						}
						games = [...(games ?? []), gameWithPlayers];
					}
					if (payload.eventType === 'UPDATE') {
						let updatedGame = payload.new as Game;
						games =
							games?.map((game) =>
								game.id === updatedGame.id ? Object.assign(game, updatedGame) : game
							) ?? [];
					}
					if (payload.eventType === 'DELETE') {
						let deletedGame = payload.old as Game;
						games = games?.filter((game) => game.id !== deletedGame.id) ?? [];
					}
				}
			)
			.subscribe();

		playerSubscription = supabase
			.channel('playerChannel')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'players',
					filter: `game_id=in.(${games?.map((game) => game.id).join(',')})`
				},
				async (payload) => {
					if (payload.eventType === 'DELETE') {
						let deletedPlayerId = payload.old.id;
						games =
							games?.map((game) => {
								game.players =
									// @ts-ignore
									game.players?.filter((player) => player.id !== deletedPlayerId) ?? [];
								return game;
							}) ?? [];
						return;
					}

					// on any player change fetch the new game data
					const playerChange = payload.new as Player;
					const gameId = playerChange.game_id;
					if (!gameId) return;
					let { data: updatedGame, error } = await supabase
						.from('games')
						.select('*, players(*)')
						.eq('id', gameId)
						.single();
					if (error || !updatedGame) {
						console.error(error);
						return;
					}
					games =
						games?.map((game) => (game.id === gameId ? (updatedGame as GameWithPlayers) : game)) ??
						[];
				}
			)
			.subscribe();
	});

	onDestroy(() => {
		gameSubscription?.unsubscribe();
		playerSubscription?.unsubscribe();
	});
</script>

<svelte:head>
	<title>The Q | {location_name}</title>
	<meta name="description" content="The Q at {location_name}" />
</svelte:head>
<main class="h-full flex flex-col">
	<div class="container mx-auto max-w-lg px-4 flex justify-between items-end mb-4">
		<div>
			<h1 class="text-2xl text-gray-700 mb-4">{location_name}</h1>
			<p class="text-gray-600 text-sm">
				{sortedGames?.length} game{sortedGames?.length != 1 ? 's' : ''} waiting...
			</p>
		</div>
		<button
			type="button"
			class="bg-emerald-400 px-4 py-2.5 rounded-lg text-white hover:bg-emerald-500 hover:shadow-md active:shadow"
			on:click={() => (joinDialogOpen = true)}>Join the Queue</button
		>
	</div>
	<div class="w-screen bg-slate-100 flex-grow">
		<div class="max-w-lg mx-auto">
			{#if !sortedGames || sortedGames?.length == 0}
				<div class="bg-white rounded-lg shadow p-4 m-4">
					<h2 class="text-xl text-gray-700 mb-4">The queue is currently empty!</h2>
					<p class="text-gray-600 text-sm">
						Feel free to get on the court (if available), or join the queue to have next dibs.
					</p>
				</div>
			{:else}
				<div class="bg-white rounded-lg shadow m-4">
					{#each sortedGames as game, index (game.id)}
						<!-- If not the first one add a divider -->
						{#if index > 0}
							<div class="border-t border-gray-200" />
						{/if}
						<div class="px-6 py-8">
							<Game {game} {index} {user} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	<Dialog open={joinDialogOpen} onClose={() => (joinDialogOpen = false)}>
		<form
			class="p-4"
			method="post"
			action="?/createGame"
			use:enhance={() =>
				async ({ result, update }) => {
					if (result.type == 'success') {
						joinDialogOpen = false;
					}
					await update();
				}}
		>
			{#if !user}
				<input type="hidden" name="created_by_anon" value={$anonymousAuthToken} />
			{/if}
			<h2 class="text-xl text-gray-700 mb-4">Join the Queue</h2>
			<label for="gameSizeInput" class="block text-gray-700 text-sm font-semibold mb-2"
				>Number of Players</label
			>
			<label class="inline-flex items-center cursor-pointer">
				<span class="text-sm mr-3 text-gray-900">2</span>
				<div class="relative">
					<input
						type="checkbox"
						id="gameSizeInput"
						bind:checked={fourPlayers}
						name="isFourPlayers"
						class="sr-only peer"
					/>
					<div
						class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
					/>
				</div>
				<span class="ml-3 text-sm text-gray-900">4</span>
			</label>
			{#each [...Array(fourPlayers ? 4 : 2).keys()] as playerIndex}
				<div class="mt-4">
					<label for="playerNameInput" class="block text-gray-700 text-sm font-semibold mb-2"
						>Player {playerIndex + 1}</label
					>
					<input
						type="text"
						id="playerNameInput"
						bind:value={playerNames[playerIndex]}
						name="player"
						class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
						autocomplete="off"
					/>
				</div>
			{/each}
			{#if form?.error}
				<p class="text-red-500 text-sm mt-4">{form.error}</p>
			{/if}
			<div class="flex justify-end gap-6 mt-4">
				<button
					type="button"
					on:click={() => (joinDialogOpen = false)}
					class="text-gray-500 text-sm font-semibold hover:text-gray-800 active:scale-[.98]"
					>Cancel</button
				>
				<button
					type="submit"
					class="text-emerald-600 text-sm font-semibold hover:text-emerald-800 active:scale-[.98]"
					>Join</button
				>
			</div>
		</form>
	</Dialog>
</main>
