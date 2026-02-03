# THE TOPS Homepage

THE TOPS 공식 홈페이지 - 드론 촬영 및 영상 제작 전문 업체

## 🚀 기술 스택

- **Frontend**: Vue 3.5.24 (Composition API)
- **Build Tool**: Vite 6.0.11
- **Styling**: SCSS
- **Database**: Supabase (PostgreSQL)
- **Image Storage**: Cloudinary
- **Routing**: Vue Router 4.5.0

## 📋 주요 기능

### 사용자 페이지
- **메인 페이지**: 비디오 배경과 서비스 소개
- **About**: 회사 소개
- **History**: 회사 연혁 (애니메이션 효과)
- **Rental**: 장비 대여 서비스 (Lazy Load 지원)
- **Portfolio**: 포트폴리오 갤러리 (Lazy Load 지원)
- **Contact**: 문의하기
- **이미지 모달**: 슬라이드 뷰어 (확대/축소, 네비게이션, 애니메이션)
- **로딩 스크린**: 초기 페이지 로드 시 우아한 로딩 애니메이션

### 관리자 페이지
- **인증 시스템**: 로그인 기반 접근 제어
- **Rental 관리**: 장비 등록/수정/삭제, 이미지 업로드, 메인 표시 제어
- **Portfolio 관리**: 포트폴리오 등록/수정/삭제, 이미지 업로드, 메인 표시 제어
- **로딩 오버레이**: 저장 중 프로그레스바 표시

## 🎨 주요 애니메이션

- 모달 오픈/클로즈 애니메이션 (Scale + Fade)
- 스크롤 기반 Fade-up 애니메이션 (Intersection Observer)
- History 섹션 Airplane 아이콘 Float 애니메이션
- 로딩 스피너 애니메이션 (3중 회전 링)
- 페이지 전환 시 스크롤 리셋

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

## 🗄️ 데이터베이스 구조

### Rentals 테이블
- `id`: UUID (Primary Key)
- `category`: VARCHAR (장비 카테고리)
- `name`: VARCHAR (장비 이름)
- `price`: VARCHAR (대여 가격)
- `images`: TEXT[] (이미지 URL 배열)
- `show_on_home`: BOOLEAN (메인 페이지 표시 여부)
- `created_at`: TIMESTAMP

### Portfolios 테이블
- `id`: UUID (Primary Key)
- `category`: VARCHAR (작업 카테고리)
- `title`: VARCHAR (작업 제목)
- `images`: TEXT[] (이미지 URL 배열)
- `show_on_home`: BOOLEAN (메인 페이지 표시 여부)
- `created_at`: TIMESTAMP

## 🎯 페이지 구조

```
/                   - 메인 페이지
/about              - About
/history            - History
/rental             - Rental (전체 목록)
/portfolio          - Portfolio (전체 목록)
/contact            - Contact
/topsvisual         - Tops Visual
/admin              - 관리자 페이지 (인증 필요)
```

## 💡 특징

- **반응형 디자인**: 모든 디바이스에서 최적화된 UI
- **Lazy Loading**: Intersection Observer를 사용한 효율적인 이미지 로딩
- **SCSS 구조화**: BEM 방식의 중첩 선택자로 유지보수 용이
- **Vue 3 Composition API**: 최신 Vue 패턴 사용
- **애니메이션 최적화**: GPU 가속을 활용한 부드러운 애니메이션
- **SEO 친화적**: 시맨틱 HTML 구조

## 📝 라이센스

Private Project

## 👥 Contact

THE TOPS - 드론 촬영 및 영상 제작 전문 업체
