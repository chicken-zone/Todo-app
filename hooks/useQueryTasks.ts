import { useQuery } from 'react-query'
import { supabase } from '../utils/supabase'
import { Task } from '../types/types'

// supabaseにフェッチをする為の関数
export const useQueryTasks = () => {
  const getTasks = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }
    return data
  }
  // カスタムフックの返り値
  return useQuery<Task[], Error>({
    queryKey: ['todos'],
    queryFn: getTasks,
    staleTime: Infinity,
  })
}
