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
			<div class="media-modal__dialog" role="dialog" aria-modal="true">
				<div class="media-modal__header" v-if="title">
					<h3>{{ title }}</h3>
				</div>
				<div class="media-modal__body">
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
					<div class="media-modal__image">
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
				</div>
				<div class="media-modal__thumbs" v-if="images.length > 1">
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
	</Transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
	modelValue: { type: Boolean, default: false },
	images: { type: Array, default: () => [] },
	startIndex: { type: Number, default: 0 },
	title: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);
const currentIndex = ref(0);

const currentImage = computed(() => props.images[currentIndex.value] || '');

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
		border: none;
		background: transparent;
		color: #333;
		width: 60px;
		height: 60px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;

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
		display: flex;
		gap: 10px;
		justify-content: center;
		flex-wrap: wrap;
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

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		&.is-active {
			border-color: #111;
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
