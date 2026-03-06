export function Card (props) {
    const {name, title, bio} = props
    return (
        <div className="card">
            <h2>{name}</h2>
            <p className="card-title">{title}</p>
            <p>{bio}</p>
        </div>)
}

export const App = ()=>{
    return (
        <div className="flex-container">

        </div>
    );
}