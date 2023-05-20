import { FormEvent } from 'react'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateNotice } from '../hooks/useMutateNotice'

export const NoticeForm: React.FC = () => {
  const { editedNotice } = useStore()
  const update = useStore((state) => state.updateEditedNotice)
  const { createNoriceMutation, updateNoticeMutation } = useMutateNotice()

  //   editedNoticeが空の場合は、createの関数を実行しnoticeを作成
  //   空じゃなかった場合、updateの関数を実行する
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedNotice.id === '')
      createNoriceMutation.mutate({
        content: editedNotice.content,
        user_id: supabase.auth.user()?.id,
      })
    else {
      updateNoticeMutation.mutate({
        id: editedNotice.id,
        content: editedNotice.content,
      })
    }
  }
  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        placeholder="New notice ?"
        value={editedNotice.content}
        onChange={(e) => update({ ...editedNotice, content: e.target.value })}
      />
      <button
        type="submit"
        className="hober:bg-indigo-700 ml-2 rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white "
      >
        {editedNotice.id ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
