<template>
	<section id="rental" class="section section-rental">
		<div class="container">
			<div class="section-header">
				<h2>RENTAL - <span>RESOURCE SUPPLY</span></h2>
				<router-link v-if="isHomePage" to="/rental" class="btn-view-all">View All</router-link>
			</div>
			<h3>행사의 규모와 성격에 최적화된 하드웨어 셋업부터 실시간 운영까지 완벽히 케어합니다</h3>
			<div v-if="loading" class="rental-loading">불러오는 중...</div>
			<div v-else-if="error" class="rental-error">{{ error }}</div>
			<div v-else class="rental-grid">
				<div v-for="item in displayedItems" :key="item.id" class="rental-card" @click="openModal(item)">
					<div class="rental-image">
						<img v-if="item.main_image_url" :src="item.main_image_url" :alt="item.title" />
					</div>
					<h3>{{ item.title }}</h3>
					<p>{{ item.description }}</p>
				</div>
			</div>
			<div v-if="!isHomePage && hasMore" ref="loadMoreTrigger" class="load-more-trigger">
				<div class="loading-spinner">더 불러오는 중...</div>
			</div>
		</div>
		<MediaModal v-model="isModalOpen" :images="modalImages" :start-index="modalStartIndex" :title="modalTitle" />
	</section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import MediaModal from '@/components/MediaModal.vue';
import { supabase } from '@/lib/supabaseClient';

const route = useRoute();
const isHomePage = computed(() => route.name === 'Home');

const rentalItems = ref([]);
const loading = ref(true);
const error = ref('');
const displayLimit = ref(3);
const ITEMS_PER_PAGE = 6;
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const isModalOpen = ref(false);
const modalImages = ref([]);
const modalTitle = ref('');
const modalStartIndex = ref(0);
const loadMoreTrigger = ref(null);
const observer = ref(null);

const displayedItems = computed(() => {
	if (isHomePage.value) {
		// 홈에서는 show_on_home이 true인 항목만 표시
		const filtered = rentalItems.value.filter((item) => item.show_on_home);
		// 태블릿 범위 (768-1024px)
		if (windowWidth.value >= 768 && windowWidth.value <= 1024) {
			// landscape 모드 (가로): 3개 표시
			if (windowWidth.value > windowHeight.value) {
				return filtered;
			}
			// portrait 모드 (세로): 2개 표시
			return filtered.slice(0, 2);
		}
		return filtered;
	}
	return rentalItems.value.slice(0, displayLimit.value);
});

const hasMore = computed(() => {
	return displayLimit.value < rentalItems.value.length;
});

const openModal = (item, startIndex = 0) => {
	const images = [item.main_image_url, ...(item.sub_image_urls || [])].filter(Boolean);
	modalImages.value = images;
	modalTitle.value = item.title;
	modalStartIndex.value = startIndex;
	isModalOpen.value = true;
};

const loadMore = () => {
	if (hasMore.value) {
		displayLimit.value += ITEMS_PER_PAGE;
	}
};

const fetchRentals = async () => {
	loading.value = true;
	error.value = '';
	try {
		const { data, error: fetchError } = await supabase
			.from('rentals')
			.select('id, title, description, main_image_url, sub_image_urls, show_on_home')
			.order('created_at', { ascending: false });

		if (fetchError) {
			error.value = '렌탈 데이터를 불러오지 못했습니다.';
			console.error(fetchError);
		} else {
			rentalItems.value = data || [];
			// Rental 페이지에서는 처음에 6개만 로드
			if (!isHomePage.value) {
				displayLimit.value = Math.min(ITEMS_PER_PAGE, rentalItems.value.length);
			}
		}
	} catch (err) {
		console.error('Rental fetch error:', err);
		error.value = 'Supabase 연결에 실패했습니다. 환경 변수를 확인하세요.';
		rentalItems.value = [];
	}
	loading.value = false;
};

onMounted(async () => {
	await fetchRentals();

	// 윈도우 리사이즈 이벤트
	const handleResize = () => {
		windowWidth.value = window.innerWidth;
		windowHeight.value = window.innerHeight;
	};
	window.addEventListener('resize', handleResize);

	// Rental 페이지에서만 Intersection Observer 설정
	if (!isHomePage.value && loadMoreTrigger.value) {
		observer.value = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore.value && !loading.value) {
					loadMore();
				}
			},
			{ threshold: 0.1 },
		);

		observer.value.observe(loadMoreTrigger.value);
	}
});

onUnmounted(() => {
	window.removeEventListener('resize', () => {});
	if (observer.value) {
		observer.value.disconnect();
	}
});
</script>

<style lang="scss" scoped>
$gray-text: #b0b0b0;
$white-text: #ffffff;

.section {
	background: $white-text;
	height: initial;
	h2 {
		color: #0f0f0f;
	}

	h3 {
		color: #999;
	}
}

.section-rental {
	.rental-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2.5rem;

		.rental-card {
			background: #212121;
			border: 1px solid rgba(0, 0, 0, 1);
			padding: 2rem;
			border-radius: 8px;
			transition: all 0.3s ease;
			cursor: pointer;

			&:hover {
				background: #000;
				transform: translateY(-8px);
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
			}

			.rental-image {
				width: 100%;
				height: 180px;
				background: rgba(0, 0, 0, 0.1);
				border-radius: 6px;
				margin-bottom: 1.5rem;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			h3 {
				font-size: 1.1rem;
				margin-bottom: 0.8rem;
				font-weight: 600;
				color: $white-text;
			}

			p {
				color: #dbdbdb;
				font-size: 1rem;
				line-height: 1.6;
				margin: 0;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
}

.rental-loading,
.rental-error {
	color: #666;
	padding: 1.5rem 0;
}

.load-more-trigger {
	display: flex;
	justify-content: center;
	padding: 2rem 0;
	min-height: 60px;
}

.loading-spinner {
	color: #999;
	font-size: 0.95rem;
	animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 0.5;
	}
	50% {
		opacity: 1;
	}
}

// 모바일 반응형
@media (max-width: 968px) {
	.section-rental {
		.rental-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}

		.rental-card {
			h3 {
				font-size: 1.1rem;
			}

			p {
				font-size: 0.9rem;
			}
		}
	}
}

@media (max-width: 640px) {
	.section-rental {
		.rental-grid {
			grid-template-columns: 1fr;
			gap: 1.2rem;
		}

		.rental-card {
			h3 {
				font-size: 1rem;
			}

			p {
				font-size: 0.85rem;
			}
		}
	}
}
</style>
