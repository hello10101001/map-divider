# 지도 영역 분할 계산기 — Android 태블릿 앱 빌드 저장소

`www/` 폴더의 웹앱(지도 영역 드래그 → 면적 계산 → 구획 분할 → GPS 최장거리 찾기)을
[Capacitor](https://capacitorjs.com/)로 감싸서 **Android 태블릿용** APK로 빌드하기 위한 저장소입니다.
실제 APK 빌드는 로컬이 아니라 **GitHub Actions**(GitHub의 빌드 서버)에서 자동으로 실행됩니다.

## 이번에 고친 버그

- **GPS 권한 누락**: `navigator.geolocation`(웹 GPS API)을 쓰는데, Capacitor가 자동 생성하는
  Android 프로젝트에는 위치 권한이 기본으로 안 들어있어 앱에서 GPS 기능이 항상 실패하던 문제.
  → `@capacitor/geolocation` 플러그인을 의존성에 추가해 빌드 시 위치 권한이
  Android 매니페스트에 자동으로 병합되도록 수정.
- **세로모드 강제 고정**: `manifest.json`의 `orientation: "portrait-primary"` 때문에
  태블릿에서도 가로 회전이 막혀있던 문제. → `"any"`로 변경해 가로/세로 모두 허용.
- **태블릿이 좁은 폰 레이아웃으로 잡히던 문제**: 지도 전체화면 + 하단 시트 패널(폰 전용 UI)이
  태블릿 화면(보통 700px 이상)에도 적용되던 미디어쿼리 기준(760px)을 600px로 좁혀서,
  태블릿에서는 데스크톱과 같은 넓은 사이드 패널 레이아웃이 나오도록 수정.

## 사용 방법

1. **새 GitHub 저장소 생성**
   - github.com에서 New repository → 이름 아무거나(예: `map-area-divider`) → Create.

2. **이 폴더 전체를 그대로 push**
   ```bash
   cd 이-폴더의-압축을-푼-경로
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/내계정/map-area-divider.git
   git push -u origin main
   ```

3. **Actions 탭에서 빌드 확인**
   - push하면 `.github/workflows/build-apk.yml` 워크플로우가 자동으로 실행됩니다.
   - 저장소의 **Actions** 탭 → 방금 실행된 워크플로우 클릭 → 완료(초록 체크)될 때까지 대기(보통 3~6분).
   - 자동으로 안 돌아가면 Actions 탭 → 워크플로우 선택 → **Run workflow** 버튼으로 수동 실행 가능.

4. **APK 다운로드**
   - 완료된 워크플로우 실행 화면 맨 아래 **Artifacts** 섹션에 `map-area-divider-debug-apk`가 있습니다.
   - 클릭해서 다운로드하면 zip 파일이 받아지고, 그 안에 `app-debug.apk`가 들어있습니다.

5. **안드로이드 태블릿에 설치**
   - `app-debug.apk`를 태블릿으로 전송(카카오톡 나에게 보내기, 이메일, USB 등 아무 방법이나 OK)
   - 태블릿에서 파일을 열면 "출처를 알 수 없는 앱" 설치 허용을 한 번 물어봅니다 → 허용 후 설치.
   - 첫 실행 후 GPS 기능(4번 섹션) 사용 시 위치 권한 요청이 뜨면 허용해주세요.

## 참고 사항

- 이 워크플로우는 **디버그 APK**를 만듭니다. 개인적으로 설치해서 쓰기엔 충분하지만,
  구글 플레이스토어에 올리려면 릴리즈 서명 키를 만들어 GitHub Secrets에 등록하고
  워크플로우를 `assembleRelease`로 바꾸는 과정이 추가로 필요합니다.
- 앱 아이디(`com.mapdivider.app`)나 앱 이름은 `capacitor.config.json`에서 바꿀 수 있습니다.
- `android/` 폴더는 저장소에 커밋하지 않고, 빌드할 때마다 Actions가 새로 생성합니다.
  아이콘/스플래시 화면 등을 세밀하게 커스터마이즈하고 싶다면 이 폴더를 직접 만들어
  저장소에 포함시키고 워크플로우에서 `cap add android` 단계를 지우면 됩니다.
- GPS(내 위치 찾기) 기능은 앱 설치 후 최초 실행 시 위치 권한을 허용해야 동작합니다.
