import { useQueryClient, useMutation } from 'react-query'
import { supabase } from '../utils/supabase'
import { Task, EditedTask } from '../types/types'
import useStore from '../store'
import { VariableIcon } from '@heroicons/react/solid'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedTask)
  // タスクを新規作成する関数
  const createTaskMutation = useMutation(
    async (task: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('todos').insert(task)
      if (error) throw new Error(error.message)
      return data
    },
    // タスク作成に成功した時の後処理
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData(['todos'], [...previousTodos, res[0]])
        }
        reset()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  // タスク更新用の処理
  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: task.title })
        .eq('id', task.id)
      if (error) throw new Error(error.message)
      return data
    },
    // 更新成功後の処理
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData(
            ['todos'],
            previousTodos.map((task) =>
              task.id === variables.id ? res[0] : task
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
  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('todos').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData(
            ['todos'],
            previousTodos.filter((task) => task.id !== variables)
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
  return { deleteTaskMutation, createTaskMutation, updateTaskMutation }
}
