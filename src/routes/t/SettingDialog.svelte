<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let voices: Array<SpeechSynthesisVoice>;
	export let voiceIndex: number;

	let dialogRef: HTMLDialogElement;
	let open = false;

	const dispatcher = createEventDispatcher();

	const resetHistory = () => {
		dispatcher('reset');
	};
</script>

<dialog bind:this={dialogRef} {open}>
	<div class="container">
		<div>
			<select
				on:change={(e) => {
					voiceIndex = parseInt(e.currentTarget.value);
				}}
			>
				{#each voices as voice, i}
					<option value={i}>{voice.name}, {voice.lang}</option>
				{/each}
			</select>
		</div>
		<div>
			<button
				class="reset"
				on:click={() => {
					resetHistory();
					dialogRef.close();
				}}>会話のコンテキストを削除</button
			>
		</div>
		<div>
			<a href="/#faq" target="_blank">読み上げのクオリティが低い</a>
		</div>
		<div class="close-button-container">
			<button on:click={() => dialogRef.close()}>閉じる</button>
		</div>
	</div>
</dialog>

<button
	class="setting"
	on:click={() => {
		dialogRef.showModal();
	}}>⚙️</button
>

<style>
	* {
		font-family: 'Noto Sans JP', 'Roboto', sans-serif;
	}
	dialog {
		border: none;
		border-radius: 8px;
	}

	div.container {
		display: grid;
		gap: 36px;
	}

	button {
		border: none;
		background: rgb(236, 236, 236);
		height: 32px;
		border-radius: 4px;
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
		cursor: pointer;
		background-color: #2668d8;
		color: white;
	}

	a {
		font-size: 14px;
	}

	button.setting {
		border: none;
		font-size: 24px;
		font-family: 'Roboto', sans-serif;
		background-color: white;
	}

	div.close-button-container {
		text-align: right;
	}
</style>
