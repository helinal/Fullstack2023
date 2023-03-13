import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ login }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        await login(username, password)
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>username:</Form.Label>
                    <Form.Control
                        id="username"
                        type="text"
                        name="username"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <Form.Label>password:</Form.Label>
                    <Form.Control
                        id="password"
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <br></br>
                    <Button variant="primary" type="submit" id="login-button">
                        login
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginForm
