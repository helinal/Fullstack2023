import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './request'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes +=1})
    dispatch({
      type: "SET",
      payload: `anecdote ${anecdote.content} voted`
    })
  }

  const result = useQuery(
    'anecdotes', getAnecdotes, {
      refetchOnWindowFocus: false,
      retry: 1
    }
  )
    if (result.isLoading) {
      return <div>loading data...</div>
    }

    if (result.isError) {
      return <div>anecdote service not available due to problems in server</div>
    }

  const anecdotes = result.data

  return (
    <>
      <h3>Anecdote app</h3>

      <Notification />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}

      <AnecdoteForm />
    </>
  )
}

export default App