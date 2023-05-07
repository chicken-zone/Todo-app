import type { NextPage } from 'next'
import { Layout } from '../components/Layout'

// Layoutコンポーネントはtitleを渡すことが出来る
// なんらかのchildrenを渡さないとエラーとなる
const Home: NextPage = () => {
  return <Layout title="Home">{'hello'}</Layout>
}

export default Home
