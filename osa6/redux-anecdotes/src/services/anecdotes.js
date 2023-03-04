import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
    const object = {content, votes:0}
    const response = await axios.post(baseUrl, object)
    return response.data
}

const update = async (content) => {
    const id = content.id
    const url = `http://localhost:3001/anecdotes/${id}`
    return await axios.put(url, content)
}

export default { getAll, createNew, update }