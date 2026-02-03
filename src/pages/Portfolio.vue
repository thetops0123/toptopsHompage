<template>
	<section id="portfolio" class="section section-portfolio">
		<div class="container">
			<div class="section-header">
				<h2>PORTFOLIO - <span>EXPERIENCES</span></h2>
				<router-link v-if="isHomePage" to="/portfolio" class="btn-view-all">View All</router-link>
			</div>
			<h3>진행한 행사 사례를 소개합니다.</h3>
			<div v-if="loading" class="portfolio-loading">불러오는 중...</div>
			<div v-else-if="error" class="portfolio-error">{{ error }}</div>
			<div v-else class="portfolio-grid">
				<div v-for="item in displayedItems" :key="item.id" class="portfolio-card" @click="openModal(item)">
					<div class="portfolio-image">
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

const portfolios = ref([]);
const loading = ref(true);
const error = ref('');
const displayLimit = ref(3);
const ITEMS_PER_PAGE = 6;

const isModalOpen = ref(false);
const modalImages = ref([]);
const modalTitle = ref('');
const modalStartIndex = ref(0);
const loadMoreTrigger = ref(null);
const observer = ref(null);

const displayedItems = computed(() => {
	if (isHomePage.value) {
		// 홈에서는 show_on_home이 true인 항목만 표시
		return portfolios.value.filter((item) => item.show_on_home);
	}
	return portfolios.value.slice(0, displayLimit.value);
});

const hasMore = computed(() => {
	return displayLimit.value < portfolios.value.length;
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

const fetchPortfolios = async () => {
	loading.value = true;
	error.value = '';
	try {
		const { data, error: fetchError } = await supabase
			.from('portfolios')
			.select('id, title, description, main_image_url, sub_image_urls, show_on_home')
			.order('created_at', { ascending: false });

		if (fetchError) {
			error.value = '포트폴리오 데이터를 불러오지 못했습니다.';
			console.error(fetchError);
		} else {
			portfolios.value = data || [];
			// Portfolio 페이지에서는 처음에 6개만 로드
			if (!isHomePage.value) {
				displayLimit.value = Math.min(ITEMS_PER_PAGE, portfolios.value.length);
			}
		}
	} catch (err) {
		console.error('Portfolio fetch error:', err);
		error.value = 'Supabase 연결에 실패했습니다. 환경 변수를 확인하세요.';
		portfolios.value = [];
	}
	loading.value = false;
};

onMounted(async () => {
	await fetchPortfolios();

	// Portfolio 페이지에서만 Intersection Observer 설정
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
	if (observer.value) {
		observer.value.disconnect();
	}
});
</script>

<style lang="scss" scoped>
$gray-text: #b0b0b0;

.section-portfolio {
	background: #e0e1dd;
	color: #333;
	min-height: 100vh;

	h2 {
		color: #333;
	}

	h3 {
		color: #666;
	}

	.portfolio-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 3rem;

		.portfolio-card {
			background: #ffffff;
			border: 1px solid #e0e0e0;
			border-radius: 8px;
			overflow: hidden;
			transition: all 0.3s ease;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
			cursor: pointer;

			&:hover {
				transform: translateY(-10px);
				box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
			}

			.portfolio-image {
				width: 100%;
				height: 220px;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			h3 {
				font-size: 1.2rem;
				margin: 1.5rem 1.5rem 0.8rem 1.5rem;
				font-weight: 600;
				color: #333;
			}

			p {
				color: #666;
				font-size: 1rem;
				line-height: 1.6;
				margin: 0 1.5rem 1.5rem 1.5rem;
			}
		}
	}
}

.portfolio-loading,
.portfolio-error {
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
</style>
