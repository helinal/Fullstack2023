import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    const filter = state.filter
    return state.anecdotes.filter(anecdote => anecdote.content.includes(filter))
  })

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    //const notification = `you voted '${anecdote.content}'`
    //dispatch({type: 'notification/setNotification', payload: notification})
  }
  
    return(
      <div>
        {anecdotes
        .sort((i, y) => y.votes-i.votes)
        .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
      </div>
    )
  }

export default Anecdotes