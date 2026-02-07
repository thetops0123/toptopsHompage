<template>
	<section id="history" class="section section-history">
		<div class="container">
			<h2>HISTORY - <span>THE JOURNEY OF TOPS</span></h2>
			<h3>당신의 일상 곁에서 최고의 순간을 위해 더탑스가 달려온 시간들입니다.</h3>

			<div class="timeline-container">
				<!-- Rising arrow icon positioned absolutely on rising line -->
				<div class="airplane-icon">
					<svg viewBox="0 0 24 24" width="40" height="40" fill="none">
						<path
							d="M7 17L17 7M17 7h-6M17 7v6"
							stroke="#00a8cc"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>

				<svg class="timeline-svg" viewBox="0 0 1120 360" preserveAspectRatio="none">
					<defs>
						<marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
							<polygon points="0 0, 10 3, 0 6" fill="#00a8cc" />
						</marker>
					</defs>

					<!-- Main diagonal timeline -->
					<path d="M 20 350 L 900 60" stroke="#00a8cc" stroke-width="5" fill="none" />

					<!-- Rising dashed line after 2024 -->
					<path
						d="M 900 60 L 1080 -10"
						stroke="#00a8cc"
						stroke-width="2"
						fill="none"
						stroke-dasharray="6,6"
					/>

					<!-- Vertical dashed connector lines -->
					<line x1="20" y1="350" x2="20" y2="345" stroke="#999999" stroke-width="1" stroke-dasharray="3,3" />
					<line
						x1="310"
						y1="260"
						x2="310"
						y2="345"
						stroke="#999999"
						stroke-width="1"
						stroke-dasharray="3,3"
					/>
					<line
						x1="605"
						y1="155"
						x2="605"
						y2="345"
						stroke="#999999"
						stroke-width="1"
						stroke-dasharray="3,3"
					/>
					<line x1="900" y1="60" x2="900" y2="345" stroke="#999999" stroke-width="1" stroke-dasharray="3,3" />

					<!-- Timeline dots below the vertical lines -->
					<circle cx="20" cy="350" r="6" fill="#999999" />
					<circle cx="310" cy="350" r="6" fill="#999999" />
					<circle cx="605" cy="350" r="6" fill="#999999" />
					<circle cx="900" cy="350" r="6" fill="#999999" />
				</svg>

				<div class="timeline-content-wrapper">
					<!-- 2020 Period -->
					<div class="timeline-item">
						<div class="timeline-label">2020</div>
						<ul class="project-list">
							<li style="font-weight: 500; color: #fff">더탑스 설립</li>
						</ul>
					</div>

					<!-- 2022 Period -->
					<div class="timeline-item">
						<div class="timeline-label">- 2022</div>
						<ul class="project-list">
							<li>삼성전자판매 연간 행사 대행</li>
							<li>삼성전자판매 입주박람회 연간 대행</li>
							<li>한독 사회공헌 프로젝트 기억다방 연간 대행</li>
							<li>상상인그룹 봄 걷기대회 기획, 연출 및 진행</li>
							<li>상상인그룹 송년회</li>
							<li>서울 광역치매센터 연간 행사 대행</li>
						</ul>
					</div>

					<!-- 2023 Period -->
					<div class="timeline-item">
						<div class="timeline-label">- 2023</div>
						<ul class="project-list">
							<li>삼성전자판매 연간 행사 대행</li>
							<li>삼성전자판매 입주박람회 연간 대행</li>
							<li>한독 사회공헌 프로젝트 기억다방 연간 대행</li>
							<li>상상인그룹 봄 걷기대회 기획, 연출 및 진행</li>
							<li>상상인그룹 송년회</li>
							<li>판소리협회 1회 축제 행사 대행</li>
							<li>서울 광역치매센터 연간 행사 대행</li>
							<li>빙그레 팝업스토어 행사</li>
							<li>임시정부 기념관 연출물 연간 대행</li>
						</ul>
					</div>

					<!-- 2024 Period -->
					<div class="timeline-item">
						<div class="timeline-label">- 2024 현재</div>
						<ul class="project-list">
							<li>삼성전자판매 연간 행사 대행</li>
							<li>삼성전자판매 입주박람회 연간 대행</li>
							<li>한독 사회공헌 프로젝트 기억다방 연간 대행</li>
							<li>군산 한라 비발디 벚꽃축제</li>
							<li>상상인그룹 봄 걷기대회 기획, 연출 및 진행</li>
							<li>상상인그룹 송년회</li>
							<li>선미야 팝업스토어 연출물</li>
							<li>남이동길 브랜드 축제</li>
							<li>보그헤어 송년회</li>
							<li>하남시 하수도공공시설 기공식</li>
							<li>판소리협회 2회 축제 행사 대행</li>
							<li>서울시 교육기관 행사 대행</li>
							<li>서울 인재개발원 포토부스 연간 대행</li>
							<li>칠성사이다 74주년 팝업스토어</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup></script>

