<template>
	<section id="topsvisual" class="section section-topsvisual">
		<div class="visual-bg" aria-hidden="true">
			<video class="visualVideo" autoplay muted loop playsinline preload="auto">
				<source src="@/assets/bg_visual02.mp4" type="video/mp4" />
			</video>
			<div class="visual-bgOverlay"></div>
		</div>
		<div class="container">
			<h2>치열한 고민의 시간들이 현장의 완벽한 순간으로 기록될 때까지</h2>
			<h3>확실한 기획과 끊임없는 토론으로 상상을 현실로 만듭니다.<br />우리는 생각의 힘을 믿는 THETOPS입니다.</h3>
		</div>
	</section>
</template>

<script setup></script>

<style lang="scss" scoped>
.section {
	height: 350px;
	display: flex;
	align-items: center;
	justify-content: center;

	&.section-topsvisual {
		position: relative;
		background: #000;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.visual-bg {
			position: absolute;
			inset: 0;
			z-index: 0;

			.visualVideo {
				width: 100%;
				height: 100%;
				object-fit: cover;
				opacity: 0.7;
			}

			.visual-bgOverlay {
				position: absolute;
				inset: 0;
				background: linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.6));
				pointer-events: none;
			}
		}

		.container {
			h2,
			h3 {
				text-align: center;
				text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
			}
			h2 {
				font-size: 2.5rem !important;
				letter-spacing: -1.5px !important;
				margin-bottom: 1rem !important;
			}

			h3 {
				color: #c7c7c7;
				line-height: normal;
			}
		}

		@media (max-width: 968px) {
			.container {
				h1 {
					font-size: 2.2rem;
					margin-bottom: 1rem;
				}

				h2 {
					font-size: 1.2rem;
				}
			}
		}
	}
}
</style>
