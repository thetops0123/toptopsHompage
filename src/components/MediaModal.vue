<template>
	<Transition name="modal">
		<div v-if="modelValue" class="media-modal" @keydown.esc="close" tabindex="-1">
			<div class="media-modal__backdrop" @click="close"></div>
			<button class="media-modal__close" type="button" @click="close">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white">
					<line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round" />
					<line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
			<div class="media-modal__dialog" :class="{ 'video-mode': isVideo }" role="dialog" aria-modal="true">
				<div class="media-modal__header" v-if="title">
					<h3>{{ title }}</h3>
				</div>
				<div class="media-modal__body">
					<!-- Video Mode -->
					<div v-if="isVideo" class="media-modal__video">
						<video :src="videoUrl" controls autoplay style="max-width: 100%; max-height: 80vh"></video>
					</div>
					<!-- Image Gallery Mode -->
					<template v-else>
						<button class="media-modal__nav media-modal__nav--prev" type="button" @click="prev">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="19"
								height="30"
								viewBox="0 0 10 16"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="8 14 2 8 8 2"></polyline>
							</svg>
						</button>
						<div
							class="media-modal__image"
							@touchstart="handleTouchStart"
							@touchmove="handleTouchMove"
							@touchend="handleTouchEnd"
						>
							<img :src="currentImage" alt="" />
						</div>
						<button class="media-modal__nav media-modal__nav--next" type="button" @click="next">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="19"
								height="30"
								viewBox="0 0 10 16"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="2 14 8 8 2 2"></polyline>
							</svg>
						</button>
					</template>
				</div>
				<div class="media-modal__thumbs" v-if="!isVideo && images.length > 1">
					<div class="thumbs-carousel" :style="{ transform: `translateX(${thumbsOffset}px)` }">
						<button
							v-for="(img, idx) in images"
							:key="`${img}-${idx}`"
							class="media-modal__thumb"
							:class="{ 'is-active': idx === currentIndex }"
							type="button"
							@click="setIndex(idx)"
						>
							<img :src="img" alt="" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
	modelValue: { type: Boolean, default: false },
	images: { type: Array, default: () => [] },
	startIndex: { type: Number, default: 0 },
	title: { type: String, default: '' },
	isVideo: { type: Boolean, default: false },
	videoUrl: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);
const currentIndex = ref(0);

// 터치 스와이프
const touchStartX = ref(0);
const touchEndX = ref(0);

const currentImage = computed(() => props.images[currentIndex.value] || '');

// 썸네일 캐러셀 오프셋
const thumbsOffset = computed(() => {
	const thumbWidth = 90; // 80px + 10px gap
	const visibleThumbs = 4;
	const centerOffset = Math.floor(visibleThumbs / 2);
	let offset = -(currentIndex.value - centerOffset) * thumbWidth;

	// 경계 처리
	const maxOffset = 0;
	const minOffset = -(props.images.length - visibleThumbs) * thumbWidth;
	if (offset > maxOffset) offset = maxOffset;
	if (offset < minOffset) offset = minOffset;

	return offset;
});

const setIndex = (index) => {
	if (index < 0) {
		currentIndex.value = props.images.length - 1;
		return;
	}
	if (index >= props.images.length) {
		currentIndex.value = 0;
		return;
	}
	currentIndex.value = index;
};

const prev = () => setIndex(currentIndex.value - 1);
const next = () => setIndex(currentIndex.value + 1);

const close = () => emit('update:modelValue', false);

const handleKey = (event) => {
	if (!props.modelValue) return;
	if (event.key === 'ArrowLeft') prev();
	if (event.key === 'ArrowRight') next();
	if (event.key === 'Escape') close();
};

// 터치 이벤트 핸들러
const handleTouchStart = (e) => {
	touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
	touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
	const swipeDistance = touchStartX.value - touchEndX.value;
	const minSwipeDistance = 50;

	if (Math.abs(swipeDistance) > minSwipeDistance) {
		if (swipeDistance > 0) {
			// 왼쪽으로 스와이프 -> 다음
			next();
		} else {
			// 오른쪽으로 스와이프 -> 이전
			prev();
		}
	}

	touchStartX.value = 0;
	touchEndX.value = 0;
};

