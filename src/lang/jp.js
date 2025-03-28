export default {
  home: {
    WalletBalance: "ウォレット残高",
    prizePool: "プライズプール",
    totalPrizePool: "総賞金額",
    NextDrawOpenIn: "次回抽選開始まで",
    AvailableRewards: "受け取り可能な報酬",
    ClaimNow: "今すぐ受け取る",
    Savings: "貯蓄残高",
    LotteryWinnings: "抽選賞金",
    JoinNow: "今すぐ参加",
    WalletDetails: "ウォレット詳細",
  },
  deposit: {
    YourKAIAAddress: "KAIAウォレットアドレス",
    addressTip: "このアドレスを使用してトークンを受け取れます",
    Share: "共有",
    DepositAddress: "入金アドレス",
    TXID: "取引ID",
    Time: "日時",
  },
  email: {
    Save: "保存",
    PleaseEnterEmailAddress: "メールアドレスを入力してください",
  },
  pool: {
    Go: "移動",
    DailyPool: "デイリープール",
    JackpotTitle: "100万円ジャックポット",
    USDPool: "USDプール",
    PreviousWinners: "過去の当選者",
    CurrentPrizePool: "現在の賞金額",
    YourTickets: "保有チケット数",
    USDDeposit: "USD入金",
    KAIADeposit: "KAIA入金",
    KAIAPool: "KAIAプール",
    Tier: "ティア",
    withdrawInfo: "収益はホーム画面のウォレット残高で確認可能です",
    amountTip: "金額を入力してください",
    DailyPoolTip: "元本保証・いつでも引き出し可能。収益の50%がデイリープール、50%がジャックポットに自動配分されます",
    YourCurrentSavings: "現在の貯蓄額",
    ReminderMessage: "リマインダー",
    PupUpsUpdate: "ポップアップミッション更新！",
    PupUpsUpdateTip: "新規ポップアップミッションを追加（バッジ総数2,000個）",
    LuckySavingsGoesToV1Point1: "LuckySavings v1.1 リリース！",
    urlTip: "詳細はこちら：http://blababalbala",
    TheAmountExceedsTheAvailableBalance: "利用可能残高を超えています",
  },
  ranking: {
    YourRanking: "あなたの順位",
    Place: "順位",
    Name: "名前",
    TipText: "ランキングは週次更新です",
  },
  router: {
    Home: "ホーム",
    Withdraw: "出金",
  },
  rewards: {
    YourAchievements: "実績リスト",
    DailyTasks: "デイリーミッション",
    Popups: "ポップアップミッション",
    MoreTasks: "追加ミッション",
    msgTip1: "ポイントとバッジはプラットフォーム正式公開後に交換可能になります",
    msgTip2: "毎日00:00（UTC+0）にリセット",
    msgTip3: "※1回限りミッションは再実行不可、随時更新されます",
  },
  swap: {
    PlaceholderAmount: "0.00",
    ToEstimate: "受取予定数量",
    Slippage: "スリッページ：0.1%～0.5%",
    InsufficientBalance: "残高不足",
  },
  withdraw: {
    SelectTokens: "トークン選択",
    EnterAmount: "金額入力",
    WithdrawAddress: "出金アドレス",
    Next: "次へ",
  },
  common: {
    Withdraw: "出金",
    WalletAddress: "ウォレットアドレス",
    Close: "閉じる",
    GotIt: "確認",
    cancel: "キャンセル",
    Swap: "スワップ",
    Pool: "プール",
    Rewards: "報酬",
    Ranking: "ランキング",
    Profile: "プロフィール",
    From: "送金元",
    Max: "最大",
    Address: "アドレス",
    Available: "利用可能額",
    Email: "メール",
    Amount: "金額",
    Balance: "残高",
    Deposit: "入金",
    DepositHistory: "入金履歴",
    DepositHistory2: "入金履歴",
    Error: "エラー",
    NetworkError: "ネットワークエラー",
    NetworkErrorMsg: "通信エラーが発生しました。再度お試しください",
    CopySuccess: "コピー完了",
    Claim: "受け取る",
    USDT: "USDT",
    KAIA: "KAIA",
    ScanSuccess: "スキャン成功",
    Badges: "バッジ",
    Points: "ポイント",
    GasFee: "ガス代",
  },
  profile: {
    Nickname: "ニックネーム",
    TermsOfUse: "利用規約",
    PrivacyPolicy: "プライバシーポリシー",
    Support: "サポート",
    Version: "バージョン情報",
    WalletAddress: "ウォレットアドレス",
    Disconnect: "接続解除",
  },
  GameplayDialog: {
    title1: "デイリープールの仕組み",
    content1: `
    <p>1. USD/KAIAプールの抽選は毎日20:00（UTC+0）に実施</p>
    <p>2. 元本保証・いつでも出金可能</p>
    <p>3. 預入金額はXYZプロトコルで運用され、賞金プールとチケットが生成されます</p>
    <p>4. 収益の50%がデイリープール、50%がジャックポットに自動配分</p>
    <p>5. 預入額に応じてチケット数が増加（スマートコントラクトによる自動計算）</p>
    <p>6. 出金しない限り、残高は自動的に次回プールへ繰越</p>`,
    warning1: `KAIAチェーンのステーキングルールにより、KAIAプールからの出金には7日間のロック期間が発生する場合があります`,
    title2: "ジャックポットの仕組み",
    content2: `
      <p>1. ジャックポットが$10,000に達した時点で即時抽選</p>
      <p>2. 元本保証・いつでも出金可能</p>
      <p>3. 収益の50%がデイリープール、50%がジャックポットに自動配分</p>
      <p>4. 預入額に比例してチケット数増加</p>
      <p>5. 出金しない限り、残高は次回プールへ自動繰越</p>`,
    warning2: `KAIAチェーンのステーキングルールにより、KAIAプールからの出金には7日間のロック期間が発生する場合があります`,
  },
  networkError: {
    message: "ネットワーク接続エラー",
    description: "通信環境をご確認の上、Wi-Fi接続またはモバイル通信へ切り替えてください",
    Reload: "再読み込み",
  },
};
