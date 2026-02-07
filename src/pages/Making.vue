<template>
	<section id="making" class="section section-making">
		<div class="container">
			<div class="section-header">
				<h2>MAKING - <span>PROCESS ARCHIVE</span></h2>
				<router-link v-if="isHomePage" to="/making" class="btn-view-all">View All</router-link>
			</div>
			<h3>아이디어가 형태를 갖추고 공간이 생명력을 얻는 모든 과정을 가감 없이 기록합니다.</h3>
			<div v-if="loading" class="making-loading">불러오는 중...</div>
			<div v-else-if="error" class="making-error">{{ error }}</div>
			<div v-else class="making-grid">
				<div v-for="item in displayedItems" :key="item.id" class="making-card" @click="openModal(item)">
					<div
						class="making-video"
						@mouseenter="handleVideoHover(item.id, true)"
						@mouseleave="handleVideoHover(item.id, false)"
					>
						<video
							:ref="(el) => setVideoRef(item.id, el)"
							:src="item.main_video_url"
							class="video-thumbnail"
							muted
							loop
							playsinline
						></video>
						<div class="play-icon" :class="{ 'is-playing': playingVideos[item.id] }">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="64"
								height="64"
								viewBox="0 0 24 24"
								fill="white"
							>
								<polygon points="5 3 19 12 5 21 5 3"></polygon>
							</svg>
						</div>
					</div>
					<h3>{{ item.title }}</h3>
				</div>
			</div>
			<div v-if="!isHomePage && hasMore" ref="loadMoreTrigger" class="load-more-trigger">
				<div class="loading-spinner">더 불러오는 중...</div>
			</div>
		</div>
		<MediaModal v-model="isModalOpen" :video-url="modalVideoUrl" :title="modalTitle" :is-video="true" />
	</section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import MediaModal from '@/components/MediaModal.vue';
import { supabase } from '@/lib/supabaseClient';

const route = useRoute();
const isHomePage = computed(() => route.name === 'Home');

const makingItems = ref([]);
const loading = ref(true);
const error = ref('');
const displayLimit = ref(6);
const ITEMS_PER_PAGE = 6;
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const isModalOpen = ref(false);
const modalVideoUrl = ref('');
const modalTitle = ref('');
const loadMoreTrigger = ref(null);
const observer = ref(null);
const videoRefs = ref({});
const playingVideos = ref({});

const setVideoRef = (id, el) => {
	if (el) {
		videoRefs.value[id] = el;
	}
};

const handleVideoHover = (id, isEntering) => {
	const video = videoRefs.value[id];
	if (!video) return;

	if (isEntering) {
		video.play();
		playingVideos.value[id] = true;
	} else {
		video.pause();
		video.currentTime = 0;
		playingVideos.value[id] = false;
	}
};

const displayedItems = computed(() => {
	if (isHomePage.value) {
		// 홈에서는 show_on_home이 true인 항목만 표시 (최대 6개)
		const filtered = makingItems.value.filter((item) => item.show_on_home);
		return filtered.slice(0, 6);
	}
	return makingItems.value.slice(0, displayLimit.value);
});

const hasMore = computed(() => {
	return displayLimit.value < makingItems.value.length;
});

const openModal = (item) => {
	modalVideoUrl.value = item.main_video_url;
	modalTitle.value = item.title;
	isModalOpen.value = true;
};

const loadMore = () => {
	if (hasMore.value) {
		displayLimit.value += ITEMS_PER_PAGE;
	}
};

const fetchMakings = async () => {
	loading.value = true;
	error.value = '';
	try {
		const { data, error: fetchError } = await supabase
			.from('makings')
			.select('id, title, description, main_video_url, thumbnail_url, show_on_home')
			.order('created_at', { ascending: false });

		if (fetchError) {
			error.value = '메이킹 데이터를 불러오지 못했습니다.';
			console.error(fetchError);
		} else {
			makingItems.value = data || [];
			// Making 페이지에서는 처음에 6개만 로드
			if (!isHomePage.value) {
				displayLimit.value = Math.min(ITEMS_PER_PAGE, makingItems.value.length);
			}
		}
	} catch (err) {
		console.error('Making fetch error:', err);
		error.value = 'Supabase 연결에 실패했습니다. 환경 변수를 확인하세요.';
		makingItems.value = [];
	}
	loading.value = false;
};

