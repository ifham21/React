import { useState } from "react"

const Card = ({title}) => {

  const [hasLinked, setHasLiked] = useState(false);

  return(
    <div className="card">
      <h2>{title}</h2>

      <button onClick={() => setHasLiked(!hasLinked)}>
        {hasLinked ? "💝" : '🤍'}
      </button>
    </div>
  )
}


const App = () => {

  // anything start with 'use' in react is a hook

  return(
    <div className="card-container">
      <Card title="Star Wars" rating={5} isCool={true} />
      <Card title="Avatar" />
      <Card title="The Lion King" />
    </div>
  )

}



export default App
