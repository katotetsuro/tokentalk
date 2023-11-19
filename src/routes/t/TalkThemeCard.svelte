<script lang="ts">
	export let title = '';
</script>

<div>
	<button on:click>{title}</button>
</div>

<style>
	div {
		width: 100%;
	}
	button {
		width: 100%;
		border: none;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
		font-size: 24px;
		background-color: #2668d8;
		color: white;
		cursor: pointer;
		line-height: 36px;
		border-radius: 8px;
	}
</style>
