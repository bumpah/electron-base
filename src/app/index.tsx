import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import fs from 'fs'

function App() {
    const Lazy = lazy(() => new Promise(async (res: any) => {
        setTimeout(async () => {
            const mod = await import('./lazy')
            res(mod)
        }, 1000) // Simulate fetch
    }))
    const Test = lazy(() => new Promise(async (res: any) => {
        setTimeout(async () => {
            const mod = await import('./components/Test')
            res(mod)
        }, 1000) // Simulate fetch
    }))
    return (
        <div id={`${Date.now()}`}>
            <Title />
            <Suspense fallback={<p>loading...</p>}>
                <Lazy />
                <Test />
            </Suspense>
            <Stats />
        </div>
    )
}

const Title = () => <h1>Electron Base!</h1>

const Stats = () => (
    <div style={styles.stats}>
        <p>We are using node {process.versions.node}, Chrome {process.versions.chrome} and Electron {process.versions.electron}</p>
    </div>
)

const styles: Record<string, React.CSSProperties> = {
    stats: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: 50,
        background: '#333',
        color: '#fff',
        padding: '0 1em',
    }
}

ReactDOM.render(<App />, document.getElementById('root'))