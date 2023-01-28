import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    console.log('Good value:', updatedGood)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    console.log('Neutral value:', updatedNeutral)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    console.log('Bad value:', updatedBad)
  }

  return (
    <>
      <h1>Give feedback</h1>
      <Button handleClick={handleGoodClick} text='good'/>
      <Button handleClick={handleNeutralClick} text='neutral'/>
      <Button handleClick={handleBadClick} text='bad'/>

      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad

  if (good+neutral+bad === 0) {
    return (
      <>
        No feedback given yet :(
      </>
    )
  }
  return (
    <>
      <table>
        <tbody>
        <StatisticsLine text="Good" value={good}/>
        <StatisticsLine text="Neutral" value={neutral}/>
        <StatisticsLine text="Bad" value={bad}/>
        <StatisticsLine text="All" value={good+neutral+bad}/>
        <StatisticsLine text="Average" value={(good-bad)/(good+neutral+bad)}/>
        <StatisticsLine text="Positive" value={good/(good+neutral+bad)*100}/>
        </tbody>
      </table>
    </>
  )
}

const StatisticsLine = (props) => {
  const text = props.text
  const value = props.value

  if (text === 'Positive') {
    return (
      <tr>
        <td>{text}: </td>
        <td>{value} %</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{text}: </td>
      <td>{value}</td>
    </tr>
  )
}

export default App