onMounted(async () => {
	await fetchMakings();

	// 윈도우 리사이즈 이벤트
	const handleResize = () => {
		windowWidth.value = window.innerWidth;
		windowHeight.value = window.innerHeight;
	};
	window.addEventListener('resize', handleResize);

	// Making 페이지에서만 Intersection Observer 설정
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
	//height: initial;

	.container {
		position: relative;
		.btn-view-all {
			position: absolute;
			right: 0;
		}
	}
}

.section-making {
	padding: 100px 0;
	background: #000;
	color: $white-text;
	min-height: calc(100vh - 50px);

	h2 {
		//font-size: 3rem;
		//font-weight: 700;
		//margin-bottom: 8px;
		//margin-top: 0;
		//text-align: center;

		//span {
		//	color: $gray-text;
		//}
	}

	h3 {
		//text-align: center;
		//font-size: 1.2rem;
		//font-weight: 400;
		//color: $gray-text;
		margin-bottom: 80px;
		//margin-top: 0;
	}
}

.section-header {
	//display: flex;
	//align-items: center;
	//justify-content: center;
	//gap: 30px;
	//margin-bottom: 8px;
}

.btn-view-all {
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.3);
	color: $white-text;

	&:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateY(-2px);
	}
}

.making-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 40px;
	max-width: 1200px;
	margin: 0 auto;
}

.making-card {
	cursor: pointer;
	transition: transform 0.3s ease;
	border-radius: 12px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.03);

	&:hover {
		transform: translateY(-8px);

		.making-video img {
			transform: scale(1.05);
		}

		.play-icon {
			transform: scale(1.1);
		}
	}

	.making-video {
		position: relative;
		width: 100%;
		padding-top: 56.25%; /* 16:9 비율 */
		background: #111;
		overflow: hidden;

		.video-thumbnail {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.5s ease;
		}

		.play-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: 0.9;
			transition: all 0.3s ease;
			pointer-events: none;
			filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));

			&.is-playing {
				opacity: 0;
			}
		}
	}

	h3 {
		font-size: 1.3rem;
		margin: 20px 20px 10px;
		text-align: left;
		color: $white-text;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	p {
		font-size: 0.95rem;
		color: $gray-text;
		margin: 0 20px 20px;
		line-height: 1.6;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
}

.making-loading,
.making-error {
	text-align: center;
	padding: 60px 20px;
	font-size: 1rem;
	color: $gray-text;
}

.load-more-trigger {
	margin-top: 60px;
	text-align: center;
	padding: 40px 0;

	.loading-spinner {
		font-size: 1rem;
		color: $gray-text;
		animation: pulse 1.5s ease-in-out infinite;
	}
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

// 태블릿 (768px ~ 1024px)
@media (max-width: 1024px) and (min-width: 768px) {
	.section-making {
		padding: 80px 0;

		h2 {
			font-size: 2.5rem;
		}

		h3 {
			font-size: 1.1rem;
			margin-bottom: 50px;
		}
	}

	.making-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 30px;
	}

	.making-card {
		h3 {
			font-size: 1.2rem;
		}

		p {
			font-size: 0.9rem;
		}
	}
}

// 모바일
@media (max-width: 767px) {
	.section-making {
		padding: 60px 0;

		h2 {
			font-size: 1.8rem;
		}

		h3 {
			font-size: 1rem;
			margin-bottom: 40px;
			padding: 0 20px;
		}
	}

	.section-header {
		flex-direction: column;
		gap: 15px;
	}

	.btn-view-all {
		padding: 8px 20px;
		font-size: 0.9rem;
	}

	.making-grid {
		grid-template-columns: 1fr;
		gap: 30px;
		padding: 0 20px;
	}

	.making-card {
		.play-icon svg {
			width: 48px;
			height: 48px;
		}

		h3 {
			font-size: 1.1rem;
			margin: 15px 15px 8px;
		}

		p {
			font-size: 0.85rem;
			margin: 0 15px 15px;
		}
	}
}
</style>
