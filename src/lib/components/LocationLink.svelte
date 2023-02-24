<script lang="ts">
	type Location = {
		id: string;
		location_name: string;
		image_url: string | null;
	};
	export let location: Location;
	const { id, location_name, image_url } = location;
</script>

<a href="/location/{id}">
	<div class="relative hover:scale-105 transition-all">
		<img
			src={image_url}
			alt={location_name}
			class="w-full h-40 object-cover rounded-2xl shadow hover:shadow-2xl"
		/>
		<span
			class="absolute bottom-0 w-full h-16 bg-gradient-to-t from-black to-transparent rounded-2xl"
		/>
		<span class="absolute bottom-0 right-0 p-4 text-white uppercase tracking-widest text-3xl"
			>{location_name}</span
		>
	</div>
</a>
