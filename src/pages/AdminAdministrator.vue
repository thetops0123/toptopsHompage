<template>
	<section class="section section-admin">
		<div class="admin-layout">
			<aside class="admin-sidebar">
				<div class="sidebar-top">
					<div class="admin-logo">
						<img
							src="@/assets/logo_black_main.png"
							alt="the tops logo"
							style="width: 93%; margin-top: 10px"
						/>
					</div>
					<nav class="admin-nav" v-if="isAuthed">
						<button
							class="admin-nav-item"
							:class="{ 'is-active': activeTab === 'making' }"
							type="button"
							@click="selectTab('making')"
						>
							메이킹 관리
						</button>
						<button
							class="admin-nav-item"
							:class="{ 'is-active': activeTab === 'rental' }"
							type="button"
							@click="selectTab('rental')"
						>
							렌탈 관리
						</button>

						<button
							class="admin-nav-item"
							:class="{ 'is-active': activeTab === 'portfolio' }"
							type="button"
							@click="selectTab('portfolio')"
						>
							포트폴리오 관리
						</button>
						<button
							class="admin-nav-item"
							:class="{ 'is-active': activeTab === 'partner' }"
							type="button"
							@click="selectTab('partner')"
						>
							제휴처 관리
						</button>
					</nav>
				</div>
				<div class="admin-logout" v-if="isAuthed">
					<button class="logout-btn" type="button" @click="logout">
						로그아웃
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
							<polyline points="16 17 21 12 16 7"></polyline>
							<line x1="21" y1="12" x2="9" y2="12"></line>
						</svg>
					</button>
				</div>
			</aside>

			<main class="admin-content">
				<section v-if="!isAuthed" class="admin-login">
					<div class="admin-card">
						<h2>로그인</h2>
						<form @submit.prevent="handleLogin" class="admin-form">
							<div class="form-row">
								<label>아이디</label>
								<input v-model="loginForm.id" type="text" required />
							</div>
							<div class="form-row">
								<label>비밀번호</label>
								<input v-model="loginForm.password" type="password" required />
							</div>
							<button class="btn-primary" type="submit">로그인</button>
							<p class="form-error" v-if="loginError">{{ loginError }}</p>
						</form>
					</div>
				</section>

				<section v-else class="admin-panel">
					<div class="admin-panel-header">
						<h2>{{ activeTabLabel }}</h2>
						<button class="btn-primary btn-add-desktop" type="button" @click="resetForm">신규 등록</button>
						<button class="btn-primary btn-add-mobile" type="button" @click="openMobileForm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
							>
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							신규 등록
						</button>
					</div>

					<!-- 모바일 카드 리스트 -->
					<div class="mobile-card-list">
						<div v-if="loading" class="loading-card">불러오는 중...</div>
						<div v-else-if="error" class="error-card">{{ error }}</div>
						<div v-else-if="items.length === 0" class="empty-card">등록된 항목이 없습니다</div>
						<div
							v-else
							class="card-item"
							v-for="item in items"
							:key="item.id"
							@click="editMobileItem(item)"
						>
							<div class="card-image">
								<video
									v-if="isMakingTab"
									:src="item.main_video_url"
									muted
									loop
									playsinline
									@click.stop
								></video>
								<img v-else :src="isPartnerTab ? item.logo_url : item.main_image_url" alt="" />
								<span
									v-if="
										(activeTab === 'rental' ||
											activeTab === 'portfolio' ||
											activeTab === 'making') &&
										item.show_on_home
									"
									class="card-badge"
									>메인 표시</span
								>
							</div>
							<div class="card-content">
								<h4 class="card-title">{{ isPartnerTab ? item.name : item.title }}</h4>
								<p class="card-desc" v-if="!isPartnerTab">{{ item.description }}</p>
								<p class="card-order" v-if="isPartnerTab">표시순서: {{ item.display_order }}</p>
								<div class="card-actions">
									<button class="btn-card-edit" type="button" @click.stop="editMobileItem(item)">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
										</svg>
										수정
									</button>
									<button class="btn-card-delete" type="button" @click.stop="deleteItem(item)">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<polyline points="3 6 5 6 21 6"></polyline>
											<path
												d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
											></path>
										</svg>
										삭제
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- 데스크톱 테이블 -->
					<div class="admin-grid">
						<div class="admin-list">
							<table>
								<thead>
									<tr v-if="!isPartnerTab">
										<th>썸네일</th>
										<th>제목</th>
										<th>설명</th>
										<th
											v-if="
												activeTab === 'rental' ||
												activeTab === 'making' ||
												activeTab === 'portfolio'
											"
										>
											메인표시
										</th>
										<th>관리</th>
									</tr>
									<tr v-else>
										<th>로고</th>
										<th>제휴처명</th>
										<th>순서</th>
										<th>관리</th>
									</tr>
								</thead>
								<tbody>
									<tr v-if="loading">
										<td :colspan="isPartnerTab ? 4 : 4">불러오는 중...</td>
									</tr>
									<tr v-else-if="error">
										<td :colspan="isPartnerTab ? 4 : 4">{{ error }}</td>
									</tr>
									<tr v-for="item in items" :key="item.id">
										<td>
											<video
												v-if="isMakingTab"
												class="thumb"
												:src="item.main_video_url"
												muted
												loop
												playsinline
												@mouseenter="(e) => e.target.play()"
												@mouseleave="
													(e) => {
														e.target.pause();
														e.target.currentTime = 0;
													}
												"
											></video>
											<img
												v-else
												class="thumb"
												:src="isPartnerTab ? item.logo_url : item.main_image_url"
												alt=""
											/>
										</td>
										<td>{{ isPartnerTab ? item.name : item.title }}</td>
										<td v-if="!isPartnerTab" class="desc">{{ item.description }}</td>
										<td v-else>{{ item.display_order }}</td>
										<td
											v-if="
												activeTab === 'rental' ||
												activeTab === 'making' ||
												activeTab === 'portfolio'
											"
										>
											<span
												class="badge"
												:class="item.show_on_home ? 'badge-active' : 'badge-inactive'"
											>
												{{ item.show_on_home ? '표시' : '비표시' }}
											</span>
										</td>
										<td>
											<button class="btn-small" type="button" @click="editItem(item)">
												수정
											</button>
											<button
												class="btn-small btn-danger"
												type="button"
												@click="deleteItem(item)"
											>
												삭제
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div class="admin-form-wrap">
							<h3>{{ form.id ? '수정' : '신규 등록' }}</h3>

							<!-- 제휴처 폼 -->
							<form v-if="isPartnerTab" @submit.prevent="handleSubmit" class="admin-form">
								<div class="form-row">
									<label>제휴처명</label>
									<input v-model="form.title" type="text" required />
								</div>
								<div class="form-row">
									<label>로고 이미지</label>
									<input
										:key="'main-' + fileInputKey"
										type="file"
										accept="image/*"
										@change="onMainFileChange"
									/>
									<div class="preview" v-if="form.mainImageUrl">
										<img :src="form.mainImageUrl" alt="" />
									</div>
								</div>
								<div class="form-row">
									<label>표시 순서</label>
									<input v-model.number="form.displayOrder" type="number" min="1" required />
								</div>
								<button class="btn-primary" type="submit" :disabled="saving">
									{{ saving ? '저장 중...' : form.id ? '수정' : '등록' }}
								</button>
								<p class="form-error" v-if="formError">{{ formError }}</p>
							</form>

							<!-- 렌탈/포트폴리오 폼 -->
							<form v-else @submit.prevent="handleSubmit" class="admin-form">
								<div class="form-row">
									<label>제목</label>
									<input
										v-model="form.title"
										type="text"
										required
										style="
											height: 40px;
											padding: 0 10px;
											background: #000;
											border-radius: 6px;
											border: none;
											color: #fff;
										"
										placeholder="제목을 입력하세요"
									/>
								</div>
								<div class="form-row" v-if="!isMakingTab">
									<label>
										설명
										<span class="char-count">{{ form.description.length }}/60자</span>
									</label>
									<textarea
										placeholder="최대 60자까지 가능합니다."
										v-model="form.description"
										rows="4"
										maxlength="60"
										required
									></textarea>
									<small class="hint">카드에 3줄로 표시됩니다 (최대 60자)</small>
								</div>

								<div
									class="form-row"
									v-if="activeTab === 'rental' || activeTab === 'portfolio' || activeTab === 'making'"
								>
									<label class="checkbox-label">
										<input v-model="form.showOnHome" type="checkbox" />
										<span>메인 화면에 표시</span>
									</label>
								</div>

								<!-- Making 탭: 비디오 및 썸네일 -->
								<template v-if="isMakingTab">
									<div class="form-row">
										<label>비디오 파일 (MP4)</label>
										<input
											:key="'video-' + fileInputKey"
											type="file"
											accept="video/mp4"
											@change="onVideoFileChange"
										/>
										<div class="preview" v-if="form.mainVideoUrl">
											<video
												:src="form.mainVideoUrl"
												controls
												style="max-width: 100%; max-height: 200px"
											></video>
										</div>
									</div>
								</template>

								<!-- Rental/Portfolio 탭: 이미지들 -->
								<template v-else>
									<div class="form-row">
										<label>메인 이미지</label>
										<input
											:key="'main-' + fileInputKey"
											type="file"
											accept="image/*"
											@change="onMainFileChange"
										/>
										<div class="preview" v-if="form.mainImageUrl">
											<img :src="form.mainImageUrl" alt="" />
										</div>
									</div>

									<div class="form-row">
										<label>서브 이미지 (3장)</label>
										<div class="sub-image-grid">
											<div v-for="(url, idx) in form.subImageUrls" :key="idx" class="sub-item">
												<input
													:key="'sub-' + idx + '-' + fileInputKey"
													type="file"
													accept="image/*"
													@change="(e) => onSubFileChange(e, idx)"
												/>
												<div class="preview" v-if="url">
													<img :src="url" alt="" />
												</div>
											</div>
										</div>
									</div>
								</template>

								<button class="btn-primary" type="submit" :disabled="saving">
									{{ saving ? '저장 중...' : form.id ? '수정하기' : '등록하기' }}
								</button>
								<p class="form-error" v-if="formError">{{ formError }}</p>
							</form>
						</div>
					</div>
				</section>

				<!-- 모바일 폼 모달 -->
				<div class="mobile-form-modal" v-if="showMobileForm" @click="closeMobileForm">
					<div class="modal-content" @click.stop>
						<div class="modal-header">
							<h3>{{ form.id ? '수정하기' : '신규 등록' }}</h3>
							<button class="modal-close" type="button" @click="closeMobileForm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						</div>
						<div class="modal-body">
							<!-- 제휴처 폼 -->
							<form v-if="isPartnerTab" @submit.prevent="handleSubmit" class="mobile-form">
								<div class="form-row">
									<label>제휴처명</label>
									<input v-model="form.title" type="text" required />
								</div>
								<div class="form-row">
									<label>로고 이미지</label>
									<input
										:key="'main-' + fileInputKey"
										type="file"
										accept="image/*"
										@change="onMainFileChange"
									/>
									<div class="preview" v-if="form.mainImageUrl">
										<img :src="form.mainImageUrl" alt="" />
									</div>
								</div>
								<div class="form-row">
									<label>표시 순서</label>
									<input v-model.number="form.displayOrder" type="number" min="1" required />
								</div>
								<button class="btn-primary" type="submit" :disabled="saving">
									{{ saving ? '저장 중...' : form.id ? '수정' : '등록' }}
								</button>
							</form>

							<!-- 렌탈/포트폴리오 폼 -->
							<form v-else @submit.prevent="handleSubmit" class="mobile-form">
								<div class="form-row">
									<label>제목</label>
									<input v-model="form.title" type="text" required placeholder="제목을 입력하세요" />
								</div>
								<div class="form-row" v-if="!isMakingTab">
									<label>
										설명
										<span class="char-count">{{ form.description.length }}/60자</span>
									</label>
									<textarea
										placeholder="최대 60자까지 가능합니다."
										v-model="form.description"
										rows="4"
										maxlength="60"
										required
									></textarea>
								</div>

								<div
									class="form-row"
									v-if="activeTab === 'rental' || activeTab === 'portfolio' || activeTab === 'making'"
								>
									<label class="checkbox-label">
										<input v-model="form.showOnHome" type="checkbox" />
										<span>메인 화면에 표시</span>
									</label>
								</div>

								<!-- Making 탭: 비디오 및 썸네일 -->
								<template v-if="isMakingTab">
									<div class="form-row">
										<label>비디오 파일 (MP4)</label>
										<input
											:key="'video-' + fileInputKey"
											type="file"
											accept="video/mp4"
											@change="onVideoFileChange"
										/>
										<div class="preview" v-if="form.mainVideoUrl">
											<video
												:src="form.mainVideoUrl"
												controls
												style="max-width: 100%; max-height: 200px"
											></video>
										</div>
									</div>
								</template>

								<!-- Rental/Portfolio 탭: 이미지들 -->
								<template v-else>
									<div class="form-row">
										<label>메인 이미지</label>
										<input
											:key="'main-' + fileInputKey"
											type="file"
											accept="image/*"
											@change="onMainFileChange"
										/>
										<div class="preview" v-if="form.mainImageUrl">
											<img :src="form.mainImageUrl" alt="" />
										</div>
									</div>

									<div class="form-row">
										<label>서브 이미지 (3장)</label>
										<div class="sub-image-grid">
											<div v-for="(url, idx) in form.subImageUrls" :key="idx" class="sub-item">
												<input
													:key="'sub-' + idx + '-' + fileInputKey"
													type="file"
													accept="image/*"
													@change="(e) => onSubFileChange(e, idx)"
												/>
												<div class="preview" v-if="url">
													<img :src="url" alt="" />
												</div>
											</div>
										</div>
									</div>
								</template>

								<button class="btn-primary" type="submit" :disabled="saving">
									{{ saving ? '저장 중...' : form.id ? '수정하기' : '등록하기' }}
								</button>
							</form>
						</div>
					</div>
				</div>
			</main>
		</div>

		<!-- 저장 중 로딩 오버레이 -->
		<div v-if="saving" class="loading-overlay">
			<div class="loading-content">
				<div class="loading-spinner-ring"></div>
				<p class="loading-text">저장 중입니다...</p>
				<div class="progress-bar">
					<div class="progress-bar-fill"></div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { uploadToCloudinary } from '@/lib/cloudinary';

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = '@@1234thetops!';
const SESSION_KEY = 'thetops_admin_session_id';
const SESSION_CHECK_INTERVAL = 10000; // 10초마다 세션 체크

