import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// @ts-ignore
import '@fontsource/inter'

createRoot(document.getElementById("root")!).render(<App />);
