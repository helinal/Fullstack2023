import { createAnecdote } from '../request'
import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnec) => {
      queryClient.invalidateQueries('anecdotes')
    
      dispatch({
      type: "SET",
      payload: `anecdote ${newAnec.content} created`
      })
    },
      onError: () => {
        dispatch({
          type: "SET",
          payload: 'too short anecdote, must have length 5 or more'
       })
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes:0})
}

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
