<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	let { locations } = data;
</script>

<svelte:head>
	<title>The Q | Home</title>
	<meta name="description" content="The Q Home Page" />
</svelte:head>
<main class="max-w-md mx-auto">
	<p class="text-3xl text-gray-700">
		Welcome to the <strong class="text-emerald-400">Q</strong>: where picklin' happens!
	</p>
	<p class="text-xl mt-4 text-gray-600">The Q is currently offered at the following locations:</p>
	<ul class="flex flex-col gap-2 my-4 text-gray-600">
		{#each locations as { id, location_name }}
			<li>
				<a href="/location/{id}" class="text-emerald-600 hover:text-emerald-700">
					{location_name}
				</a>
			</li>
		{/each}
	</ul>
</main>

<!-- <p>Auth stuff</p>
{#if !$page.data.session}
	<Auth />
{:else}
	<Account session={$page.data.session} />
{/if} -->
