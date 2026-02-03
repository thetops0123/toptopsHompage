<template>
	<section id="contact" class="section section-contact">
		<div class="container">
			<h2>CONTACT</h2>
			<h3>행사 문의 및 상담은 아래 정보로 연락주세요.</h3>
			<!--<div class="contact-info">
				<div class="info-item">
					<h3>이메일</h3>
					<p>hyun6993@naver.com</p>
				</div>
				<div class="info-item">
					<h3>전화</h3>
					<p>02-6401-6993</p>
				</div>
				<div class="info-item">
					<h3>주소</h3>
					<p>경기 하남시 미사강변중앙로31번길 30</p>
				</div>
			</div>-->
			<form class="contact-form" @submit.prevent="handleSubmit">
				<div class="form-group">
					<input
						type="text"
						v-model="formData.company"
						placeholder="회사명"
						class="form-input"
						:class="{ error: errors.company }"
						@blur="validateField('company')"
					/>
					<span v-if="errors.company" class="error-message">{{ errors.company }}</span>
				</div>

				<div class="form-group">
					<input
						type="text"
						v-model="formData.name"
						placeholder="담당자명"
						class="form-input"
						:class="{ error: errors.name }"
						@input="handleNameInput"
						@blur="validateField('name')"
					/>
					<span v-if="errors.name" class="error-message">{{ errors.name }}</span>
				</div>

				<div class="form-group">
					<input
						type="text"
						v-model="formData.email"
						placeholder="이메일 (example@domain.com)"
						class="form-input"
						:class="{ error: errors.email }"
						@blur="validateField('email')"
					/>
					<span v-if="errors.email" class="error-message">{{ errors.email }}</span>
				</div>

				<div class="form-group">
					<input
						type="text"
						v-model="formData.phone"
						placeholder="연락처 (010-1234-5678 또는 02-1234-5678)"
						class="form-input"
						:class="{ error: errors.phone }"
						@input="handlePhoneInput"
						@blur="validateField('phone')"
						maxlength="13"
					/>
					<span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
				</div>

				<div class="form-group">
					<textarea
						v-model="formData.message"
						placeholder="문의내용"
						rows="6"
						class="form-textarea"
						:class="{ error: errors.message }"
						@blur="validateField('message')"
					></textarea>
					<span v-if="errors.message" class="error-message">{{ errors.message }}</span>
				</div>

				<div class="form-group privacy-check">
					<label class="checkbox-wrapper">
						<input type="checkbox" v-model="formData.privacyAgreed" />
						<span class="checkbox-label">
							<button type="button" @click="showPrivacyModal = true" class="privacy-link">
								개인정보 취급방침</button
							>에 동의합니다
						</span>
					</label>
					<span v-if="errors.privacyAgreed" class="error-message">{{ errors.privacyAgreed }}</span>
				</div>

				<button type="submit" class="btn-submit" :disabled="isSubmitting">
					{{ isSubmitting ? '전송 중...' : '문의하기' }}
				</button>

				<div v-if="submitSuccess" class="success-message">
					문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
				</div>
			</form>
		</div>

		<!-- 개인정보 취급방침 모달 -->
		<Transition name="modal">
			<div v-if="showPrivacyModal" class="privacy-modal" @click.self="showPrivacyModal = false">
				<div class="privacy-content">
					<button class="close-btn" @click="showPrivacyModal = false">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
					<h2>개인정보 취급방침</h2>
					<div class="privacy-text">
						<h3>1. 수집하는 개인정보 항목</h3>
						<p>회사명, 담당자명, 이메일, 연락처, 문의내용</p>

						<h3>2. 개인정보의 수집 및 이용 목적</h3>
						<p>고객 문의에 대한 답변 및 상담 서비스 제공</p>

						<h3>3. 개인정보의 보유 및 이용 기간</h3>
						<p>문의 접수 후 3년간 보관하며, 목적 달성 후 즉시 파기합니다.</p>

						<h3>4. 개인정보의 제공</h3>
						<p>
							수집된 개인정보는 제3자에게 제공되지 않으며, 법령에 의한 경우를 제외하고는 외부에 공개되지
							않습니다.
						</p>

						<h3>5. 개인정보 처리의 거부 권리</h3>
						<p>
							귀하는 개인정보 제공 동의를 거부할 권리가 있으나, 동의하지 않을 경우 문의 접수가 제한될 수
							있습니다.
						</p>
					</div>
				</div>
			</div>
		</Transition>
	</section>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formData = reactive({
	company: '',
	name: '',
	email: '',
	phone: '',
	message: '',
	privacyAgreed: false,
});