<style lang="scss" scoped>
.section-history {
	background: #0c0c0c;

	h2 {
		color: #fff;
	}

	h3 {
		color: #a5a5a5;
	}

	.timeline-container {
		position: relative;
		width: 100%;
	}

	.airplane-icon {
		position: absolute;
		top: -23px;
		right: 120px;
		z-index: 10;
		animation: floatBounce 1s ease-in-out infinite;
	}

	@keyframes floatBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.timeline-svg {
		width: 1120px;
		max-width: 100%;
		height: 280px;
		margin: 0 auto 10px;
		display: block;
	}

	.timeline-content-wrapper {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2rem;
		width: 100%;
	}

	.timeline-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.timeline-label {
		width: 100%;
		font-size: 1.6rem;
		font-weight: 500;
		color: #e7e7e7;
		margin-bottom: 1.5rem;
		white-space: nowrap;
		text-align: left;
	}

	.project-list {
		width: 100%;
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 0.9rem;
		color: #bdbdbd;
		line-height: 1;

		li {
			margin-bottom: 0.6rem;
			padding-left: 0;
			position: relative;
			text-align: left;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	@media (max-width: 968px) {
		padding: 4rem 0;

		h2 {
			font-size: 2rem;
			margin-bottom: 0.5rem;
		}

		h3 {
			font-size: 1rem;
			margin-bottom: 3rem;
		}

		.timeline-container {
			.airplane-icon {
				display: none;
			}
		}

		.timeline-svg {
			display: none;
		}

		.timeline-content-wrapper {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.timeline-item {
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid rgba(255, 255, 255, 0.08);
			border-radius: 12px;
			padding: 1.5rem;
			align-items: flex-start;

			.timeline-label {
				color: #00a8cc;
				margin-bottom: 1rem;
				font-size: 1.4rem;
				padding-bottom: 0.8rem;
				border-bottom: 2px solid rgba(0, 168, 204, 0.3);
			}
		}

		.project-list {
			font-size: 0.9rem;
			line-height: 1.6;

			li {
				margin-bottom: 0.7rem;
				padding-left: 1rem;
				position: relative;

				&::before {
					content: '•';
					position: absolute;
					left: 0;
					color: #00a8cc;
					font-weight: bold;
				}
			}
		}
	}

	@media (max-width: 640px) {
		padding: 3rem 0;

		h2 {
			font-size: 1.6rem;
		}

		h3 {
			font-size: 0.9rem;
			margin-bottom: 2rem;
		}

		.timeline-content-wrapper {
			gap: 1.2rem;
		}

		.timeline-item {
			padding: 1.2rem;

			.timeline-label {
				font-size: 1.2rem;
				margin-bottom: 0.8rem;
				padding-bottom: 0.6rem;
			}
		}

		.project-list {
			font-size: 0.85rem;

			li {
				margin-bottom: 0.6rem;
			}
		}
	}
}
</style>
