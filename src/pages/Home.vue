<template>
	<!-- Visual 섹션 -->
	<section id="visual" class="section section-visual">
		<div class="visual-bg" aria-hidden="true">
			<video class="visualVideo" autoplay muted loop playsinline preload="auto">
				<source src="@/assets/bg_visual.mp4" type="video/mp4" />
			</video>
			<div class="visual-bgOverlay"></div>
		</div>
		<div class="container">
			<h1>
				가장 까다로운 클라이언트가<br /><span>더탑스</span>를 다시 찾는 이유, 완벽
				<span>그 이상의 결과물</span>입니다
			</h1>
			<p>"수많은 성공 기록이 말해주는 더탑스의 독보적인 실력."</p>
		</div>

		<!-- 협력사 로고 스와이프 -->
		<div class="brand-slider" v-if="brands.length > 0">
			<div class="brand-track" :style="{ transform: `translateX(calc(50% - 380px - ${displayIndex * 240}px))` }">
				<div
					v-for="(brand, index) in clonedBrands"
					:key="index"
					class="brand-item"
					:class="{ 'is-center': index === displayIndex }"
				>
					<div class="brand-logo">
						<img :src="brand.logo_url" :alt="brand.name" />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- About 섹션 -->
	<About />

	<!-- History 섹션 -->
	<History />

	<!-- Topsvisual 섹션 -->
	<Topsvisual />

	<!-- Rental 섹션 -->
	<Rental />

	<!-- Portfolio 섹션 -->
	<Portfolio />

	<!-- Contact 섹션 -->
	<Contact />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import About from './About.vue';
import History from './History.vue';
import Rental from './Rental.vue';
import Topsvisual from './Topsvisual.vue';
import Portfolio from './Portfolio.vue';
import Contact from './Contact.vue';
import { supabase } from '@/lib/supabaseClient';

const currentIndex = ref(0);
const brands = ref([]);
let intervalId = null;

// Supabase에서 제휴처 데이터 가져오기
const fetchPartners = async () => {
	try {
		const { data, error } = await supabase
			.from('partners')
			.select('id, name, logo_url, display_order')
			.order('display_order', { ascending: true });

		if (error) throw error;
		brands.value = data || [];
	} catch (err) {
		console.error('Partners fetch error:', err);
		brands.value = [];
	}
};

// 무한 루프를 위한 clone 배열 (3번 복제)
const clonedBrands = computed(() => {
	if (brands.value.length === 0) return [];
	return [...brands.value, ...brands.value, ...brands.value];
});

const displayIndex = computed(() => currentIndex.value + brands.value.length);

onMounted(async () => {
	await fetchPartners();

	// 2초마다 한 칸씩 이동
	if (brands.value.length > 0) {
		intervalId = setInterval(() => {
			currentIndex.value = (currentIndex.value + 1) % brands.value.length;
		}, 2000);
	}
});

onUnmounted(() => {
	if (intervalId) {
		clearInterval(intervalId);
	}
});
</script>

<style lang="scss" scoped>
@use 'sass:color';

// 색상 정의 - 신뢰감 있는 톤
$primary-blue: #1a3a52;
$secondary-blue: #2c5f8d;
$accent-blue: #4a90e2;
$white-text: #ffffff;
$gray-text: #b0b0b0;
$light-gray: #f8f9fa;

// Visual 섹션
.section-visual {
	position: relative;
	background: #000;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;

	.visual-bg {
		position: absolute;
		inset: 0;
		z-index: 0;

		.visualVideo {
			width: 100%;
			height: 100%;
			object-fit: cover;
			opacity: 0.8;
			//transform: scale(1.02);
		}

		.visual-bgOverlay {
			position: absolute;
			inset: 0;
			background:
				radial-gradient(900px 600px at 25% 20%, rgba(0, 255, 255, 0.12), transparent 60%),
				radial-gradient(900px 700px at 85% 25%, rgba(255, 0, 0, 0.08), transparent 62%),
				linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0.65));
			pointer-events: none;
		}
	}

	.container {
		max-width: 90%;
		height: calc(100vh - 72px);
		position: relative;
		z-index: 2;

		animation: fadeInUp 1s ease;

		h1 {
			font-size: 2.8rem;
			font-weight: 500;
			margin: 10rem 0 0 0;
			letter-spacing: -1px;
			line-height: 1.4;
			color: $white-text;
			text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5); /* 가로, 세로, 번짐정도, 색상 */

			span {
				font-weight: 600;
				color: #ff2f2f;
			}
		}

		p {
			font-size: 1.5rem;
			color: $gray-text;
			letter-spacing: 1px;
			line-height: 2;
			text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5); /* 가로, 세로, 번짐정도, 색상 */
		}
	}

	// 협력사 로고 슬라이더
	.brand-slider {
		pointer-events: none;
		position: absolute;
		bottom: 6rem;
		left: 0;
		right: 0;
		width: 100%;
		height: 200px;
		overflow: visible;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.9;
	}

	.brand-track {
		display: flex;
		gap: 10px;
		width: max-content;
		transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.brand-item {
		flex-shrink: 0;
		width: 200px;
		height: 200px;
		background: rgba(255, 255, 255, 1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 1;
		transform: scale(0.9);

		//&:hover {
		//	background: rgba(255, 255, 255, 0.15);
		//}

		.brand-logo {
			//font-size: 1rem;
			//font-weight: 600;
			//color: rgba(255, 255, 255, 0.9);
			//text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				width: 90%;
				opacity: 0.9;
			}
		}
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
