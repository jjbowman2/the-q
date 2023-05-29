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
	let supabaseSubscription: RealtimeChannel;
	$: console.log($anonymousAuthToken);
	onMount(() => {
		supabaseSubscription = supabase
			.channel('schema-db-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'games',
					filter: `location=eq.${location_id}`
				},
				(payload) => {
					if (payload.eventType === 'INSERT') {
						let newGame = payload.new as Game;
						games = [...(games ?? []), newGame];
					}
					if (payload.eventType === 'UPDATE') {
						let updatedGame = payload.new as Game;
						games = games?.map((game) => (game.id === updatedGame.id ? updatedGame : game)) ?? [];
					}
					if (payload.eventType === 'DELETE') {
						let deletedGame = payload.old as Game;
						games = games?.filter((game) => game.id !== deletedGame.id) ?? [];
					}
				}
			)
			.subscribe();
	});

	onDestroy(() => {
		supabaseSubscription?.unsubscribe();
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
				{games?.length} game{games?.length != 1 ? 's' : ''} waiting...
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
			{#if !games || games?.length == 0}
				<div class="bg-white rounded-lg shadow p-4 m-4">
					<h2 class="text-xl text-gray-700 mb-4">The queue is currently empty!</h2>
					<p class="text-gray-600 text-sm">
						Feel free to get on the court (if available), or join the queue to have next dibs.
					</p>
				</div>
			{:else}
				<div class="bg-white rounded-lg shadow m-4">
					{#each games as game, index}
						<!-- If not the first one add a divider -->
						{#if index > 0}
							<div class="border-t border-gray-200" />
						{/if}
						<!-- <form method="post" action="?/deleteGame" use:enhance>
							<input type="hidden" name="game-id" value={game.id} />
							<button
								type="submit"
								class="text-emerald-600 ml-auto block hover:text-emerald-700 active:scale-95"
								>Start Game</button
							>
						</form> -->
						<div class="px-6 py-8">
							<Game
								{game}
								{index}
								isCurrentUsersGame={(game.created_by !== null && game.created_by === user?.id) ||
									(game.created_by == null && game.created_by_anon === $anonymousAuthToken)}
							/>
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