watch(
	() => props.modelValue,
	(isOpen) => {
		if (isOpen) {
			currentIndex.value = Math.min(props.startIndex, props.images.length - 1);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	},
);

watch(
	() => props.startIndex,
	(newIndex) => {
		if (props.modelValue) {
			currentIndex.value = Math.min(newIndex, props.images.length - 1);
		}
	},
);

onMounted(() => {
	window.addEventListener('keydown', handleKey);
});

onUnmounted(() => {
	window.removeEventListener('keydown', handleKey);
	document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
.media-modal {
	position: fixed;
	inset: 0;
	z-index: 2000;
	display: flex;
	align-items: center;
	justify-content: center;

	&__backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
	}

	&__dialog {
		position: relative;
		z-index: 1;
		background: #fff;
		border-radius: 12px;
		max-width: 70%;
		width: 70%;
		padding: 24px;

		&.video-mode {
			background: transparent;
			max-width: none;
			width: auto;
		}

		@media (max-width: 640px) {
			padding: 18px;
		}
	}

	&__close {
		position: fixed;
		top: 24px;
		left: 24px;
		border: none;
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 2001;
		transition: all 0.2s ease;
		padding: 0;
		outline: none;

		&:focus {
			outline: none;
		}

		&:focus-visible {
			outline: 2px solid white;
			outline-offset: 2px;
		}

		&:hover {
			opacity: 0.7;
			transform: scale(1.1);
		}

		svg {
			display: block;
		}
	}

	&__header {
		h3 {
			margin: 0 0 12px;
			font-size: 1.2rem;
			color: #111;
		}
	}

	&__body {
		display: flex;
		//grid-template-columns: 40px 1fr 40px;
		justify-content: space-between;
		align-items: center;
		gap: 0;

		@media (max-width: 640px) {
			grid-template-columns: 32px 1fr 32px;
		}
	}

	&__image {
		width: 100%;
		aspect-ratio: 16 / 9;
		background: #f3f3f3;
		border-radius: 10px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&__nav {
		border: none !important;
		background: transparent;
		color: #333;
		width: 60px;
		height: 60px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		outline: none;

		&:focus {
			outline: none;
		}

		&:focus-visible {
			outline: 2px solid #333;
			outline-offset: 2px;
		}

		&:hover {
			color: #111;
			transform: scale(1.1);
		}

		svg {
			display: block;
		}
	}

	&__thumbs {
		margin-top: 14px;
		overflow: hidden;
		width: 100%;
		display: flex;
		align-self: center;
		justify-content: center;
	}

	.thumbs-carousel {
		display: flex;
		gap: 10px;
		transition: transform 0.3s ease;
	}

	&__thumb {
		border: 2px solid transparent;
		border-radius: 8px;
		background: #f5f5f5;
		padding: 0;
		cursor: pointer;
		overflow: hidden;
		width: 80px;
		height: 50px;
		flex-shrink: 0;
		outline: none;

		&:focus {
			outline: none;
		}

		&:focus-visible {
			outline: 2px solid #333;
			outline-offset: 2px;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		&.is-active {
			border-color: #333;
		}
	}
}

// 모바일 반응형
@media (max-width: 968px) {
	.media-modal {
		&__dialog {
			max-width: 95%;
			width: 95%;
			padding: 16px;
			background: transparent;
			border-radius: 0;
		}

		&__close {
			top: 16px;
			left: 16px;
		}

		&__body {
			gap: 8px;
			justify-content: center;
		}

		&__image {
			border-radius: 8px;
		}

		&__nav {
			width: 40px;
			height: 40px;

			svg {
				width: 14px;
				height: 22px;
			}
		}

		&__thumbs {
			margin-top: 12px;
		}

		&__thumb {
			width: 70px;
			height: 45px;
		}
	}
}

@media (max-width: 640px) {
	.media-modal {
		&__dialog {
			max-width: 100%;
			width: 100%;
			padding: 12px 0;
			background: transparent;
		}

		&__close {
			top: 12px;
			left: 12px;
		}

		&__body {
			gap: 0;
			justify-content: center;
		}

		&__image {
			border-radius: 6px;
			width: calc(100% - 32px);
			margin: 0 10px;
		}

		&__nav {
			display: none;
		}

		&__thumbs {
			padding: 0 12px;
			margin-top: 16px;
		}

		.thumbs-carousel {
			justify-content: center;
		}

		&__thumb {
			width: 60px;
			height: 40px;
		}
	}
}

// Transition 애니메이션
.modal-enter-active {
	transition: opacity 0.3s ease;

	.media-modal__backdrop {
		transition: opacity 0.3s ease;
	}

	.media-modal__dialog {
		transition: all 0.3s ease;
	}
}

.modal-leave-active {
	transition: opacity 0.3s ease;

	.media-modal__backdrop {
		transition: opacity 0.3s ease;
	}

	.media-modal__dialog {
		transition: all 0.3s ease;
	}
}

.modal-enter-from {
	opacity: 0;

	.media-modal__backdrop {
		opacity: 0;
	}

	.media-modal__dialog {
		opacity: 0;
		transform: scale(0.9);
	}
}

.modal-leave-to {
	opacity: 0;

	.media-modal__backdrop {
		opacity: 0;
	}

	.media-modal__dialog {
		opacity: 0;
		transform: scale(0.9);
	}
}
</style>