// 현재 세션 ID 생성
const currentSessionId = ref(Date.now() + '-' + Math.random().toString(36).substr(2, 9));
const currentIp = ref('');
const currentUserAgent = ref(navigator.userAgent);

const isAuthed = ref(false);
const loginForm = reactive({ id: '', password: '' });
const loginError = ref('');
const sessionCheckTimer = ref(null);

const activeTab = ref('rental');
const items = ref([]);
const loading = ref(false);
const error = ref('');

const saving = ref(false);
const formError = ref('');
const fileInputKey = ref(0);
const showMobileForm = ref(false);

const form = reactive({
	id: null,
	title: '',
	description: '',
	mainImageUrl: '',
	subImageUrls: ['', '', ''],
	mainFile: null,
	subFiles: [null, null, null],
	displayOrder: 1,
	showOnHome: false,
	// Making용 필드
	mainVideoUrl: '',
	videoFile: null,
});

const activeTable = computed(() => {
	if (activeTab.value === 'rental') return 'rentals';
	if (activeTab.value === 'making') return 'makings';
	if (activeTab.value === 'portfolio') return 'portfolios';
	return 'partners';
});
const activeTabLabel = computed(() => {
	if (activeTab.value === 'rental') return '렌탈 관리';
	if (activeTab.value === 'making') return '메이킹 관리';
	if (activeTab.value === 'portfolio') return '포트폴리오 관리';
	return '제휴처 관리';
});
const isPartnerTab = computed(() => activeTab.value === 'partner');
const isMakingTab = computed(() => activeTab.value === 'making');

