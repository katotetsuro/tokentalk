<script lang="ts">
</script>

<div class="container">
	<h1><span>AI</span>と学ぶ英会話</h1>
	<p class="hero">
		AIと会話だから恥ずかしくない、時間と場所を選ばない。<br
		/>音声認識、音声読み上げで実践的なコミュニケーション
	</p>
	<div class="button-container">
		<a class="start-button" href="/t">Play</a>
	</div>
	<div class="technology">
		<h1>テクノロジー</h1>
		<div>
			<a href="https://blog.cloudflare.com/workers-ai/">Cloudflare Workers AI</a
			>を使って音声認識、AIとの会話生成をしています。
		</div>
		<div />
	</div>
	<div id="faq" class="faq">
		<h1>FAQ</h1>
		<h2>英語の読み上げクオリティがひどい</h2>
		<p>読み上げクオリティはブラウザの音声合成に依存しています。</p>
		<h3>Androidの場合</h3>
		<p>
			作者の経験では、設定→システム→言語と入力→テキスト読み上げの設定から言語を英語に選択、端末を再起動することで英語がスムーズに発話されました。
		</p>
		<p>「音声入力」の項目で英語をダウンロードしたりすることも必要かもしれません。</p>
	</div>
</div>

<style>
	.container {
		margin-left: auto;
		margin-right: auto;
		padding: 32px;
		max-width: 600px;
		/* background: rgb(236, 245, 255); */
	}

	h1 {
		text-align: center;
		font-size: 400%;
		font-family: 'Noto Sans JP', 'Roboto', sans-serif;
	}

	.hero {
		text-align: center;
		font-family: 'Noto Sans JP', 'Roboto', sans-serif;
	}

	span {
		color: #2970ef;
	}

	.button-container {
		text-align: center;
		margin-top: 48px;
	}

	a.start-button {
		padding: 12px 32px;
		text-decoration: none;
		width: 100px;
		color: white;
		background-color: #2970ef;
		border-radius: 12px;
		text-align: center;
		display: inline-block;
	}

	div.technology {
		margin-top: 128px;
	}

	div.faq {
		margin-top: 64px;
		text-align: left;
	}

	div.faq > h1 {
		text-align: center;
	}

	div.ad {
		margin-top: 128px;
		text-align: center;
	}
</style>
