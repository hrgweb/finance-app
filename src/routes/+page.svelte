<script lang="ts">
	import { goto } from '$app/navigation';
	import Form from '$lib/components/app/plan-payment/form.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';

	onMount(async () => await goto('/payroll'));
</script>

<div class="flex h-screen flex-col justify-between space-y-6 bg-zinc-100 px-12 py-10">
	<div class="header rounded-md bg-amber-500 py-1 text-center">
		<h2 class="text-2xl font-bold">HRG Finance App</h2>
	</div>

	<div class=" flex-1 bg-slate-200 p-6">
		<Button>Planned Payments</Button>

		<div class="mt-4 h-[calc(100vh-300px)] overflow-y-auto border-2 border-blue-500">
			<Form />
		</div>
	</div>

	<div class="footer border-2 border-blue-500 text-center">Copyright 2025 &copy;</div>
</div>
