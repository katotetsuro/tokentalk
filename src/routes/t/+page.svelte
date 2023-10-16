<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	// import RecordRTC from 'recordrtc';
	import type RecordRTC from 'recordrtc';

	let chunks: Array<Blob> = [];
	let mediaRecorder: RecordRTC;

	let chats: Array<{ role: 'user' | 'assistant'; content: string }> = [];

	let mounted = false;
	let voices: Array<SpeechSynthesisVoice> = [];
	let voiceIndex: number = 0;
	let audioURL = '';
	let file: File;
	let inputState: 'ready' | 'recording' | 'validating' = 'ready';
	let microphoneAvailable: PermissionStatus;

	const init = async () => {
		console.log('init');

		if (!navigator.mediaDevices) {
			alert('no media device');
			return;
		}

		if (speechSynthesis) {
			voices = speechSynthesis.getVoices().filter((v) => v.lang.includes('en'));
		}

		//@ts-ignore
		microphoneAvailable = await navigator.permissions.query({ name: 'microphone' });

		if (microphoneAvailable.state !== 'granted') {
			await navigator.mediaDevices.getUserMedia({ audio: true });
		}

		mounted = true;
	};

	onMount(async () => {
		init();
		send(false);
	});

	const start = async () => {
		if (inputState !== 'ready' || microphoneAvailable.state !== 'granted') {
			return;
		}

		inputState = 'recording';
		const constraints = { audio: true };
		const stream = await navigator.mediaDevices.getUserMedia(constraints).catch((e) => {
			throw new Error('failed to get audio stream');
		});

		if (browser) {
			const RRTC = (await import('recordrtc')).default;

			mediaRecorder = new RRTC(stream, {
				type: 'audio',
				recorderType: RRTC.StereoAudioRecorder, // force for all browsers
				numberOfAudioChannels: 2
			});

			mediaRecorder.startRecording();
		}
	};

	const stop = async () => {
		if (inputState !== 'recording') {
			return;
		}
		mediaRecorder.stopRecording(async () => {
			console.log('recorder stopped');
			const blob = mediaRecorder.getBlob();

			file = new File([blob], 'input.wav');
			audioURL = URL.createObjectURL(file);

			const data = new FormData();
			data.append('file', file, 'input.wav');
			data.append('language', 'en');

			const res = await fetch('/api/stt', {
				method: 'POST',
				body: file,
				headers: {
					'Content-Type': 'audio/wav'
				}
			});
			const json = (await res.json()) as any;
			input = json.response;

			send(true);
		});
	};

	let input = '';
	let answer = '';

	const send = async (recordInput: boolean) => {
		if (inputState === 'validating') {
			return;
		}

		inputState = 'validating';

		if (recordInput) {
			chats = [...chats, { role: 'user', content: input }];
		}
		const res = await fetch('/api/talk', {
			method: 'POST',
			body: JSON.stringify({ input, record: recordInput }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const json = (await res.json()) as any;
		answer = (json.response as string)
			.replaceAll('*smiles*', '☺️')
			.replaceAll('*nods*', '👍')
			.replaceAll('*adjusts glasses*', '🤓');
		chats = [...chats, { role: 'assistant', content: answer }];

		inputState = 'ready';
	};

	$: {
		if (mounted && speechSynthesis) {
			if (voices.length === 0) {
				voices = speechSynthesis.getVoices().filter((v) => v.lang.includes('en'));
			}
			const v = voices[voiceIndex];
			if (v && v.lang.includes('en')) {
				const utterThis = new SpeechSynthesisUtterance(
					answer.replace(
						/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
						''
					)
				);
				utterThis.voice = v;
				speechSynthesis.speak(utterThis);
			} else {
				console.log('en voice not found');
			}
		}
	}

	const messages = {
		ready: 'マイクを長押ししている間に入力できます',
		recording: '録音中',
		validating: '先生の会話を待っています'
	};
</script>

<div class="container">
	<div class="history">
		{#each chats as chat}
			<p class={chat.role === 'user' ? 'user' : 'assistant'}>{chat.content}</p>
		{/each}
	</div>
	<div class="input">
		<div class="record">
			<button
				class="record-button"
				on:mousedown={start}
				on:mouseup={stop}
				on:touchstart|preventDefault={start}
				on:touchend|preventDefault={stop}
				on:contextmenu|preventDefault>🎤</button
			>
			<div class={`spinner ${inputState}`} />
		</div>
		<div class="helper-text">{messages[inputState]}</div>
		<div class="options-container">
			<div>
				<button
					class="reset"
					on:click={async () => {
						await fetch('/api/reset');
						chats = [];
						send(false);
					}}>会話のコンテキストを削除</button
				>
			</div>
			<div>
				<select on:change={(e) => (voiceIndex = parseInt(e.currentTarget.value))}>
					{#each voices as voice, i}
						<option value={i}>{voice.name}, {voice.lang}</option>
					{/each}
				</select>
			</div>
		</div>
		<div style="display: none;">
			<textarea bind:value={input} />
			<button on:click={() => send(true)}>送信</button>
		</div>
	</div>
	<audio style="display: none;" src={audioURL} controls />
</div>

<style>
	div.container {
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
		min-height: 90vh;
		background: rgb(236, 245, 255);
		border-radius: 8px;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
		display: grid;
		grid-template-rows: auto 180px;
		font-family: 'Roboto', sans-serif;
	}

	div.history {
		padding: 16px;
		margin-top: auto;
		overflow-y: scroll;
	}

	.record-button {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		border: none;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
		font-size: 32px;
		cursor: pointer;
	}

	.record {
		margin: auto;
		display: block;
		width: 64px;
		height: 64px;
		position: relative;
	}

	@keyframes rot {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.spinner {
		position: absolute;
		top: 0;
		left: 0;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		box-sizing: border-box;
		pointer-events: none;
	}

	.ready {
	}

	.recording {
		border: solid 4px rgba(62, 168, 255, 0.5);
		border-top-color: rgba(62, 168, 255, 1);
		animation: rot 1s infinite ease;
	}

	.validating {
		background-color: rgba(233, 233, 233, 0.8);
	}

	button.reset {
		border: none;
		padding: 4px;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
		margin-left: auto;
		display: block;
	}

	p.user {
		margin: 16px;
		margin-left: 60px;
		padding: 16px;
		background: #6ee779;
		border-radius: 16px;
		border-bottom-right-radius: 0;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
	}

	p.assistant {
		margin: 16px;
		margin-right: 60px;
		padding: 16px;
		background: white;
		border-radius: 16px;
		border-bottom-left-radius: 0;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
	}

	div.helper-text {
		font-size: 14px;
		width: 300px;
		margin: auto;
		text-align: center;
	}

	div.options-container {
		display: grid;
		justify-content: end;
		margin: 16px 32px;
		gap: 8px;
	}
</style>
