자체 서버에서 구동중인 백엔드 테스트를 위해 local에서 진행.
zerorpc node 14.6.1에서 설치 불가.
14.17.6 > 10.24.1로 다운그레이드 후 테스트.
zerorpc 대체 프로그램 서치 중.(tcp방식)
zerorpc 유지
flutter 웹앱과 통신하는 API 구현 및 테스트 완료.

테스트 배포에서 문제 발생하지 않음.
AWS로 배포예정.

배포 완료. (서버는 서버컴으로 직접 배포, 클라이언트는 aws로 라우팅)

https 사용을 위해 ssl 발급 절차 진행. (완료) letsencrypt 이용 ssl발급 및 greenlook-express로 자동 갱신 진행.