// IP 주소 가져오기
const fetchIpAddress = async () => {
	try {
		const response = await fetch('https://api.ipify.org?format=json');
		const data = await response.json();
		currentIp.value = data.ip;
	} catch (err) {
		console.error('IP 주소를 가져오지 못했습니다:', err);
		currentIp.value = 'unknown';
	}
};

// Supabase에 세션 생성
const createSession = async () => {
	try {
		// 기존 세션 삭제 (같은 session_id)
		await supabase.from('admin_sessions').delete().eq('session_id', currentSessionId.value);

		// 새 세션 생성
		const { error } = await supabase.from('admin_sessions').insert({
			session_id: currentSessionId.value,
			ip_address: currentIp.value,
			user_agent: currentUserAgent.value,
			last_active: new Date().toISOString(),
		});

		if (error) throw error;
		localStorage.setItem(SESSION_KEY, currentSessionId.value);
		return true;
	} catch (err) {
		console.error('세션 생성 실패:', err);
		return false;
	}
};

// 세션 활동 업데이트
const updateSessionActivity = async () => {
	try {
		const { error } = await supabase
			.from('admin_sessions')
			.update({ last_active: new Date().toISOString() })
			.eq('session_id', currentSessionId.value);

		if (error) throw error;
	} catch (err) {
		console.error('세션 활동 업데이트 실패:', err);
	}
};

// 세션 검증 (Supabase)
const validateSession = async () => {
	const localSessionId = localStorage.getItem(SESSION_KEY);
	if (!localSessionId) {
		if (isAuthed.value) {
			isAuthed.value = false;
		}
		return false;
	}

	try {
		// Supabase에서 모든 활성 세션 조회
		const { data: sessions, error } = await supabase
			.from('admin_sessions')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) throw error;

		// 24시간 이상 된 세션 삭제
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
		await supabase.from('admin_sessions').delete().lt('created_at', oneDayAgo);

		// 현재 세션 찾기
		const currentSession = sessions?.find((s) => s.session_id === localSessionId);

		if (!currentSession) {
			// 현재 세션이 DB에 없음 (다른 곳에서 로그인했거나 삭제됨)
			if (isAuthed.value) {
				isAuthed.value = false;
				localStorage.removeItem(SESSION_KEY);
				alert('다른 기기에서 로그인되어 현재 세션이 종료되었습니다.');
			}
			return false;
		}

		// 세션이 유효하면 활동 시간 업데이트
		await updateSessionActivity();
		return true;
	} catch (err) {
		console.error('세션 검증 실패:', err);
		localStorage.removeItem(SESSION_KEY);
		return false;
	}
};

