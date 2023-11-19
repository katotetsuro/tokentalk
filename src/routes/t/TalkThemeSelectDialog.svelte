<script lang="ts">
	import TalkThemeCard from './TalkThemeCard.svelte';

	let dialogRef: HTMLDialogElement;
	export let selectedTheme: string | null;

	const close = (theme: string) => {
		if (dialogRef) {
			dialogRef?.close(theme);
			selectedTheme = theme;
		}
	};

	$: {
		if (!selectedTheme) {
			dialogRef?.showModal();
		}
	}
</script>

<dialog bind:this={dialogRef} on:close>
	<h2>会話のテーマを選択してください</h2>
	<div class="grid-container">
		<TalkThemeCard title="AI Technology" on:click={() => close('AI Technology')} />
		<TalkThemeCard title="Food & Cooking" on:click={() => close('Food & Cooking')} />
		<TalkThemeCard
			title="Working at a global company"
			on:click={() => close('Working at a global company')}
		/>
	</div>
	<div />
</dialog>

<style>
	dialog {
		border: none;
		border-radius: 8px;
		font-family: 'Noto Sans JP', 'Roboto', sans-serif;
	}

	div.grid-container {
		display: grid;
		gap: 24px;
		width: 80%;
		margin: auto;
	}
</style>
