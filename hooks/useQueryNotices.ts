import { useQuery } from 'react-query'
import { supabase } from '../utils/supabase'
import { Notice } from '../types/types'

// supabaseにフェッチをする為の関数
export const useQueryNotices = () => {
  const getNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`${error.message}:${error.details}`)
    }
    return data
  }
  // カスタムフックの返り値
  //   noticesは他ユーザーの追加したデータを反映させたい為、staleTimeを0にしてフェッチを行う
  return useQuery<Notice[], Error>({
    queryKey: ['notices'],
    queryFn: getNotices,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
}
