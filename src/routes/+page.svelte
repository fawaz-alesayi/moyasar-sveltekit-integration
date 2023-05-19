<script>
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	export let form;

	const checkout_form = data.form;

	const { enhance, delayed, constraints, form: client_form } = superForm(checkout_form);
</script>

<form
	class="max-w-md mt-10 border-t border-gray-200 pt-10 mx-auto"
	use:enhance
	method="POST"
	action="?/pay"
>
	<h2 class="text-lg font-bold text-gray-900">Payment</h2>

	<fieldset class="mt-4">
		<legend class="sr-only">Payment Type</legend>
		<div class="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
			<div class="flex items-center">
				<input
					id="credit-card"
					name="payment-type"
					type="radio"
					checked
					class="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
				/>
				<label for="credit-card" class="block text-sm font-medium text-gray-700 ml-3"
					>Credit Card 💳</label
				>
			</div>
			<!-- <div class="flex items-center">
					<input
						id="mada"
						name="payment-type"
						type="radio"
						class="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
					/>
					<label for="mada" class="block text-sm font-medium text-gray-700 ml-3">Mada</label>
				</div> -->
		</div>
	</fieldset>

	<div class="grid grid-cols-4 gap-x-4 gap-y-6 mt-6">
		<div class="col-span-4">
			<label for="card-number" class="block text-sm font-medium text-gray-700">Card Number</label>
			<div class="mt-1">
				<input
					placeholder="544XXXXXXXXXXXX1"
					dir="ltr"
					id="card-number"
					type="number"
					inputmode="numeric"
					name="card-number"
					autocomplete="cc-num"
					bind:value={$client_form['card-number']}
					class="p-2 block w-full appearance-none shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					{...$constraints['card-number']}
				/>
			</div>
		</div>

		<div class="col-span-4">
			<label for="name-on-card" class="block text-sm font-medium text-gray-700">Name on Card</label>
			<div class="mt-1">
				<input
					placeholder="Mohammed M."
					dir="ltr"
					type="text"
					id="name-on-card"
					name="name-on-card"
					autocomplete="cc-name"
					bind:value={$client_form['name-on-card']}
					{...$constraints['name-on-card']}
					class="p-2 block w-full shadow-sm rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
				/>
			</div>
		</div>

		<div class="col-span-2">
			<label for="expiration-date" class="block text-sm font-medium text-gray-700"
				>Expiration Date (MM/YY)</label
			>
			<div class="mt-1">
				<input
					placeholder="12/25"
					dir="ltr"
					type="text"
					name="expiration-date"
					id="expiration-date"
					autocomplete="cc-exp"
					bind:value={$client_form['expiration-date']}
					{...$constraints['expiration-date']}
					class="p-2 block w-full shadow-sm rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
				/>
			</div>
		</div>

		<div class="col-span-2">
			<label for="cvc" class="block break-keep text-sm font-medium text-gray-700">CVC </label>
			<div class="mt-1">
				<input
					dir="ltr"
					type="number"
					inputmode="numeric"
					name="cvc"
					id="cvc"
					autocomplete="csc"
					placeholder="000"
					bind:value={$client_form.cvc}
					{...$constraints.cvc}
					class=" p-2 block max-w-full appearance-none self-center shadow-sm rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
				/>
			</div>
		</div>
	</div>

	<button
		type="submit"
		class="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto"
	>
		<span>Pay</span>
	</button>
</form>
