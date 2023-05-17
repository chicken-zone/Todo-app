import { useQueryClient, useMutation } from 'react-query'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { Notice, EditedNotice } from '../types/types'

export const useMutateNotice = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedNotice)
  const createNoriceMutation = useMutation(
    async (notice: Omit<Notice, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('notices').insert(notice)
      if (error) throw new Error(error.message)
      return data
    },
    // タスク作成に成功した時の後処理
    {
      onSuccess: (res) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData(['notices'], [...previousNotices, res[0]])
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )

  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .update({ content: notice.content })
        .eq('id', notice.id)
      if (error) throw new Error(error.message)
      return data
    },
    // 更新成功後の処理
    {
      onSuccess: (res, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData(
            ['notices'],
            previousNotices.map((notice) =>
              notice.id === variables.id ? res[0] : notice
            )
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  // 引数で削除したいタスクのIDを受け取る
  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData(
            ['notices'],
            previousNotices.filter((notice) => notice.id !== variables)
          )
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { deleteNoticeMutation, createNoriceMutation, updateNoticeMutation }
}
