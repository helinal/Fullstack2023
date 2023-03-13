import { useState, useEffect } from "react"
import axios from "axios"

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const getAll = async () => {
      const res = await axios.get(baseUrl)
      setResources(res.data)
    }

    getAll()
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const res = await axios.post(baseUrl, resource)
      setResources(resources.concat(res.data))
    } catch (error) {
      console.log(error.response.data)
    }
  }

  const service = {
    create
  }

  return [resources, service]
}

export default useResource