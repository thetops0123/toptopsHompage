<template>
	<!-- 로딩 화면 -->
	<Transition name="loading">
		<div v-if="isLoading" class="loading-screen">
			<div class="loading-content">
				<div class="loading-logo"><span>T</span>HE&nbsp;<span>T</span>OPS</div>
				<div class="loading-spinner">
					<div class="spinner-ring"></div>
					<div class="spinner-ring"></div>
					<div class="spinner-ring"></div>
				</div>
			</div>
		</div>
	</Transition>

	<div class="layout">
		<header class="header" v-if="route.path !== '/admin/administrator'">
			<router-link to="/" class="logo">
				<!--<img :src="logoUrl" alt="The Tops Logo" class="logo" />-->
				<span>T</span>HE&nbsp;<span>T</span>OPS
			</router-link>
			<nav>
				<ul>
					<li><a href="#" @click.prevent="scrollToSection('about')">About</a></li>
					<li><a href="#" @click.prevent="scrollToSection('history')">History</a></li>
					<li><a href="#" @click.prevent="scrollToSection('rental')">Rental</a></li>
					<li><a href="#" @click.prevent="scrollToSection('portfolio')">Portfolio</a></li>
					<li><a href="#" @click.prevent="scrollToSection('contact')">Contact</a></li>
				</ul>
			</nav>
			<div class="navCtas">
				<button class="btn btnPrimary">Photo Booth</button>
			</div>
		</header>

		<router-view></router-view>

		<footer class="footer" v-if="route.path !== '/admin/administrator'">
			<div>© 2026 더탑스. All rights reserved.</div>
		</footer>
	</div>
</template>

<script setup>
import logoUrl from './assets/logo.png';
import { useRouter, useRoute } from 'vue-router';
import { nextTick, onMounted, ref, watch } from 'vue';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);

// 라우트 변경 시 최상단으로 스크롤
watch(
	() => route.path,
	(newPath) => {
		if (newPath === '/') {
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 0);
		}
	},
);

// 페이지 로드 시 최상단으로 스크롤
onMounted(() => {
	// 즉시 스크롤
	window.scrollTo(0, 0);
	// 모든 리소스 로드 대기
	window.addEventListener('load', () => {
		setTimeout(() => {
			isLoading.value = false;
		}, 1000); // 최소 800ms 로딩 화면 유지
	});

	// 만약 이미 로드된 경우
	if (document.readyState === 'complete') {
		setTimeout(() => {
			isLoading.value = false;
		}, 800);
	}
	// 약간의 지연 후 다시 확인
	setTimeout(() => {
		if (route.path === '/') {
			window.scrollTo(0, 0);
		}
	}, 50);

	// Intersection Observer로 스크롤 애니메이션
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-in');
				}
			});
		},
		{ threshold: 0.2 },
	);

	// 모든 h2, h3 요소 관찰
	setTimeout(() => {
		const headings = document.querySelectorAll('.container > h2, .container > h3');
		headings.forEach((heading) => {
			heading.classList.add('fade-up');
			observer.observe(heading);
		});
	}, 100);
});

const scrollToSection = async (sectionId) => {
	// 홈 페이지가 아니면 홈으로 이동
	if (route.path !== '/') {
		await router.push('/');
		await nextTick();
	}

	// 섹션으로 스크롤
	setTimeout(() => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, 100);
};
</script>

<style lang="scss">
@use 'sass:color';

// 색상 정의 - 신뢰감 있는 톤
$primary-blue: #1a3a52;
$secondary-blue: #2c5f8d;
$accent-blue: #4a90e2;
$white-text: #ffffff;
$gray-text: #656565;
$light-gray: #f8f9fa;
$section-bg-1: #0d1b2a;
$section-bg-2: #1b263b;
$section-bg-3: #415a77;
$section-bg-4: #778da9;
$section-bg-5: #e0e1dd;

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	scroll-behavior: smooth;
}

// 섹션 제목 애니메이션
.fade-up {
	opacity: 0;
	transform: translateY(30px);
	transition:
		opacity 0.8s ease-out,
		transform 0.8s ease-out;
}

.fade-up.animate-in {
	opacity: 1;
	transform: translateY(0);
}

.layout {
	width: 100%;
	max-width: 100vw;
	overflow-x: hidden;

	color: $white-text;
}

