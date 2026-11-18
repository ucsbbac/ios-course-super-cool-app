import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const QUESTION_TEXTS = [
  '你今天感到焦慮或緊張嗎？',
  '你最近睡眠品質如何？',
  '你是否覺得事情太多、很難放鬆？',
  '你是否容易生氣、難過或情緒不穩？',
  '你是否感到身體疲累、頭痛或胸悶？',
];

const SCALE_LABELS = ['沒有', '輕微', '普通', '明顯', '嚴重', '非常嚴重'];

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: '伺服器未設定 API 金鑰，請聯繫管理員。' }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '請求格式錯誤。' }, { status: 400 });
  }

  const { answers } = body ?? {};

  // Validate the five scale answers
  for (let i = 1; i <= 5; i++) {
    const val = answers?.[`q${i}`];
    if (val === null || val === undefined || typeof val !== 'number' || val < 0 || val > 5) {
      return NextResponse.json({ error: '問卷回答不完整，請回答所有題目。' }, { status: 400 });
    }
  }

  const totalScore = [1, 2, 3, 4, 5].reduce((sum, i) => sum + answers[`q${i}`], 0);

  const answerSummary = QUESTION_TEXTS.map((q, i) => {
    const val = answers[`q${i + 1}`];
    return `${i + 1}. ${q} → ${SCALE_LABELS[val]}（${val} 分）`;
  }).join('\n');

  const stressSourceLine = answers.q6?.trim()
    ? `\n用戶填寫的主要壓力來源：${answers.q6.trim()}`
    : '';

  const systemPrompt =
    '你是一位溫暖、善解人意、不評判的壓力管理助理。你的語氣要溫暖、平靜、支持、正向，絕對不像醫療診斷。所有回應必須使用繁體中文。';

  const userPrompt = `請根據以下壓力問卷結果，提供個人化的壓力分析。

問卷回答（0=沒有，5=非常嚴重）：
${answerSummary}${stressSourceLine}

問題總分：${totalScore}/25

請以下列 JSON 格式回應，不加任何額外文字：
{
  "stressLevel": "低",
  "sources": "根據回答具體分析可能的壓力來源（2-3句話）",
  "bodyReminder": "根據回答提醒用戶注意的身體或情緒訊號（2-3句話）",
  "relaxMethods": [
    "具體放鬆方法一",
    "具體放鬆方法二",
    "具體放鬆方法三"
  ],
  "encouragement": "一句溫暖正向的鼓勵話語",
  "seekHelp": null
}

stressLevel 判斷標準：
- 低：總分 0–8，且無明顯單題高分
- 中：總分 9–15，或有 1–2 個明顯高分單項
- 高：總分 16–25，或多題嚴重/非常嚴重

seekHelp 規則：若 stressLevel 為「高」，填入溫暖提醒使用者尋求家人、朋友或專業心理協助的話語；否則填 null。`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.75,
      max_tokens: 900,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('AI 回應格式錯誤，請再試一次。');
      }
    }

    const result = {
      stressLevel: ['低', '中', '高'].includes(parsed.stressLevel) ? parsed.stressLevel : '中',
      sources: String(parsed.sources ?? ''),
      bodyReminder: String(parsed.bodyReminder ?? ''),
      relaxMethods: Array.isArray(parsed.relaxMethods)
        ? parsed.relaxMethods.slice(0, 3).map(String)
        : [],
      encouragement: String(parsed.encouragement ?? ''),
      seekHelp: parsed.seekHelp ? String(parsed.seekHelp) : null,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('Stress analysis error:', err);
    return NextResponse.json(
      { error: '伺服器發生錯誤，請稍後再試。' },
      { status: 500 }
    );
  }
}