// 세션 삭제
const deleteSession = async () => {
	try {
		await supabase.from('admin_sessions').delete().eq('session_id', currentSessionId.value);
		localStorage.removeItem(SESSION_KEY);
	} catch (err) {
		console.error('세션 삭제 실패:', err);
	}
};

const handleLogin = async () => {
	if (loginForm.id !== ADMIN_ID || loginForm.password !== ADMIN_PASSWORD) {
		loginError.value = '아이디 또는 비밀번호가 올바르지 않습니다.';
		return;
	}

	try {
		loginError.value = '로그인 중...';

		// IP 주소 가져오기
		await fetchIpAddress();

		// 기존 활성 세션 확인
		const { data: existingSessions, error: fetchError } = await supabase
			.from('admin_sessions')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(5);

		if (fetchError) throw fetchError;

		if (existingSessions && existingSessions.length > 0) {
			const sessionInfo = existingSessions
				.map((s) => {
					const time = new Date(s.created_at).toLocaleString('ko-KR');
					return `- IP: ${s.ip_address} (${time})`;
				})
				.join('\n');

			const shouldProceed = confirm(
				`이미 로그인된 세션이 있습니다:\n\n${sessionInfo}\n\n계속하시면 기존 세션이 모두 종료됩니다. 계속하시겠습니까?`,
			);

			if (!shouldProceed) {
				loginError.value = '';
				return;
			}

			// 기존 세션 모두 삭제
			await supabase.from('admin_sessions').delete().neq('session_id', 'dummy');
		}

		// 새 세션 생성
		const success = await createSession();
		if (!success) {
			loginError.value = '세션 생성에 실패했습니다.';
			return;
		}

		isAuthed.value = true;
		loginError.value = '';
		fetchItems();

		// 주기적으로 세션 체크 시작
		if (sessionCheckTimer.value) {
			clearInterval(sessionCheckTimer.value);
		}
		sessionCheckTimer.value = setInterval(validateSession, SESSION_CHECK_INTERVAL);
	} catch (err) {
		console.error('로그인 실패:', err);
		loginError.value = '로그인 중 오류가 발생했습니다.';
	}
};

const logout = async () => {
	isAuthed.value = false;

	// Supabase에서 세션 삭제
	await deleteSession();

	// 세션 체크 타이머 정리
	if (sessionCheckTimer.value) {
		clearInterval(sessionCheckTimer.value);
		sessionCheckTimer.value = null;
	}
};

const selectTab = (tab) => {
	activeTab.value = tab;
	resetForm();
	fetchItems();
};

const resetForm = () => {
	form.id = null;
	form.title = '';
	form.description = '';
	form.mainImageUrl = '';
	form.subImageUrls = ['', '', ''];
	form.mainFile = null;
	form.subFiles = [null, null, null];
	form.mainVideoUrl = '';
	form.videoFile = null;
	form.displayOrder = 1;
	form.showOnHome = false;
	formError.value = '';
	fileInputKey.value += 1; // input 리셋을 위한 key 변경
};

const openMobileForm = () => {
	resetForm();
	showMobileForm.value = true;
	document.body.style.overflow = 'hidden';
};

const closeMobileForm = () => {
	showMobileForm.value = false;
	document.body.style.overflow = '';
};

const editMobileItem = (item) => {
	editItem(item);
	showMobileForm.value = true;
	document.body.style.overflow = 'hidden';
};

const fetchItems = async () => {
	if (!isAuthed.value) return;
	loading.value = true;
	error.value = '';

	let selectFields;
	if (isPartnerTab.value) {
		selectFields = 'id, name, logo_url, display_order, created_at';
	} else if (isMakingTab.value) {
		selectFields = 'id, title, main_video_url, show_on_home, created_at';
	} else {
		selectFields = 'id, title, description, main_image_url, sub_image_urls, show_on_home, created_at';
	}

	const orderBy = isPartnerTab.value ? 'display_order' : 'created_at';

	const { data, error: fetchError } = await supabase
		.from(activeTable.value)
		.select(selectFields)
		.order(orderBy, { ascending: isPartnerTab.value });

	if (fetchError) {
		error.value = '데이터를 불러오지 못했습니다.';
		console.error(fetchError);
	} else {
		items.value = data || [];
	}

	loading.value = false;
};

const onMainFileChange = (event) => {
	const file = event.target.files?.[0];
	if (!file) return;
	form.mainFile = file;
	form.mainImageUrl = URL.createObjectURL(file);
};

const onSubFileChange = (event, index) => {
	const file = event.target.files?.[0];
	if (!file) return;
	form.subFiles[index] = file;
	form.subImageUrls[index] = URL.createObjectURL(file);
};

const onVideoFileChange = (event) => {
	const file = event.target.files?.[0];
	if (!file) return;
	if (!file.type.startsWith('video/')) {
		formError.value = '비디오 파일만 업로드 가능합니다.';
		return;
	}
	form.videoFile = file;
	form.mainVideoUrl = URL.createObjectURL(file);
	formError.value = '';
};

