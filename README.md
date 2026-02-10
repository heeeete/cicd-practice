# CI/CD Practice   
 
🔗 배포 사이트 - http://158.180.92.47

React + Vite 애플리케이션을 Docker로 컨테이너화하고 Oracle Cloud Infrastructure(OCI)에 자동 배포하는 CI/CD 파이프라인 실습 프로젝트입니다.

## 📋 프로젝트 개요

GitHub Actions를 사용하여 코드 push 시 자동으로 Docker 이미지를 빌드하고 OCIR(Oracle Cloud Infrastructure Registry)에 푸시한 후, SSH를 통해 OCI VM에 배포하는 CI/CD 파이프라인을 구축했습니다.

**추가로 GitHub Actions 워크플로우를 실시간으로 모니터링하는 대시보드를 구현**하여, 배포에 걸린 시간, 실행 시간을 시각화했습니다.

**기술 스택:**
 
- **애플리케이션**: React 19. 2 + Vite 7.2
- **컨테이너**: Docker Multi-stage build (Node.js 22 Alpine → Nginx Alpine)
- **CI/CD**: GitHub Actions
- **레지스트리**: Oracle Cloud Infrastructure Registry (OCIR)
- **배포**: OCI VM
- **데이터 시각화**: Chart.js, react-chartjs-2
- **API**: GitHub REST API (Octokit)

## 📊 대시보드 기능

배포된 사이트에서는 이 저장소의 CI/CD 워크플로우를 실시간으로 모니터링할 수 있습니다.

<!-- 대시보드 스크린샷 -->
<img width="1065" height="882" alt="image" src="https://github.com/user-attachments/assets/17e7c403-7984-4350-bdca-c8397e249420" />


### 주요 기능

#### 1. 요약 카드

- **Current Version**: 최신 성공 빌드 번호 표시
- **Last Deploy**: 마지막 배포 시간 (상대 시간 표시)
- **Success Rate**: 최근 10개 빌드 기준 성공률

#### 2. Recent Workflows

- 최근 5개 워크플로우 실행 내역
- 실행 상태 (진행중/성공/실패) 시각적 표시
- 빌드 번호, 커밋 메시지, 실행 시간 정보
- GitHub Actions 페이지 바로가기 링크

#### 3. Build History Chart

- 최근 10개 빌드의 소요 시간을 라인 차트로 표현
- 빌드 성공/실패 여부를 색상으로 구분

#### 4. Build Time Distribution

- 빌드가 실행된 날짜와 시간대를 버블 차트로 시각화
- 언제 주로 배포가 이루어지는지 패턴 파악 가능

## 🚀 CI/CD 워크플로우

### 트리거

- `main` 브랜치에 push 시 자동 실행

### 파이프라인 단계

```yaml
# .github/workflows/deploy.yml
```

1. **코드 체크아웃** (`actions/checkout@v4`)

   - 저장소 코드를 가져옵니다

2. **Docker Buildx 설정** (`docker/setup-buildx-action@v3`)

   - Docker 이미지 빌드 환경을 구성합니다

3. **환경 변수 확인**

   - OCIR 리전, 사용자명, 이미지 태그를 출력하여 확인합니다

4. **OCIR 로그인** (`docker/login-action@v3`)

   - GitHub Secrets의 인증 정보로 OCIR에 로그인합니다

5. **Docker 이미지 빌드 및 푸시** (`docker/build-push-action@v6`)

   - Dockerfile 기반으로 이미지 빌드
   - OCIR에 `latest` 태그로 푸시

6. **OCI VM 배포 (SSH)**
   - SSH 키로 VM에 접속
   - OCIR에서 최신 이미지 pull
   - 기존 컨테이너(`demo`) 중지 및 삭제
   - 새 컨테이너 실행 (포트 80)

## 🔐 필요한 GitHub Secrets

Settings → Secrets and variables → Actions에서 다음 Secrets를 설정해야 합니다:

| Secret 이름       | 설명                    | 예시                                  |
| ----------------- | ----------------------- | ------------------------------------- |
| `OCIR_REGION`     | OCIR 리전 엔드포인트    | `ap-chuncheon-1.ocir.io`              |
| `OCIR_NAMESPACE`  | OCI 테넌시 네임스페이스 | `your-namespace`                      |
| `OCIR_REPO_NAME`  | OCIR 저장소 이름        | `cicd-project`                        |
| `OCIR_USERNAME`   | OCIR 사용자명           | `<namespace>/<username>`              |
| `OCIR_PASSWORD`   | OCIR Auth Token         | `your-auth-token`                     |
| `SSH_HOST`        | 배포 대상 VM의 IP 주소  | `123.456.78.90`                       |
| `SSH_USER`        | SSH 접속 사용자명       | `ubuntu`                              |
| `SSH_PRIVATE_KEY` | SSH 개인키 (PEM 형식)   | `-----BEGIN RSA PRIVATE KEY-----... ` |

## 🐳 Docker Multi-stage Build

**Dockerfile 구조:**

### 1단계: 빌드

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```

- Vite로 프로덕션 빌드 수행
- `dist` 폴더 생성

### 2단계: 실행

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- 빌드된 정적 파일만 Nginx 이미지에 복사
- Node.js 및 소스 코드는 최종 이미지에 포함되지 않음

## 📦 프로젝트 구조

```
cicd-practice/
├── . github/
│   └── workflows/
│       └── deploy. yml          # CI/CD 파이프라인 정의
├── Dockerfile                  # Multi-stage 빌드 설정
├── nginx.conf                  # Nginx 설정 (SPA 라우팅)
└── (React + Vite 프로젝트 파일들)
```

## 🛠️ 로컬 실행

### 개발 모드

```bash
npm install
npm run dev
```

### Docker로 실행

```bash
docker build -t cicd-practice .
docker run -d -p 80:80 cicd-practice
```

## 📚 학습 포인트

이 프로젝트를 통해 다음을 학습할 수 있습니다:

- ✅ GitHub Actions 워크플로우 작성
- ✅ GitHub Secrets를 활용한 인증 정보 관리
- ✅ Docker 이미지 자동 빌드 및 레지스트리 푸시
- ✅ SSH를 통한 원격 서버 배포 자동화
- ✅ Oracle Cloud Infrastructure (OCI) 연동

---
