<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import InputWrapper from '$lib/shared/input-wrapper.svelte';
	import Select from '$lib/shared/select.svelte';
	import categoryList from '$lib/data/categories.json';
	import accountList from '$lib/data/accounts.json';
	import paymentTypeList from '$lib/data/paymentTypes.json';
	import frequencyList from '$lib/data/frequencies.json';
	import type { IAccount, ICategory, IFrequency, INotification, IPaymentType } from '$lib/types';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Datepicker from '$lib/shared/datepicker.svelte';
	import type { DateValue } from '@internationalized/date';
	import notificationList from '$lib/data/notifications.json';

	interface IForm {
		name: string;
		category: string | number;
		account: string | number;
		amount: number;
		paymentType: string | number;
		payee: string;
		frequency: string | number;
		note: string;
		date: Date | string | undefined;
		notification: string | number;
		labels: string[];
	}

	let category = $state<string>('');
	let categories = $state<ICategory[]>(categoryList);
	let account = $state<string>('');
	let accounts = $state<IAccount[]>(accountList);
	let paymentType = $state<string>('');
	let paymentTypes = $state<IPaymentType[]>(paymentTypeList);
	let frequency = $state<string>('');
	let frequencies = $state<IFrequency[]>(frequencyList);
	let notification = $state<string>('');
	let notifications = $state<INotification[]>(notificationList);
	let form = $state<IForm>({
		name: '',
		category: '',
		account: '',
		amount: 0,
		paymentType: '',
		payee: '',
		frequency: '',
		note: '',
		date: new Date(),
		notification: '',
		labels: []
	});
	let selectedDate = $state<DateValue | undefined>();

	$effect(() => {
		form.date = selectedDate?.toString();
	});

	$inspect(categories);
</script>

<form method="POST" class="w-1/2 space-y-4 rounded-md bg-gray-300 p-4">
	<h3 class="text-md font-medium">New Plan Payment</h3>

	<InputWrapper label="Name" labelFor="name" class="flex w-1/2  px-0!">
		<Input type="text" id="name" class="w-full" />
	</InputWrapper>

	<InputWrapper label="Category" labelFor="category" class="flex w-1/2  px-0!">
		<Select
			class="dark:border-none dark:bg-[#292D33]"
			bind:value={category}
			items={categories}
			triggerStr="Select Category"
		/>
	</InputWrapper>

	<InputWrapper label="Account" labelFor="account" class="flex w-1/2  px-0!">
		<!-- TODO: accounts should coming from db -->
		<Select
			class="dark:border-none dark:bg-[#292D33]"
			bind:value={account}
			items={accounts}
			triggerStr="Select Account"
		/>
	</InputWrapper>

	<div class="flex items-center gap-6">
		<InputWrapper label="Amount" labelFor="Category" class="flex w-1/2  px-0!">
			<Select
				class="dark:border-none dark:bg-[#292D33]"
				bind:value={category}
				items={categories}
				triggerStr="Select Category"
			/>
		</InputWrapper>
		<InputWrapper label="Currency" labelFor="currency" class="flex w-1/2  px-0!">
			<Input type="text" id="currency" class="w-full" />
		</InputWrapper>
	</div>

	<InputWrapper label="Payment Type" labelFor="payment_type" class="flex w-1/2  px-0!">
		<Select
			class="dark:border-none dark:bg-[#292D33]"
			bind:value={paymentType}
			items={paymentTypes}
			triggerStr="Select Payment Type"
		/>
	</InputWrapper>

	<InputWrapper label="Payee" labelFor="payee" class="flex w-1/2  px-0!">
		<Input type="text" id="currency" class="w-full" />
	</InputWrapper>

	<InputWrapper label="Frequency" labelFor="frequency" class="flex w-1/2  px-0!">
		<Select
			class="dark:border-none dark:bg-[#292D33]"
			bind:value={frequency}
			items={frequencyList}
			triggerStr="Select Frequency"
		/>
	</InputWrapper>

	<InputWrapper label="Note" labelFor="note" class="flex w-1/2  px-0!">
		<Textarea class="bg-white" placeholder="Type your message here." />
	</InputWrapper>

	<pre>{selectedDate?.toString()}</pre>

	<div class="flex items-center gap-6">
		<InputWrapper label="Date" labelFor="date" class="flex w-1/2  px-0!">
			<Datepicker bind:value={selectedDate} />
		</InputWrapper>
		<InputWrapper label="Notification" labelFor="notification" class="flex w-1/2  px-0!">
			<Select
				class="dark:border-none dark:bg-[#292D33]"
				bind:value={account}
				items={notifications}
				triggerStr="Select Account"
			/>
		</InputWrapper>
	</div>

	<InputWrapper label="Labels" labelFor="labels" class="flex w-1/2  px-0!">
		<!-- TODO: coming from db -->
	</InputWrapper>
</form>

<style>
</style>