const editItem = (item) => {
	form.id = item.id;
	if (isPartnerTab.value) {
		form.title = item.name;
		form.mainImageUrl = item.logo_url || '';
		form.displayOrder = item.display_order || 1;
	} else if (isMakingTab.value) {
		// Making 탭: 비디오 필드
		form.title = item.title;
		form.mainVideoUrl = item.main_video_url || '';
		form.showOnHome = item.show_on_home || false;
		form.videoFile = null;
	} else {
		// Rental/Portfolio 탭: 이미지 필드
		form.title = item.title;
		form.description = item.description;
		form.mainImageUrl = item.main_image_url || '';
		form.subImageUrls = item.sub_image_urls?.length ? item.sub_image_urls.slice(0, 3) : ['', '', ''];
		form.subFiles = [null, null, null];
		form.showOnHome = item.show_on_home || false;
	}
	form.mainFile = null;
	formError.value = '';
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSubmit = async () => {
	formError.value = '';

	// 제휴처 처리
	if (isPartnerTab.value) {
		if (!form.title.trim()) {
			formError.value = '제휴처명을 입력하세요.';
			return;
		}

		saving.value = true;

		try {
			const logoUrl = form.mainFile ? await uploadToCloudinary(form.mainFile) : form.mainImageUrl;
			if (!logoUrl) {
				throw new Error('로고 이미지를 업로드하세요.');
			}

			const payload = {
				name: form.title,
				logo_url: logoUrl,
				display_order: form.displayOrder || 1,
			};

			if (form.id) {
				const { error: updateError } = await supabase.from('partners').update(payload).eq('id', form.id);
				if (updateError) throw updateError;
			} else {
				const { error: insertError } = await supabase.from('partners').insert(payload);
				if (insertError) throw insertError;
			}

			resetForm();
			fetchItems();
		} catch (err) {
			console.error('Partner save error:', err);
			formError.value = err.message || '저장에 실패했습니다.';
		} finally {
			saving.value = false;
		}
		return;
	}

	// Making 탭 처리
	if (isMakingTab.value) {
		if (!form.title.trim()) {
			formError.value = '제목을 입력하세요.';
			return;
		}

		saving.value = true;

		try {
			// 비디오 파일 업로드
			const videoUrl = form.videoFile ? await uploadToCloudinary(form.videoFile) : form.mainVideoUrl;
			if (!videoUrl) {
				throw new Error('비디오 파일을 업로드하세요.');
			}

			const payload = {
				title: form.title,
				main_video_url: videoUrl,
				show_on_home: form.showOnHome,
			};

			if (form.id) {
				const { error: updateError } = await supabase.from('makings').update(payload).eq('id', form.id);
				if (updateError) throw updateError;
			} else {
				const { error: insertError } = await supabase.from('makings').insert(payload);
				if (insertError) throw insertError;
			}

			resetForm();
			await fetchItems();
			closeMobileForm();
		} catch (err) {
			console.error('Making save error:', err);
			formError.value = err.message || '저장 중 오류가 발생했습니다.';
		} finally {
			saving.value = false;
		}
		return;
	}

	// 렌탈/포트폴리오 처리
	if (!form.title.trim() || !form.description.trim()) {
		formError.value = '제목과 설명을 입력하세요.';
		return;
	}

	saving.value = true;

	try {
		const mainUrl = form.mainFile ? await uploadToCloudinary(form.mainFile) : form.mainImageUrl;
		if (!mainUrl) {
			throw new Error('메인 이미지를 업로드하세요.');
		}

		const subUrls = [];
		for (let i = 0; i < 3; i += 1) {
			if (form.subFiles[i]) {
				subUrls.push(await uploadToCloudinary(form.subFiles[i]));
			} else if (form.subImageUrls[i]) {
				subUrls.push(form.subImageUrls[i]);
			}
		}

		const payload = {
			title: form.title,
			description: form.description,
			main_image_url: mainUrl,
			sub_image_urls: subUrls,
		};

		// Rental 또는 Portfolio 탭일 때 show_on_home 추가
		if (activeTab.value === 'rental' || activeTab.value === 'portfolio') {
			payload.show_on_home = form.showOnHome;
		}

		if (form.id) {
			const { error: updateError } = await supabase.from(activeTable.value).update(payload).eq('id', form.id);
			if (updateError) throw updateError;
		} else {
			const { error: insertError } = await supabase.from(activeTable.value).insert(payload);
			if (insertError) throw insertError;
		}

		resetForm();
		await fetchItems();
		closeMobileForm();
	} catch (err) {
		console.error(err);
		formError.value = err.message || '저장 중 오류가 발생했습니다.';
	} finally {
		saving.value = false;
	}
};

const deleteItem = async (item) => {
	if (!confirm('정말 삭제하시겠습니까?')) return;
	const { error: deleteError } = await supabase.from(activeTable.value).delete().eq('id', item.id);
	if (deleteError) {
		console.error(deleteError);
		error.value = '삭제 중 오류가 발생했습니다.';
		return;
	}
	await fetchItems();
};

onMounted(async () => {
	// 세션 검증 및 복구
	const isValid = await validateSession();
	if (isValid) {
		isAuthed.value = true;
		fetchItems();

		// 주기적 세션 체크 시작
		sessionCheckTimer.value = setInterval(validateSession, SESSION_CHECK_INTERVAL);
	}
});

onUnmounted(async () => {
	// 정리
	if (sessionCheckTimer.value) {
		clearInterval(sessionCheckTimer.value);
	}

	// 페이지 종료 시 세션은 유지 (로그아웃하지 않음)
});
</script>

<style scoped lang="scss">
.section-admin {
	height: 100vh;
	padding: 0;
	background: #fafbfc;
	color: #111;
	overflow: hidden;
}

.admin-layout {
	width: 100%;
	height: 100vh;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: 15% 85%;
	gap: 0;

	@media (max-width: 968px) {
		grid-template-columns: 1fr;
	}
}

.admin-sidebar {
	background: #ffffff;
	border-right: 1px solid #e6e6e6;
	padding: 15px 24px 32px 24px;
	box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
	height: 100vh;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	@media (max-width: 968px) {
		position: static;
	}
}

.sidebar-top {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.admin-logo {
	font-size: 1.5rem;
	font-weight: 700;
	color: #111;
	margin-bottom: 48px;
	letter-spacing: -0.5px;

	span {
		color: #4a90e2;
		font-size: 1.8rem;
	}
}

.admin-nav {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.admin-nav-item {
	text-align: left;
	padding: 12px 16px;
	border: 1.5px solid #e8e8e8;
	border-radius: 8px;
	background: #ffffff;
	font-size: 0.95rem;
	font-weight: 500;
	color: #555;
	cursor: pointer;
	transition: all 0.25s ease;

	&:hover {
		background: #f8f8f8;
		border-color: #d0d0d0;
		color: #333;
	}

	&.is-active {
		background: linear-gradient(135deg, #111 0%, #2a2a2a 100%);
		color: #fff;
		border-color: #111;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
}

.admin-logout {
	padding-top: 16px;
	border-top: 1px solid #e6e6e6;
}

.logout-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border: none;
	border-radius: 8px;
	background: transparent;
	font-size: 0.95rem;
	color: #666;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: #f5f5f5;
		color: #333;

		svg {
			opacity: 1;
		}
	}

	svg {
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}
}

.admin-content {
	background: #ffffff;
	padding: 0px 48px;
	height: 100vh;
	overflow-y: auto;
}

.admin-login {
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 420px;
}

.admin-panel-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
	position: sticky;
	top: 0;
	background: #ffffff;
	padding: 16px 0;
	z-index: 10;
	border-bottom: 1px solid #f0f0f0;

	h2 {
		font-size: 1.4rem;
		color: #111;
	}
}

.admin-grid {
	position: relative;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	//grid-template-columns: 1.3fr 1fr;
	//gap: 20px;

	@media (max-width: 968px) {
		display: grid;
		grid-template-columns: 1fr;
	}
}

.admin-list {
	flex: 1;
	padding-right: 20px;
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th,
	td {
		border-bottom: 1px solid #eee;
		padding: 10px 8px;
		text-align: left;
		vertical-align: top;
	}

	th {
		color: #555;
		font-weight: 600;
	}

	td.desc {
		color: #666;
		max-width: 260px;
	}
}

.thumb {
	width: 70px;
	//height: 50px;
	object-fit: cover;
	border-radius: 6px;
	background: #f0f0f0;
}

.admin-form-wrap {
	position: sticky;
	top: 96px;
	background: #ffffff;
	border: 1.5px solid #e8e8e8;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
	width: 40%;
	align-self: flex-start;
	max-height: calc(100vh - 120px);
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: #f5f5f5;
		border-radius: 3px;
	}

	&::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 3px;

		&:hover {
			background: #aaa;
		}
	}
}

