import { useDispatch } from 'react-redux'

const NewAnecdote = () => {
    const dispatch = useDispatch()
  
    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        dispatch({type: 'anecdotes/createAnecdote', payload: content})
        event.target.anecdote.value=''
    }
  
    return (
     <>
        <h2>Create new</h2>
        
        <form onSubmit={addAnecdote}>
            <div><input name="anecdote" /></div>
            <button type="submit">create</button>
        </form>
     </>
    )
  }
  
  export default NewAnecdote