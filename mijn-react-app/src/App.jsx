export function Card({name, title, bio}) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p className="card-title">{title}</p>
      <p>{bio}</p>
    </div>
  )
} 

export function App() {
  return (
    <div className="flex-container">
      <Card
      name="Mark"
      title="Frontend developer"
      bio="Een kilo kaas is de gemiddelde hoeveelheid kaas die ik per dag eet. Sommige mensen vinden het raar dat ik zo veel kaas eet, maar ik niet."
      />
      <Card
      name="Tiffany"
      title="Engineering manager"
      bio="I have worked in tech for 15 years and love to help people grow in this industry."
      />
      <Card
      name="Doug"
      title="Backend developer"
      bio="I have been a software developer for over 20 years and I love working with Go and Rust."
      />
    </div>
  )
}