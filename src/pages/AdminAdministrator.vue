<template>
	<section class="section section-admin">
		<div class="admin-layout">
			<aside class="admin-sidebar">
				<div class="sidebar-top">
					<div class="admin-logo"><span>T</span>HE&nbsp;<span>T</span>OPS</div>
					<nav class="admin-nav" v-if="isAuthed">
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
						<button class="btn-primary" type="button" @click="resetForm">신규 등록</button>
					</div>

					<div class="admin-grid">
						<div class="admin-list">
							<table>
								<thead>
									<tr v-if="!isPartnerTab">
										<th>썸네일</th>
										<th>제목</th>
										<th>설명</th>
										<th v-if="activeTab === 'rental' || activeTab === 'portfolio'">메인표시</th>
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
											<img
												class="thumb"
												:src="isPartnerTab ? item.logo_url : item.main_image_url"
												alt=""
											/>
										</td>
										<td>{{ isPartnerTab ? item.name : item.title }}</td>
										<td v-if="!isPartnerTab" class="desc">{{ item.description }}</td>
										<td v-else>{{ item.display_order }}</td>
										<td v-if="activeTab === 'rental' || activeTab === 'portfolio'">
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
									<input v-model="form.title" type="text" required />
								</div>
								<div class="form-row">
									<label>설명</label>
									<textarea v-model="form.description" rows="4" required></textarea>
								</div>

								<div class="form-row" v-if="activeTab === 'rental' || activeTab === 'portfolio'">
									<label class="checkbox-label">
										<input v-model="form.showOnHome" type="checkbox" />
										<span>메인 화면에 표시</span>
									</label>
								</div>

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

								<button class="btn-primary" type="submit" :disabled="saving">
									{{ saving ? '저장 중...' : form.id ? '수정하기' : '등록하기' }}
								</button>
								<p class="form-error" v-if="formError">{{ formError }}</p>
							</form>
						</div>
					</div>
				</section>
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
import { computed, onMounted, reactive, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { uploadToCloudinary } from '@/lib/cloudinary';

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = '@@1234thetops!';

const isAuthed = ref(localStorage.getItem('thetops_admin_authed') === 'true');
const loginForm = reactive({ id: '', password: '' });
const loginError = ref('');

const activeTab = ref('rental');
const items = ref([]);
const loading = ref(false);
const error = ref('');

const saving = ref(false);
const formError = ref('');
const fileInputKey = ref(0);

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
});

const activeTable = computed(() => {
	if (activeTab.value === 'rental') return 'rentals';
	if (activeTab.value === 'portfolio') return 'portfolios';
	return 'partners';
});
const activeTabLabel = computed(() => {
	if (activeTab.value === 'rental') return '렌탈 관리';
	if (activeTab.value === 'portfolio') return '포트폴리오 관리';
	return '제휴처 관리';
});
const isPartnerTab = computed(() => activeTab.value === 'partner');

const handleLogin = () => {
	if (loginForm.id === ADMIN_ID && loginForm.password === ADMIN_PASSWORD) {
		isAuthed.value = true;
		loginError.value = '';
		localStorage.setItem('thetops_admin_authed', 'true');
		fetchItems();
		return;
	}
	loginError.value = '아이디 또는 비밀번호가 올바르지 않습니다.';
};

const logout = () => {
	isAuthed.value = false;
	localStorage.removeItem('thetops_admin_authed');
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
	form.displayOrder = 1;
	form.showOnHome = false;
	formError.value = '';
	fileInputKey.value += 1; // input 리셋을 위한 key 변경
};

