'use client';

import { useState } from 'react';

const SCALE_QUESTIONS = [
  { id: 'q1', text: '你今天感到焦慮或緊張嗎？' },
  { id: 'q2', text: '你最近睡眠品質如何？' },
  { id: 'q3', text: '你是否覺得事情太多、很難放鬆？' },
  { id: 'q4', text: '你是否容易生氣、難過或情緒不穩？' },
  { id: 'q5', text: '你是否感到身體疲累、頭痛或胸悶？' },
];

const SCALE_LABELS = ['沒有', '輕微', '普通', '明顯', '嚴重', '非常嚴重'];

const STRESS_STYLE = {
  低: 'bg-green-100 text-green-700 border-green-300',
  中: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  高: 'bg-red-100 text-red-700 border-red-300',
};

function ScaleSelector({ questionId, value, onChange }) {
  return (
    <div className="mt-3">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            aria-label={`${num} - ${SCALE_LABELS[num]}`}
            onClick={() => onChange(questionId, num)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold border-2 transition-all active:scale-95 ${
              value === num
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-500'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1.5 px-0.5">
        <span>沒有</span>
        <span>非常嚴重</span>
      </div>
      {value !== null && (
        <p className="text-xs text-indigo-600 font-medium mt-1 text-right">
          已選：{SCALE_LABELS[value]}
        </p>
      )}
    </div>
  );
}

function ResultCard({ title, children, accent }) {
  return (
    <section className={`rounded-xl p-4 ${accent}`}>
      <h3 className="text-xs font-bold uppercase tracking-wide mb-2 opacity-70">{title}</h3>
      {children}
    </section>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}

const DISCLAIMER =
  '本工具僅供自我覺察與壓力管理參考，不能取代醫師、心理師或專業醫療建議。';

export default function StressChecker() {
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScale = (qid, val) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unanswered = SCALE_QUESTIONS.find((q) => answers[q.id] === null);
    if (unanswered) {
      setError('請回答所有 5 個題目後再提交！');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '分析失敗，請稍後再試。');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({ q1: null, q2: null, q3: null, q4: null, q5: null, q6: '' });
    setResult(null);
    setError(null);
  };

  /* ── Result screen ── */
  if (result) {
    const badgeStyle = STRESS_STYLE[result.stressLevel] ?? STRESS_STYLE['中'];
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-indigo-700">AI 壓力檢測小幫手</h1>
            <p className="text-xs text-gray-400 mt-1">你的壓力分析報告</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Stress level banner */}
            <div className="px-6 py-5 text-center border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-2">目前壓力狀態</p>
              <span className={`inline-block px-8 py-2 rounded-full text-2xl font-bold border-2 ${badgeStyle}`}>
                {result.stressLevel}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <ResultCard title="可能壓力來源" accent="bg-purple-50 text-purple-800">
                <p className="text-gray-700 text-sm leading-relaxed">{result.sources}</p>
              </ResultCard>

              <ResultCard title="身體與情緒提醒" accent="bg-blue-50 text-blue-800">
                <p className="text-gray-700 text-sm leading-relaxed">{result.bodyReminder}</p>
              </ResultCard>

              <ResultCard title="三個立即可做的放鬆方法" accent="bg-emerald-50 text-emerald-800">
                <ol className="space-y-2 mt-1">
                  {result.relaxMethods?.map((method, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-700 leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      {method}
                    </li>
                  ))}
                </ol>
              </ResultCard>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  「{result.encouragement}」
                </p>
              </div>

              {result.seekHelp && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1.5">
                    重要提醒
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{result.seekHelp}</p>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center leading-relaxed pt-1">
                {DISCLAIMER}
              </p>

              <button
                onClick={handleReset}
                className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 font-semibold rounded-xl py-3 text-sm transition-colors mt-1"
              >
                再測一次
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Questionnaire screen ── */
  const answered = SCALE_QUESTIONS.filter((q) => answers[q.id] !== null).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-indigo-700 mb-1.5">AI 壓力檢測小幫手</h1>
          <p className="text-gray-500 text-sm">回答六個問題，讓 AI 為你分析壓力狀態</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
            <span>壓力問卷</span>
            <span>{answered} / {SCALE_QUESTIONS.length} 題已回答</span>
          </div>

          {SCALE_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="mb-7">
              <p className="text-gray-800 font-medium text-sm leading-snug">
                <span className="text-indigo-500 font-bold mr-1">{idx + 1}.</span>
                {q.text}
              </p>
              <ScaleSelector
                questionId={q.id}
                value={answers[q.id]}
                onChange={handleScale}
              />
            </div>
          ))}

          {/* Open question */}
          <div className="mb-6 pt-1 border-t border-gray-100">
            <p className="text-gray-800 font-medium text-sm mt-4 mb-2">
              <span className="text-indigo-500 font-bold mr-1">6.</span>
              今天最主要的壓力來源是什麼？
              <span className="text-gray-400 font-normal ml-1 text-xs">（選填）</span>
            </p>
            <textarea
              value={answers.q6}
              onChange={(e) => setAnswers((prev) => ({ ...prev, q6: e.target.value }))}
              placeholder="例如：工作截止日、家庭問題、健康擔憂…"
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 resize-none placeholder-gray-300 leading-relaxed"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white font-semibold rounded-xl py-3.5 text-sm transition-colors shadow-md shadow-indigo-100 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                分析中，請稍候...
              </span>
            ) : (
              '送出並獲得 AI 分析'
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
            {DISCLAIMER}
          </p>
        </form>
      </div>
    </main>
  );
}
