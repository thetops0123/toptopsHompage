# EmailJS 설정 가이드

문의 폼에서 hyun6993@naver.com으로 이메일을 발송하기 위한 EmailJS 설정 방법입니다.

## 1. EmailJS 계정 생성

1. [EmailJS 웹사이트](https://www.emailjs.com/)에 접속
2. 무료 계정 생성 (월 200건 무료)

## 2. Email Service 연결

1. Dashboard → Email Services 클릭
2. "Add New Service" 클릭
3. Gmail, Outlook 등 원하는 이메일 서비스 선택
4. 이메일 계정 연결 (hyun6993@naver.com 또는 발송용 이메일)
5. Service ID 복사

## 3. Email Template 생성

1. Dashboard → Email Templates 클릭
2. "Create New Template" 클릭
3. 다음 템플릿 내용 입력:

### Template Settings

- **To Email**: `{{to_email}}` (또는 고정값: hyun6993@naver.com)
- **From Name**: THE TOPS 문의
- **Subject**: [THE TOPS] 새로운 문의가 도착했습니다

### Template Content

```
회사명: {{from_company}}
담당자명: {{from_name}}
이메일: {{from_email}}
연락처: {{from_phone}}

문의내용:
{{message}}

---
본 메일은 THE TOPS 홈페이지 문의 폼을 통해 자동 발송되었습니다.
```

4. Template ID 복사

## 4. Public Key 확인

1. Dashboard → Account → General
2. Public Key 복사

## 5. .env 파일 설정

`.env` 파일에 다음 값을 입력:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## 6. 테스트

1. 개발 서버 재시작: `npm run dev`
2. Contact 페이지에서 문의 폼 작성
3. "문의하기" 버튼 클릭
4. hyun6993@naver.com에서 이메일 수신 확인

## 주의사항

- EmailJS 무료 플랜은 월 200건 제한
- .env 파일은 절대 Git에 커밋하지 말 것 (.gitignore에 포함됨)
- Public Key는 클라이언트에 노출되어도 안전 (발송만 가능)
- 스팸 방지를 위해 reCAPTCHA 추가 권장 (선택사항)

## 설정이 완료되지 않은 경우

EmailJS 설정이 완료되지 않아도 폼은 정상 작동하며, 콘솔에 데이터가 출력됩니다.
실제 이메일은 발송되지 않습니다.
