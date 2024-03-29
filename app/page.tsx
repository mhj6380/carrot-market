import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2">
        <div className="relative">
          <span className="text-9xl animate-pulse">🪼</span>
          <span className="text-9xl animate-ping absolute left-0">🪼</span>
        </div>
        <h1 className="text-4xl mt-6">Jelly Fish</h1>
        <h2 className="text-2xl">Welcome.</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link className="primary-btn py-2.5 text-white text-lg" href="/create-account">시작하기</Link>
        <div className="flex gap-y-20">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline underline-offset-4">로그인</Link>
        </div>
      </div>
    </main>
  );
}

// BJXUEXSGPBF8JCNF6JT7Z1Q1
