import './globals.css';

export const metadata = {
  title: 'AI 壓力檢測小幫手',
  description: '回答六個問題，讓 AI 為你分析壓力狀態，照顧你的心理健康',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
