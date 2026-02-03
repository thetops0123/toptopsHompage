<template>
	<section id="contact" class="section section-contact">
		<div class="container">
			<h2>Contact</h2>
			<h3>행사 문의 및 상담은 아래 정보로 연락주세요.</h3>
			<div class="contact-info">
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
			</div>
			<form class="contact-form">
				<input type="text" placeholder="이름" required />
				<input type="email" placeholder="이메일" required />
				<textarea placeholder="문의 내용" rows="5" required></textarea>
				<button type="submit">전송</button>
			</form>
		</div>
	</section>
</template>

<script setup></script>

<style lang="scss" scoped>
$accent-blue: #4a90e2;
$white-text: #ffffff;
$gray-text: #b0b0b0;

// Contact 섹션
.section {
	.section-contact {
		background: #0d1b2a;
	}
}
</style>
