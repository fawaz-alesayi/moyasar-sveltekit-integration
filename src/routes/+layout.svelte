<script>
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	import '@skeletonlabs/skeleton/styles/skeleton.css';

	import '../app.postcss';
</script>

<main>
	<slot />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
