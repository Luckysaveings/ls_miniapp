export default {
  home: {
    WalletBalance: "지갑 잔액",
    prizePool: "프라이즈 풀",
    totalPrizePool: "총 상금 규모",
    NextDrawOpenIn: "다음 추첨까지 남은 시간",
    AvailableRewards: "수령 가능 보상",
    ClaimNow: "지금 받기",
    Savings: "적립 금액",
    LotteryWinnings: "추첨 상금",
    JoinNow: "지금 참여하기",
    WalletDetails: "지갑 상세 정보",
  },
  deposit: {
    YourKAIAAddress: "KAIA 지갑 주소",
    addressTip: "해당 주소로 토큰을 받을 수 있습니다",
    Share: "공유",
    DepositAddress: "입금 주소",
    TXID: "트랜잭션 ID",
    Time: "시간",
  },
  email: {
    Save: "저장",
    PleaseEnterEmailAddress: "이메일 주소를 입력해 주세요",
  },
  pool: {
    Go: "이동",
    DailyPool: "데일리 풀",
    JackpotTitle: "1만 달러 잭팟",
    USDPool: "USD 풀",
    PreviousWinners: "이전 당첨자",
    CurrentPrizePool: "현재 상금 규모",
    YourTickets: "보유 티켓",
    USDDeposit: "USD 입금",
    KAIADeposit: "KAIA 입금",
    KAIAPool: "KAIA 풀",
    Tier: "티어",
    withdrawInfo: "수익은 홈 화면 지갑 잔액에서 확인 가능합니다",
    amountTip: "금액을 입력해 주세요",
    DailyPoolTip: "원금 보장 및 언제든 출금 가능, 수익의 50%는 데일리 풀과 잭팟에 자동 분배됩니다",
    YourCurrentSavings: "현재 적립 금액",
    ReminderMessage: "알림 메시지",
    PupUpsUpdate: "팝업 미션 업데이트!",
    PupUpsUpdateTip: "새로운 팝업 미션 추가 (배지 총 2,000개)",
    LuckySavingsGoesToV1Point1: "LuckySavings v1.1 버전 출시!",
    urlTip: "자세한 내용: http://blababalbala",
    TheAmountExceedsTheAvailableBalance: "잔액을 초과하는 금액입니다",
  },
  ranking: {
    YourRanking: "나의 순위",
    Place: "순위",
    Name: "이름",
    TipText: "주간 순위 업데이트",
  },
  router: {
    Home: "홈",
    Withdraw: "출금",
  },
  rewards: {
    YourAchievements: "업적 목록",
    DailyTasks: "일일 미션",
    Popups: "팝업 미션",
    MoreTasks: "추가 미션",
    msgTip1: "포인트와 배지는 플랫폼 정식 오픈 후 교환 가능",
    msgTip2: "매일 00:00(UTC+0) 초기화",
    msgTip3: "※1회성 미션은 재진행 불가, 주기적 업데이트",
  },
  swap: {
    PlaceholderAmount: "0.00",
    ToEstimate: "예상 수량",
    Slippage: "슬리피지: 0.1%~0.5%",
    InsufficientBalance: "잔액 부족",
  },
  withdraw: {
    SelectTokens: "토큰 선택",
    EnterAmount: "금액 입력",
    WithdrawAddress: "출금 주소",
    Next: "다음",
  },
  common: {
    Withdraw: "출금",
    WalletAddress: "지갑 주소",
    Close: "닫기",
    GotIt: "확인",
    cancel: "취소",
    Swap: "스왑",
    Pool: "풀",
    Rewards: "보상",
    Ranking: "순위",
    Profile: "프로필",
    From: "출처",
    Max: "최대",
    Address: "주소",
    Available: "사용 가능",
    Email: "이메일",
    Amount: "금액",
    Balance: "잔액",
    Deposit: "입금",
    DepositHistory: "입금 내역",
    DepositHistory2: "입금 내역",
    Error: "오류",
    NetworkError: "네트워크 오류",
    NetworkErrorMsg: "네트워크 연결 상태를 확인해 주세요",
    CopySuccess: "복사 완료",
    Claim: "받기",
    USDT: "USDT",
    KAIA: "KAIA",
    ScanSuccess: "스캔 성공",
    Badges: "배지",
    Points: "포인트",
    GasFee: "가스비",
  },
  profile: {
    Nickname: "닉네임",
    TermsOfUse: "이용약관",
    PrivacyPolicy: "개인정보처리방침",
    Support: "고객지원",
    Version: "버전 정보",
    WalletAddress: "지갑 주소",
    Disconnect: "연결 해제",
  },
  GameplayDialog: {
    title1: "데일리 풀 운영 방식",
    content1: `
    <p>1. USD/KAIA 풀 추첨은 매일 20:00(UTC+0) 진행</p>
    <p>2. 원금 보장 및 언제든 출금 가능</p>
    <p>3. 예치금은 XYZ 프로토콜을 통해 수익을 생성하며 상금 풀과 티켓 발행에 사용</p>
    <p>4. 수익의 50%는 데일리 풀, 50%는 잭팟에 자동 분배</p>
    <p>5. 예치 금액에 비례하여 티켓 수 증가 (스마트 계약 자동 계산)</p>
    <p>6. 미출금 시 자동 차기 풀로 롤오버</p>`,
    warning1: `KAIA 체인의 스테이킹 규정으로 인해 KAIA 풀 출금 시 7일간의 락업 기간 발생 가능`,
    title2: "잭팟 운영 방식",
    content2: `
      <p>1. 잭팟 1만 달러 달성 즉시 추첨</p>
      <p>2. 원금 보장 및 언제든 출금 가능</p>
      <p>3. 수익의 50%는 데일리 풀, 50%는 잭팟에 자동 분배</p>
      <p>4. 예치 금액 비례 티켓 수 증가</p>
      <p>5. 미출금 시 자동 차기 풀로 롤오버</p>`,
    warning2: `KAIA 체인의 스테이킹 규정으로 인해 KAIA 풀 출금 시 7일간의 락업 기간 발생 가능`,
  },
  networkError: {
    message: "네트워크 연결 오류",
    description: "Wi-Fi 재연결 또는 모바일 데이터로 전환 후 다시 시도해 주세요",
    Reload: "새로고침",
  },
};
