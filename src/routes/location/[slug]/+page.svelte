<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	let {
		location: { location_name, courts_available }
	} = data;
</script>

<main>
	<h1>{location_name}</h1>
	<p>There are {courts_available} courts available.</p>
</main>