.admin-form {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.form-row {
		display: flex;
		flex-direction: column;
		gap: 8px;

		label {
			font-size: 0.875rem;
			color: #333;
			font-weight: 600;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 2px;

			.char-count {
				font-size: 0.75rem;
				color: #999;
				font-weight: 400;
			}
		}

		input[type='text'],
		input[type='url'],
		input[type='password'],
		input[type='file'] {
			width: 100%;
			padding: 11px 14px;
			border: 1.5px solid #e0e0e0;
			border-radius: 8px;
			font-size: 0.9rem;
			color: #333;
			background: #ffffff;
			transition: all 0.2s ease;
			font-family: inherit;

			&:focus {
				outline: none;
				border-color: #111;
				box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
			}

			&::placeholder {
				color: #aaa;
			}

			&:disabled {
				background: #f5f5f5;
				color: #999;
				cursor: not-allowed;
			}
		}

		textarea {
			width: 100%;
			padding: 11px 14px;
			border: 1.5px solid #e0e0e0;
			border-radius: 8px;
			font-size: 0.9rem;
			color: #333;
			background: #ffffff;
			transition: all 0.2s ease;
			font-family: inherit;
			resize: vertical;
			min-height: 90px;

			&:focus {
				outline: none;
				border-color: #111;
				box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
			}

			&::placeholder {
				color: #aaa;
			}
		}

		.preview {
			margin-top: 8px;

			img {
				width: 100%;
				height: auto;
				max-height: 180px;
				object-fit: contain;
				border-radius: 8px;
				border: 1px solid #e0e0e0;
			}
		}
	}

	.hint {
		font-size: 0.75rem;
		color: #999;
		margin-top: 2px;
		display: block;
		line-height: 1.4;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-size: 0.9rem;
		color: #333;
		padding: 8px 0;
		transition: color 0.2s ease;

		input[type='checkbox'] {
			width: 20px;
			height: 20px;
			cursor: pointer;
			accent-color: #111;
		}

		span {
			user-select: none;
		}

		&:hover {
			color: #111;
		}
	}
}

.preview {
	margin-top: 6px;

	img {
		width: 100%;
		height: auto;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid #eee;
	}
}

.sub-image-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 10px;

	@media (max-width: 968px) {
		grid-template-columns: 1fr;
	}
}

.sub-item {
	input {
		width: 100%;
	}
}

.btn-primary {
	border: none;
	background: linear-gradient(135deg, #111 0%, #2a2a2a 100%);
	color: #fff;
	padding: 12px 20px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	font-size: 0.9rem;
	transition: all 0.3s ease;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

	&:hover {
		background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	&:active {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
	}
}

.btn-small {
	border: 1.5px solid #e0e0e0;
	background: #fff;
	color: #333;
	padding: 7px 14px;
	border-radius: 6px;
	cursor: pointer;
	margin-right: 6px;
	font-size: 0.85rem;
	font-weight: 500;
	transition: all 0.2s ease;

	&:hover {
		background: #f8f8f8;
		border-color: #ccc;
	}
}

.btn-danger {
	border-color: #fee;
	color: #d32f2f;
	background: #fff;

	&:hover {
		background: #fff5f5;
		border-color: #ffdddd;
		color: #c62828;
	}
}

.form-error {
	color: #c62828;
	font-size: 0.85rem;
}

.checkbox-label {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	font-size: 0.95rem;
	color: #333;

	input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	span {
		user-select: none;
	}
}

.badge {
	display: inline-block;
	padding: 4px 10px;
	border-radius: 12px;
	font-size: 0.8rem;
	font-weight: 600;

	&-active {
		background: #e3f2fd;
		color: #1976d2;
	}

	&-inactive {
		background: #f5f5f5;
		color: #999;
	}
}

.loading-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.7);
	backdrop-filter: blur(4px);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	animation: fadeIn 0.2s ease;
}

// 모바일 카드 리스트
.mobile-card-list {
	display: none;
}

// 모바일 폼 모달
.mobile-form-modal {
	display: none;
}

// 모바일 전용 버튼
.btn-add-mobile {
	display: none;
}

.loading-content {
	background: #fff;
	padding: 40px 50px;
	border-radius: 16px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	animation: scaleIn 0.3s ease;
}

.loading-spinner-ring {
	width: 60px;
	height: 60px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid #4a90e2;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.loading-text {
	font-size: 1.1rem;
	font-weight: 600;
	color: #333;
	margin: 0;
}

.progress-bar {
	width: 300px;
	height: 6px;
	background: #e0e0e0;
	border-radius: 3px;
	overflow: hidden;
}

