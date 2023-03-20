<script lang="ts">
	import LocationLink from '$lib/components/LocationLink.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	let { locations } = data;
</script>

<svelte:head>
	<title>The Q | Home</title>
	<meta name="description" content="The Q Home Page" />
</svelte:head>
<main class="max-w-md mx-auto container px-4">
	<p class="text-3xl text-gray-700">
		Welcome to the <strong class="text-emerald-400">Q</strong>: where picklin' happens!
	</p>
	<p class="text-xl mt-4 text-gray-600 text-justify">
		The Q is currently offered at the following locations:
	</p>
	<ul class="flex flex-col gap-4 my-4">
		{#each locations as location}
			<li>
				<LocationLink {location} />
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
