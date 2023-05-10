import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
// supabaseから取得したデータをReactQueryのキャッシュの機構を使って管理する為
// ReactQueryの初期設定を作る
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { supabase } from '../utils/supabase'

//webvitalを検知する処理
// Hydrationのスタート時間と終了時間を出す処理
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
      console.log(`FCP: ${Math.round(metric.value * 10) / 10}`)
      break
    case 'LCP':
      console.log(`LCP: ${Math.round(metric.value * 10) / 10}`)
      break
    case 'TTFB':
      console.log(`TTFB: ${Math.round(metric.value * 10) / 10}`)
      break
    case 'Next.js-hydration':
      console.log(
        `Hydration: ${Math.round(metric.startTime * 10) / 10} -> ${
          Math.round((metric.startTime + metric.value) * 10) / 10
        }`
      )
      break
    default:
      break
  }
}

// プロジェクト全体に適用されるデフォルトオプション
// retry => fetchに失敗した場合、何回かrefetchしてくれる機能
// refetchOnWindowFocus　=>userがブラウザにフォーカスをあてた際に
// ReactQueryが自動でsupabaseからfecthを行う機能

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter()
  // validateSession => ログインユーザー毎にページ推移を自動でする機能
  const validateSession = async () => {
    const user = supabase.auth.user()
    if (user && pathname === '/') {
      push('/dashboard')
    } else if (!user && pathname !== '/') {
      await push('/')
    }
  }

  // supabaseにはログインユーザーのセッションの変化を検知する機能がある
  // 例　ユーザーがログアウトすると検知して下記関数を実行する
  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('/dashboard')
    }
    if (event === 'SIGNED_OUT') {
      push('/')
    }
  })
  // 初回マウントされた時に１回行いたい為、第2引数は[]
  useEffect(() => {
    validateSession()
  }, [])

  // プロジェクト全体にReactqueryを適用させる為、プロバイダーで包む

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default MyApp
