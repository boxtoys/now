import style from './Home.module.scss'

export default function Home() {
  function buttonClick() {
    alert('oops.')
  }

  return (
    <div className={style.section}>
      <h1 onClick={buttonClick}>Hello World</h1>
    </div>
  )
}