const errors = reactive({
	company: '',
	name: '',
	email: '',
	phone: '',
	message: '',
	privacyAgreed: '',
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const showPrivacyModal = ref(false);

// 담당자명 입력 처리 (한글/영문만)
const handleNameInput = (e) => {
	const value = e.target.value;
	// 한글, 영문, 공백만 허용
	const filtered = value.replace(/[^가-힣a-zA-Z\s]/g, '');
	formData.name = filtered;
	errors.name = '';
};

// 연락처 입력 처리 (숫자만, 자동 Dash)
const handlePhoneInput = (e) => {
	let value = e.target.value;
	// 숫자만 추출
	const numbers = value.replace(/[^\d]/g, '');

	// 자동 Dash 삽입
	let formatted = '';

	if (numbers.length <= 2) {
		// 2자리 이하
		formatted = numbers;
	} else if (numbers.startsWith('02')) {
		// 서울 지역번호 (02-XXX-XXXX 또는 02-XXXX-XXXX)
		if (numbers.length <= 2) {
			formatted = numbers;
		} else if (numbers.length <= 5) {
			// 02-XXX 형태
			formatted = numbers.slice(0, 2) + '-' + numbers.slice(2);
		} else if (numbers.length === 9) {
			// 02-XXX-XXXX (2-3-4)
			formatted = numbers.slice(0, 2) + '-' + numbers.slice(2, 5) + '-' + numbers.slice(5);
		} else if (numbers.length <= 10) {
			// 02-XXXX-XXXX (2-4-4)
			formatted = numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6);
		} else {
			formatted = numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6, 10);
		}
	} else if (numbers.startsWith('01')) {
		// 휴대폰 (010/011/016/017/018/019-XXXX-XXXX)
		if (numbers.length <= 3) {
			formatted = numbers;
		} else if (numbers.length <= 7) {
			formatted = numbers.slice(0, 3) + '-' + numbers.slice(3);
		} else if (numbers.length <= 11) {
			formatted = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
		} else {
			formatted = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
		}
	} else {
		// 기타 지역번호 (0XX-XXX-XXXX 또는 0XX-XXXX-XXXX)
		if (numbers.length <= 3) {
			formatted = numbers;
		} else if (numbers.length <= 6) {
			formatted = numbers.slice(0, 3) + '-' + numbers.slice(3);
		} else if (numbers.length === 10) {
			// 10자리: 0XX-XXX-XXXX (3-3-4)
			formatted = numbers.slice(0, 3) + '-' + numbers.slice(3, 6) + '-' + numbers.slice(6);
		} else if (numbers.length <= 11) {
			// 11자리: 0XX-XXXX-XXXX (3-4-4)
			formatted = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
		} else {
			formatted = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
		}
	}

	formData.phone = formatted;
	errors.phone = '';
};

// 개별 필드 유효성 검증
const validateField = (field) => {
	errors[field] = '';

	switch (field) {
		case 'company':
			if (!formData.company.trim()) {
				errors.company = '회사명을 입력해주세요.';
			}
			break;
		case 'name':
			if (!formData.name.trim()) {
				errors.name = '담당자명을 입력해주세요.';
			} else if (!/^[가-힣a-zA-Z\s]+$/.test(formData.name)) {
				errors.name = '담당자명은 한글 또는 영문만 입력 가능합니다.';
			}
			break;
		case 'email':
			if (!formData.email.trim()) {
				errors.email = '이메일을 입력해주세요.';
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
				errors.email = '올바른 이메일 형식이 아닙니다.';
			}
			break;
		case 'phone':
			if (!formData.phone.trim()) {
				errors.phone = '연락처를 입력해주세요.';
			} else {
				const numbers = formData.phone.replace(/[^\d]/g, '');
				if (numbers.length < 9 || numbers.length > 11) {
					errors.phone = '올바른 연락처 형식이 아닙니다. (9~11자리)';
				}
			}
			break;
		case 'message':
			if (!formData.message.trim()) {
				errors.message = '문의내용을 입력해주세요.';
			} else if (formData.message.trim().length < 10) {
				errors.message = '문의내용을 10자 이상 입력해주세요.';
			}
			break;
	}
};

