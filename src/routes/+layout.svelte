<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
</script>

<div class="flex flex-col h-full">
	<Header {data} />
	<div class="flex-grow"><slot /></div>
	<Footer />
</div>