const fetchItems = async () => {
	if (!isAuthed.value) return;
	loading.value = true;
	error.value = '';

	const selectFields = isPartnerTab.value
		? 'id, name, logo_url, display_order, created_at'
		: 'id, title, description, main_image_url, sub_image_urls, show_on_home, created_at';

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

const editItem = (item) => {
	form.id = item.id;
	if (isPartnerTab.value) {
		form.title = item.name;
		form.mainImageUrl = item.logo_url || '';
		form.displayOrder = item.display_order || 1;
	} else {
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

onMounted(() => {
	if (isAuthed.value) {
		fetchItems();
	}
});
</script>

<style scoped lang="scss">
.section-admin {
	height: 100vh;
	padding: 0;
	background: #f5f6f8;
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
	padding: 10px 12px;
	border: 1px solid #e6e6e6;
	border-radius: 8px;
	background: #fafafa;
	font-size: 0.95rem;
	color: #333;
	cursor: pointer;
	transition:
		background 0.2s ease,
		border-color 0.2s ease;

	&:hover {
		background: #f0f0f0;
		border-color: #dcdcdc;
	}

	&.is-active {
		background: #111;
		color: #fff;
		border-color: #111;
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
	height: 50px;
	object-fit: cover;
	border-radius: 6px;
	background: #f0f0f0;
}

.admin-form-wrap {
	position: sticky;
	top: 96px;
	background: #fafafa;
	border: 1px solid #efefef;
	border-radius: 10px;
	padding: 18px;

	width: 40%;
	align-self: flex-start;
	max-height: 100vh;
	overflow-y: auto;
}

.admin-form {
	display: flex;
	flex-direction: column;
	gap: 14px;

	.form-row {
		display: flex;
		flex-direction: column;
		gap: 6px;

		label {
			font-size: 0.85rem;
			color: #444;
		}

		input,
		textarea {
			border: 1px solid #ddd;
			border-radius: 8px;
			padding: 10px;
			font-size: 0.9rem;
			background: #fff;
			color: #333;

			&::placeholder {
				color: #999;
			}
		}

		.preview {
			margin-top: 6px;

			img {
				width: 230px;
				height: auto;
				max-height: 150px;
				object-fit: contain;
			}
		}
	}
}

.preview {
	margin-top: 6px;

	img {
		width: 100%;
		height: 120px;
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
	background: #111;
	color: #fff;
	padding: 10px 14px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
}

.btn-small {
	border: 1px solid #ddd;
	background: #fff;
	color: #333;
	padding: 6px 10px;
	border-radius: 6px;
	cursor: pointer;
	margin-right: 6px;
}

.btn-danger {
	border-color: #ffdddd;
	color: #c62828;
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

@media (max-width: 968px) {
	.section-admin {
		padding: 2rem 0 1rem;
	}

	.admin-layout {
		grid-template-columns: 1fr;
		height: auto;
	}

	.admin-sidebar {
		position: static;
		height: auto;
		border-right: none;
		border-bottom: 1px solid #e6e6e6;
		padding: 12px 16px;
	}

	.admin-logo {
		font-size: 1.2rem;
		margin-bottom: 12px;
	}

	.admin-nav {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		padding-bottom: 8px;

		&::-webkit-scrollbar {
			height: 4px;
		}

		&::-webkit-scrollbar-thumb {
			background: #ddd;
			border-radius: 2px;
		}
	}

	.admin-nav-item {
		white-space: nowrap;
		font-size: 0.85rem;
		padding: 8px 14px;
	}

	.admin-content {
		padding: 16px 12px;
	}

	.admin-panel-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding: 12px 0;

		h2 {
			font-size: 1.2rem;
		}

		.btn-primary {
			width: 100%;
		}
	}

	.admin-grid {
		grid-template-columns: 1fr;
		gap: 16px;
	}

	.admin-list {
		overflow-x: auto;

		table {
			min-width: 600px;
			font-size: 0.85rem;
		}

		th,
		td {
			padding: 10px 8px;
		}

		.item-thumb {
			width: 50px;
			height: 50px;
		}
	}

	.admin-form-wrap {
		position: static;
		top: auto;
		max-height: none;
		margin-bottom: 20px;
	}

	.admin-form {
		.form-row {
			label {
				font-size: 0.8rem;
			}

			input,
			textarea {
				font-size: 0.85rem;
				padding: 8px;
			}
		}
	}

	.image-preview-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.sub-image-grid {
		grid-template-columns: 1fr;
		gap: 8px;
	}

	.loading-content {
		padding: 30px 40px;
		margin: 0 20px;
	}

	.progress-bar {
		width: 200px;
	}

	.admin-logout {
		margin-top: 12px;
	}

	.logout-btn {
		font-size: 0.85rem;
		padding: 8px 12px;
	}
}

@media (max-width: 640px) {
	.admin-content {
		padding: 12px 8px;
	}

	.admin-panel-header {
		h2 {
			font-size: 1.1rem;
		}
	}

	.admin-list {
		table {
			font-size: 0.8rem;
		}

		th,
		td {
			padding: 8px 6px;
		}

		.item-thumb {
			width: 40px;
			height: 40px;
		}

		.btn-edit,
		.btn-delete {
			font-size: 0.75rem;
			padding: 6px 10px;
		}
	}

	.image-preview-grid {
		grid-template-columns: 1fr;
	}

	.loading-content {
		padding: 24px 30px;
	}

	.loading-text {
		font-size: 0.95rem;
	}

	.progress-bar {
		width: 160px;
	}
}
</style>