// 전체 폼 유효성 검증
const validateForm = () => {
	let isValid = true;

	// 모든 필드 검증
	['company', 'name', 'email', 'phone', 'message'].forEach((field) => {
		validateField(field);
		if (errors[field]) isValid = false;
	});

	// 개인정보 동의 체크
	if (!formData.privacyAgreed) {
		errors.privacyAgreed = '개인정보 취급방침에 동의해주세요.';
		isValid = false;
	} else {
		errors.privacyAgreed = '';
	}

	return isValid;
};

// 폼 제출
const handleSubmit = async () => {
	if (!validateForm()) {
		return;
	}

	isSubmitting.value = true;
	submitSuccess.value = false;

	try {
		// 이메일 발송 데이터 준비
		const emailData = {
			to_email: 'hyun6993@naver.com',
			from_company: formData.company,
			from_name: formData.name,
			from_email: formData.email,
			from_phone: formData.phone,
			message: formData.message,
		};

		// EmailJS 설정 확인
		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
		const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
		const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

		// EmailJS 설정 유효성 검사
		const isValidConfig =
			serviceId &&
			templateId &&
			publicKey &&
			!serviceId.includes('your_') &&
			!templateId.includes('your_') &&
			!publicKey.includes('your_');

		if (!isValidConfig) {
			// EmailJS 미설정 시 테스트 모드
			console.warn('EmailJS 설정이 완료되지 않았습니다. 테스트 모드로 실행됩니다.');
			console.log('📧 전송 데이터:', emailData);
			console.log('💡 실제 이메일 발송을 위해서는 EMAILJS_SETUP.md 파일을 참고하여 EmailJS를 설정해주세요.');
			await new Promise((resolve) => setTimeout(resolve, 1500));
		} else {
			// EmailJS로 이메일 발송 (동적 import)
			try {
				const emailjs = await import('@emailjs/browser');
				await emailjs.default.send(serviceId, templateId, emailData, publicKey);
				console.log('✅ 이메일이 성공적으로 발송되었습니다.');
			} catch (emailError) {
				console.error('EmailJS 발송 실패:', emailError);
				throw new Error('이메일 발송에 실패했습니다. EmailJS 설정을 확인해주세요.');
			}
		}

		// 성공 메시지 표시
		submitSuccess.value = true;

		// 폼 초기화
		Object.keys(formData).forEach((key) => {
			if (key === 'privacyAgreed') {
				formData[key] = false;
			} else {
				formData[key] = '';
			}
		});

		// 3초 후 성공 메시지 제거
		setTimeout(() => {
			submitSuccess.value = false;
		}, 3000);
	} catch (error) {
		console.error('문의 전송 실패:', error);
		alert('문의 전송에 실패했습니다. 다시 시도해주세요.');
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<style lang="scss" scoped>
@use 'sass:color';

$accent-blue: #4a90e2;
$accent-red: #df5959;
$white-text: #ffffff;
$gray-text: #b0b0b0;
$dark-bg: #0d1b2a;
$error-color: #ff4444;

// Contact 섹션

.section-contact {
	background: #000;
	min-height: 100vh;
	padding: 8rem 0 4rem;

	.container {
		max-width: 900px;

		h2 {
			font-size: 2.5rem;
			font-weight: 700;
			margin-bottom: 1rem;
			color: $white-text;
		}

		h3 {
			font-size: 1.1rem;
			font-weight: 400;
			color: $gray-text;
			margin-bottom: 3rem;
		}
	}

	.contact-info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;

		.info-item {
			background: rgba(255, 255, 255, 0.05);
			padding: 2rem;
			border-radius: 12px;
			border: 1px solid rgba(255, 255, 255, 0.1);
			transition: all 0.3s ease;

			&:hover {
				background: rgba(255, 255, 255, 0.08);
				border-color: rgba(255, 255, 255, 0.2);
				transform: translateY(-2px);
			}

			h3 {
				font-size: 0.9rem;
				font-weight: 600;
				color: $accent-red;
				margin-bottom: 0.8rem;
				text-transform: uppercase;
				letter-spacing: 1px;
			}

			p {
				font-size: 1.1rem;
				color: $white-text;
				margin: 0;
			}
		}
	}

	.contact-form {
		.form-group {
			margin-bottom: 1.5rem;
			position: relative;

			.form-input,
			.form-textarea {
				width: 100%;
				padding: 1rem 1.2rem;
				background: rgba(255, 255, 255, 0.05);
				border: 2px solid rgba(255, 255, 255, 0.1);
				border-radius: 8px;
				color: $white-text;
				font-size: 1rem;
				transition: all 0.3s ease;
				outline: none;

				&::placeholder {
					color: rgba(255, 255, 255, 0.4);
				}

				&:focus {
					background: rgba(255, 255, 255, 0.08);
					border-color: $accent-red;
				}

				&.error {
					border-color: $error-color;
					background: rgba(255, 68, 68, 0.1);
				}
			}

			.form-textarea {
				resize: vertical;
				min-height: 120px;
				font-family: inherit;
			}

			.error-message {
				display: block;
				color: $error-color;
				font-size: 0.85rem;
				margin-top: 0.5rem;
				padding-left: 0.3rem;
			}
		}

		.privacy-check {
			margin-top: 2rem;
			margin-bottom: 2rem;

			.checkbox-wrapper {
				display: flex;
				align-items: center;
				gap: 0.8rem;
				cursor: pointer;

				input[type='checkbox'] {
					width: 18px;
					height: 18px;
					cursor: pointer;
					accent-color: $accent-red;
				}

				.checkbox-label {
					color: $gray-text;
					font-size: 0.95rem;

					.privacy-link {
						background: none;
						border: none;
						color: $accent-red;
						text-decoration: underline;
						cursor: pointer;
						padding: 0;
						font-size: inherit;
						transition: color 0.3s ease;

						&:hover {
							color: color.adjust($accent-red, $lightness: 10%);
						}
					}
				}
			}
		}

		.btn-submit {
			width: 100%;
			padding: 1.2rem;
			background: linear-gradient(135deg, $accent-red 0%, color.adjust($accent-red, $lightness: -10%) 100%);
			border: none;
			border-radius: 8px;
			color: $white-text;
			font-size: 1.1rem;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.3s ease;

			&:hover:not(:disabled) {
				transform: translateY(-2px);
				box-shadow: 0 8px 20px rgba(223, 89, 89, 0.3);
			}

			&:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}

		.success-message {
			margin-top: 1.5rem;
			padding: 1.2rem;
			background: rgba(76, 175, 80, 0.1);
			border: 2px solid rgba(76, 175, 80, 0.5);
			border-radius: 8px;
			color: #4caf50;
			text-align: center;
			font-weight: 500;
			animation: slideDown 0.3s ease;
		}
	}
}

// 개인정보 취급방침 모달
.privacy-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.85);
	backdrop-filter: blur(5px);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	padding: 2rem;

	.privacy-content {
		background: #1a1a1a;
		max-width: 700px;
		width: 100%;
		max-height: 80vh;
		border-radius: 16px;
		padding: 3rem;
		position: relative;
		overflow-y: auto;
		border: 1px solid rgba(255, 255, 255, 0.1);

		.close-btn {
			position: absolute;
			top: 1.5rem;
			right: 1.5rem;
			background: rgba(255, 255, 255, 0.1);
			border: none;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all 0.3s ease;
			color: $white-text;

			&:hover {
				background: rgba(255, 255, 255, 0.2);
				transform: rotate(90deg);
			}
		}

		h2 {
			font-size: 1.8rem;
			font-weight: 700;
			color: $white-text;
			margin-bottom: 2rem;
			padding-bottom: 1rem;
			border-bottom: 2px solid $accent-red;
		}

		.privacy-text {
			color: $gray-text;
			line-height: 1.8;

			h3 {
				font-size: 1.1rem;
				font-weight: 600;
				color: $white-text;
				margin-top: 1.5rem;
				margin-bottom: 0.8rem;
			}

			p {
				margin-bottom: 1rem;
				font-size: 0.95rem;
			}
		}

		// 스크롤바 스타일
		&::-webkit-scrollbar {
			width: 8px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(255, 255, 255, 0.05);
			border-radius: 10px;
		}

		&::-webkit-scrollbar-thumb {
			background: $accent-red;
			border-radius: 10px;

			&:hover {
				background: color.adjust($accent-red, $lightness: -10%);
			}
		}
	}
}

// 모달 애니메이션
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;

	.privacy-content {
		transition: transform 0.3s ease;
	}
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;

	.privacy-content {
		transform: scale(0.9);
	}
}

// 성공 메시지 애니메이션
@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// 반응형
@media (max-width: 768px) {
	.section-contact {
		.contact-info {
			grid-template-columns: 1fr;
		}

		.contact-form {
			padding: 2rem 1.5rem;
		}

		.privacy-modal .privacy-content {
			padding: 2rem 1.5rem;
			margin: 1rem;
		}
	}
}
</style>
