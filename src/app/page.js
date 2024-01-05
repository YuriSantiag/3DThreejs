import Navbar from './components/navbar'
import Soon from './components/soon'
import Login from './components/login'
import Survey from './components/survey'
import LkButton from './components/lkbutton'
import GhButton from './components/ghbutton'
import Text from './components/text'

export default function App() {
  return (
    <div>
<Navbar/>
<main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Text/>
    <div className='grid md:grid-cols-2 lg:grid-cols-2 gap-4'>
    <LkButton/>
    <GhButton/>
    </div>
    <div>
      <h1 className='text-white font-semibold ml-2'>Projetos</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
       <Survey/>
        <Login/>
        <Soon />
        <Soon/>    
      </div>
    </div>
</main>

    </div>
    
  )
}