// 헤더
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 72px;
	background: rgba(7, 20, 20, 0.5);
	backdrop-filter: blur(3px);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 4rem;
	z-index: 1000;
	box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);

	.logo {
		font-family: 'Montserrat', sans-serif;
		font-size: 1.9rem;
		font-weight: normal;
		letter-spacing: normal;
		color: $white-text;
		text-transform: uppercase;
		text-decoration: none;
		color: #e4e4e4;
		cursor: pointer;

		span {
			color: #df5959;
			//font-weight: 800;
		}

		img {
			width: 75%;
		}
	}

	nav {
		margin-left: auto;

		ul {
			display: flex;
			gap: 2.2rem;
			list-style: none;

			li {
				a {
					text-decoration: none;
					color: $white-text;
					font-weight: 400;
					font-size: 0.91rem;
					transition: color 0.3s ease;
					letter-spacing: 0.5px;

					&:hover {
						color: $white-text;
					}
				}
			}
		}
	}

	.navCtas {
		margin-left: 2rem;
	}
}

// 공통 섹션 스타일
.section {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 6rem 0;
	overflow-x: hidden;

	.container {
		max-width: 1120px;
		width: 100%;
		height: 100%;
		margin: 0 auto;
		z-index: 2;
		padding: 2.5rem 0 0 0;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		//margin-bottom: 1rem;
	}

	.btn-view-all {
		background: transparent;
		border: 2px solid rgba(0, 0, 0, 0.3);
		color: #222;
		padding: 0.7rem 1.5rem;
		border-radius: 50px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		letter-spacing: 0.5px;
		text-decoration: none;
		display: inline-block;

		&:hover {
			background: rgba(0, 0, 0, 1);
			color: #fff;
			transform: translateX(5px);
		}
	}

	h2 {
		font-size: 2.3rem;
		font-weight: 700;
		letter-spacing: -1px;
		text-align: left;

		span {
			font-weight: 400;
		}
	}

	h3 {
		font-size: 1.3rem;
		color: $gray-text;
		margin-bottom: 3rem;
		line-height: 1.8;
		text-align: left;
		font-weight: 400;
		letter-spacing: -1px;
	}
}

// Visual 섹션
.section-visual {
	position: relative;
	background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #2c5f8d 100%);
	overflow: hidden;

	.visual-bg {
		position: absolute;
		inset: 0;
		background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="1200" height="800" fill="url(%23grid)"/></svg>');
		opacity: 0.5;
		z-index: 1;
	}

	.visual-content {
		position: relative;
		z-index: 2;
		text-align: center;
		animation: fadeInUp 1s ease;

		h1 {
			font-size: 4rem;
			font-weight: 700;
			margin-bottom: 1.5rem;
			letter-spacing: 2px;
			line-height: 1.2;
		}

		p {
			font-size: 1.3rem;
			color: $gray-text;
			letter-spacing: 2px;
			line-height: 2;
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

// 푸터
.footer {
	background: #000;
	color: $gray-text;
	text-align: center;
	padding: 2.5rem 0;
	font-size: 0.95rem;
	letter-spacing: 1px;
}

/* Buttons */
.btn {
	border: 1px solid rgba(255, 255, 255, 0.18);
	background: rgba(255, 255, 255, 0.04);
	color: var(--text);
	padding: 8px 14px;
	font-size: 0.91em;
	font-family: 'Montserrat', sans-serif;
	border-radius: 2px;
	cursor: pointer;
	transition:
		transform 160ms ease,
		background 160ms ease,
		border-color 160ms ease;
	font-weight: 600;

	&:hover {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.26);
	}
}

.btnPrimary {
	background: linear-gradient(135deg, rgba(236, 53, 53, 0.85), rgba(241, 29, 29, 0.55));
	border-color: rgba(252, 20, 20, 0.35);

	&:hover {
		background: linear-gradient(135deg, rgba(187, 0, 0, 0.92), rgba(205, 0, 0, 0.62));
	}
}

.btnFull {
	width: 100%;
}

// 로딩 화면
.loading-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10000;

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;

		.loading-logo {
			font-family: 'Montserrat', sans-serif;
			font-size: 3rem;
			font-weight: normal;
			letter-spacing: 2px;
			color: #e4e4e4;
			text-transform: uppercase;

			span {
				color: #df5959;
			}
		}

		.loading-spinner {
			position: relative;
			width: 80px;
			height: 80px;

			.spinner-ring {
				position: absolute;
				width: 100%;
				height: 100%;
				border: 3px solid transparent;
				border-top-color: #df5959;
				border-radius: 50%;
				animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;

				&:nth-child(2) {
					border-top-color: rgba(223, 89, 89, 0.6);
					animation-delay: -0.5s;
				}

				&:nth-child(3) {
					border-top-color: rgba(223, 89, 89, 0.3);
					animation-delay: -1s;
				}
			}
		}
	}
}

.loading-enter-active,
.loading-leave-active {
	transition:
		opacity 0.5s ease,
		transform 0.5s ease;
}

.loading-enter-from {
	opacity: 0;
}

.loading-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
