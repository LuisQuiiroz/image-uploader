import { useState } from 'react'

export function CopyToClipboardButton ({ url }) {
  const [buttonText, setButtonText] = useState('Copy Link')

  const copyToClipboard = async () => {
    // Utilizar el API de Clipboard para copiar el texto al portapapeles
    await navigator.clipboard.writeText(url)
    // Cambiar el texto del botón a "Copied" por unos segundos
    setButtonText('Copied')
    setTimeout(() => {
      setButtonText('Copy Link')
    }, 2000)
  }
  return (
    <div className='link'>
      <p>{url}</p>
      <button className='w-100' onClick={copyToClipboard}>{buttonText}</button>
    </div>
  )
}
