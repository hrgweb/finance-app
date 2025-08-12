<script lang="ts">
	import Form from '$lib/components/app/plan-payment/form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex h-screen flex-col justify-between space-y-6 bg-zinc-100 px-12 py-10">
	<div class="header rounded-md bg-amber-500 py-1 text-center">
		<h2 class="text-2xl font-bold">HRG Finance App</h2>
	</div>

	<div class="content flex-1 border-2 border-red-500">
		<Button>Planned Payments</Button>
		<br />
		<br />
		<Form />
	</div>

	<div class="footer border-2 border-blue-500 text-center">Copyright 2025 &copy;</div>
</div>