.progress-bar-fill {
	height: 100%;
	background: linear-gradient(90deg, #4a90e2, #667eea);
	animation: progressIndeterminate 1.5s ease-in-out infinite;
	border-radius: 3px;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes scaleIn {
	from {
		transform: scale(0.9);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

@keyframes progressIndeterminate {
	0% {
		transform: translateX(-100%);
	}
	50% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(100%);
	}
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}

@media (max-width: 968px) {
	.section-admin {
		padding: 0;
		height: auto;
		min-height: 100vh;
	}

	.admin-layout {
		display: flex;
		flex-direction: column;
		//grid-template-columns: 1fr;
		height: auto;
		min-height: 100vh;
		gap: 0;
	}

	// 데스크톱 테이블 숨기기
	.admin-grid {
		display: none !important;
	}

	// 데스크톱 버튼 숨기기
	.btn-add-desktop {
		display: none !important;
	}

	// 모바일 버튼 표시
	.btn-add-mobile {
		display: flex !important;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 11px 16px !important;
		font-size: 0.9rem !important;

		svg {
			flex-shrink: 0;
		}
	}

	// 모바일 카드 리스트 표시
	.mobile-card-list {
		display: block;
		padding: 12px;

		.loading-card,
		.error-card,
		.empty-card {
			background: #fff;
			padding: 40px 20px;
			border-radius: 12px;
			text-align: center;
			color: #666;
			font-size: 0.9rem;
		}

		.card-item {
			background: #fff;
			border-radius: 12px;
			overflow: hidden;
			margin-bottom: 12px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
			transition: all 0.2s ease;
			cursor: pointer;

			&:active {
				transform: scale(0.98);
			}
		}

		.card-image {
			position: relative;
			width: 100%;
			height: 180px;
			overflow: hidden;
			background: #f5f5f5;
			display: flex;
			align-items: center;
			justify-content: center;

			img,
			video {
				width: 43%;
				//height: 100%;
				object-fit: cover;
			}

			.card-badge {
				position: absolute;
				top: 10px;
				right: 10px;
				background: rgba(25, 118, 210, 0.95);
				color: #fff;
				padding: 5px 12px;
				border-radius: 20px;
				font-size: 0.75rem;
				font-weight: 600;
				backdrop-filter: blur(4px);
			}
		}

		.card-content {
			padding: 14px;
		}

		.card-title {
			font-size: 1rem;
			font-weight: 600;
			margin: 0 0 8px 0;
			color: #111;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.card-desc {
			font-size: 0.85rem;
			color: #666;
			margin: 0 0 12px 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			line-height: 1.5;
		}

		.card-order {
			font-size: 0.85rem;
			color: #999;
			margin: 0 0 12px 0;
		}

		.card-actions {
			display: flex;
			gap: 8px;
			padding-top: 12px;
			border-top: 1px solid #f0f0f0;
		}

		.btn-card-edit,
		.btn-card-delete {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			padding: 10px;
			border-radius: 8px;
			font-size: 0.85rem;
			font-weight: 500;
			border: none;
			cursor: pointer;
			transition: all 0.2s ease;

			svg {
				flex-shrink: 0;
			}
		}

		.btn-card-edit {
			background: #f5f5f5;
			color: #333;

			&:active {
				background: #e8e8e8;
			}
		}

		.btn-card-delete {
			background: #fff5f5;
			color: #d32f2f;

			&:active {
				background: #ffebee;
			}
		}
	}

	// 모바일 폼 모달
	.mobile-form-modal {
		display: flex;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(4px);
		z-index: 10000;
		align-items: flex-end;
		animation: fadeIn 0.2s ease;

		.modal-content {
			background: #fff;
			width: 100%;
			max-height: 90vh;
			border-radius: 20px 20px 0 0;
			display: flex;
			flex-direction: column;
			animation: slideUp 0.3s ease;
		}

		.modal-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16px 20px;
			border-bottom: 1px solid #f0f0f0;
			flex-shrink: 0;

			h3 {
				font-size: 1.1rem;
				font-weight: 600;
				margin: 0;
				color: #111;
			}

			.modal-close {
				background: none;
				border: none;
				padding: 4px;
				cursor: pointer;
				color: #666;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.2s ease;

				&:active {
					transform: scale(0.9);
					color: #111;
				}
			}
		}

		.modal-body {
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			padding: 20px;
		}

		.mobile-form {
			.form-row {
				margin-bottom: 18px;

				label {
					display: block;
					font-size: 0.9rem;
					font-weight: 500;
					color: #333;
					margin-bottom: 8px;
				}

				input[type='text'],
				input[type='number'],
				input[type='file'],
				textarea {
					width: 100%;
					padding: 12px 14px;
					border: 1.5px solid #e0e0e0;
					border-radius: 8px;
					font-size: 0.95rem;
					transition: all 0.2s ease;

					&:focus {
						outline: none;
						border-color: #111;
						box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
					}
				}

				textarea {
					resize: vertical;
					min-height: 90px;
					font-family: inherit;
				}

				input[type='file'] {
					padding: 10px;
					font-size: 0.85rem;
				}

				.preview {
					margin-top: 10px;
					width: 100%;
					height: 160px;
					border-radius: 8px;
					overflow: hidden;
					background: #f5f5f5;

					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}

				.sub-image-grid {
					display: grid;
					grid-template-columns: 1fr;
					gap: 12px;

					.sub-item {
						.preview {
							height: 140px;
						}
					}
				}

				.char-count {
					float: right;
					font-size: 0.8rem;
					color: #999;
					font-weight: 400;
				}

				.checkbox-label {
					display: flex;
					align-items: center;
					gap: 10px;
					padding: 12px;
					background: #f8f8f8;
					border-radius: 8px;
					cursor: pointer;

					input[type='checkbox'] {
						width: 20px;
						height: 20px;
						margin: 0;
					}

					span {
						font-size: 0.95rem;
						font-weight: 500;
						color: #333;
					}
				}
			}

			.btn-primary {
				width: 100%;
				padding: 14px;
				font-size: 1rem;
				margin-top: 10px;
			}
		}
	}

	.admin-sidebar {
		position: sticky;
		top: 0;
		height: auto;
		border-right: none;
		border-bottom: 2px solid #e6e6e6;
		padding: 10px 12px;
		background: #fff;
		z-index: 100;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

		.sidebar-top {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			flex-wrap: wrap;
		}

		.admin-logo {
			flex-shrink: 0;

			img {
				width: 120px !important;
				max-width: 100%;
			}
		}

		.admin-nav {
			display: flex;
			flex-direction: row;
			gap: 6px;
			overflow-x: auto;
			padding-bottom: 6px;
			-webkit-overflow-scrolling: touch;
			flex: 1;
			min-width: 0;

			&::-webkit-scrollbar {
				height: 2px;
			}

			&::-webkit-scrollbar-thumb {
				background: #ddd;
				border-radius: 2px;
			}
		}

		.admin-nav-item {
			white-space: nowrap;
			font-size: 0.8rem;
			padding: 8px 12px;
			min-width: fit-content;
			border-width: 1px;
		}

		.admin-logout {
			margin-top: 6px;
			padding-top: 6px;
			border-top: 1px solid #f0f0f0;
			width: 100%;
		}

		.logout-btn {
			width: 100%;
			justify-content: center;
			font-size: 0.8rem;
			padding: 8px 10px;
		}
	}

	.admin-content {
		padding: 12px 8px;
		height: auto;
		overflow: visible;
	}

	.admin-login {
		max-width: 100%;
		padding: 0;

		.admin-card {
			padding: 20px 16px;
			margin: 0;

			h2 {
				font-size: 1.3rem;
				margin-bottom: 16px;
			}
		}

		.form-row {
			margin-bottom: 14px;

			label {
				font-size: 0.85rem;
				margin-bottom: 4px;
			}

			input {
				padding: 10px 12px;
				font-size: 0.9rem;
			}
		}

		.btn-primary {
			padding: 11px;
			font-size: 0.9rem;
			margin-top: 8px;
		}
	}

	.admin-panel-header {
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
		padding: 10px 0;
		position: static;
		background: transparent;
		margin-bottom: 12px;

		h2 {
			font-size: 1.2rem;
			flex: none;
		}

		.btn-primary {
			width: 100%;
			padding: 11px 16px;
			font-size: 0.9rem;
		}
	}

	.admin-grid {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.admin-form-wrap {
		position: static;
		top: auto;
		max-height: none;
		margin-bottom: 16px;
		order: -1;
		width: 100%;
		padding: 16px;
		border-radius: 10px;
	}

	.admin-form {
		.form-row {
			gap: 6px;

			label {
				font-size: 0.85rem;
				margin-bottom: 2px;
			}

			input[type='text'],
			input[type='url'],
			input[type='password'],
			textarea {
				padding: 10px 12px;
				font-size: 0.9rem;
			}

			textarea {
				min-height: 80px;
			}

			.checkbox-label {
				font-size: 0.85rem;
				padding: 6px 0;
			}
		}

		.btn-primary {
			padding: 11px;
			font-size: 0.9rem;
			width: 100%;
		}
	}

	.admin-list {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		margin: 0 -8px;
		padding: 0 8px;
		border-radius: 10px;
		background: #fff;

		table {
			min-width: 600px;
			font-size: 0.8rem;
		}

		th,
		td {
			padding: 10px 6px;
		}

		th {
			font-size: 0.8rem;
			position: sticky;
			top: 0;
			background: #fff;
			z-index: 10;
		}

		.item-thumb {
			width: 50px;
			height: 50px;
		}

		.item-title {
			max-width: 100px;
			font-size: 0.8rem;
		}

		.item-desc {
			max-width: 120px;
			font-size: 0.75rem;
		}

		.btn-edit,
		.btn-delete {
			font-size: 0.75rem;
			padding: 6px 10px;
		}
	}

	.image-preview-grid {
		grid-template-columns: 1fr;
		gap: 10px;
	}

	.sub-image-grid {
		grid-template-columns: 1fr;
		gap: 10px;
	}

	.loading-content {
		padding: 24px 20px;
		margin: 0 12px;
	}

	.progress-bar {
		width: 200px;
	}
}

@media (max-width: 640px) {
	.section-admin {
		padding: 0;
	}
	.admin-logo {
		margin-bottom: 20px;
	}

	.admin-sidebar {
		padding: 8px 10px;

		.sidebar-top {
			gap: 8px;
			flex-direction: column;
		}

		.admin-logo {
			img {
				width: 100px !important;
			}
		}

		.admin-nav {
			gap: 4px;
		}

		.admin-nav-item {
			font-size: 0.75rem;
			padding: 7px 10px;
		}

		.logout-btn {
			font-size: 0.75rem;
			padding: 7px 8px;
		}
	}

	.admin-content {
		padding: 10px 6px;
	}

	.admin-login {
		.admin-card {
			padding: 18px 14px;

			h2 {
				font-size: 1.2rem;
			}
		}

		.form-row {
			label {
				font-size: 0.8rem;
			}

			input {
				font-size: 0.85rem;
				padding: 9px 10px;
			}
		}

		.btn-primary {
			padding: 10px;
			font-size: 0.85rem;
		}
	}

	.admin-panel-header {
		h2 {
			font-size: 1.1rem;
		}

		.btn-primary {
			padding: 10px 14px;
			font-size: 0.85rem;
		}
	}

	.admin-form-wrap {
		padding: 14px;
	}

	.admin-form {
		.form-row {
			label {
				font-size: 0.8rem;
			}

			input[type='text'],
			input[type='url'],
			input[type='password'],
			textarea {
				padding: 9px 10px;
				font-size: 0.85rem;
			}

			textarea {
				min-height: 70px;
			}

			.checkbox-label {
				font-size: 0.8rem;
			}
		}

		.btn-primary {
			padding: 10px;
			font-size: 0.85rem;
		}
	}

	.admin-list {
		margin: 0 -6px;
		padding: 0 6px;

		table {
			min-width: 550px;
			font-size: 0.75rem;
		}

		th,
		td {
			padding: 8px 4px;
		}

		.item-thumb {
			width: 45px;
			height: 45px;
		}

		.item-title {
			max-width: 80px;
			font-size: 0.75rem;
		}

		.item-desc {
			max-width: 100px;
			font-size: 0.7rem;
		}

		.btn-edit,
		.btn-delete {
			font-size: 0.7rem;
			padding: 5px 8px;
		}
	}

	.image-preview-grid {
		gap: 8px;
	}

	.sub-image-grid {
		gap: 8px;
	}

	.loading-content {
		padding: 20px 16px;

		.loading-spinner {
			width: 40px;
			height: 40px;
		}

		p {
			font-size: 0.9rem;
			margin: 10px 0 0;
		}
	}

	.progress-bar {
		width: 160px;
		height: 6px;
	}
}
</style>
