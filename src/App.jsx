import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader } from './components/Loader'
import { CopyToClipboardButton } from './components/CopyToClipboardButton'

function App () {
  const [loading, setLoading] = useState(false)
  const [showImg, setShowImg] = useState(false)
  const [url, setUrl] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const onDrop = useCallback(async acceptedFiles => {
    const formData = new FormData()
    const uploadedFile = acceptedFiles[0]

    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      const apiUrl = import.meta.env.VITE_API_URL
      const presetName = import.meta.env.VITE_UPLOAD_PRESET_NAME

      formData.append('file', uploadedFile)
      formData.append('upload_preset', presetName)
      formData.append('folder', 'imgUploader')
      setLoading(true)

      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        setUrl(data.secure_url)
        setShowImg(true)
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        setErrorMessage('Error uploading image. Please try again.')
        timeError()
      } finally {
        setLoading(false)
      }
    } else {
      // Manejar el caso en que el archivo no es una imagen
      console.error('Please select a valid image file.')
      setErrorMessage('Please select a valid image file.')
      timeError()
    }
  }, [])

  // Ocultar el mensaje de error después de 3 segundos
  const timeError = () => {
    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }

  // resset del estado
  const reset = () => {
    setUrl(null)
    setLoading(false)
    setShowImg(false)
  }

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false
  })

  return (
    <main className='card'>
      {
        errorMessage && <p className='error'>{errorMessage}</p>
      }
      {
        loading
          ? (
            <Loader />
            )
          : !showImg && (
            <>
              <h1>Upload your Image</h1>
              <h3>File should be Jpeg, Png...</h3>
              <form>
                <div className='drag' {...getRootProps()}>
                  <input id='file-input' {...getInputProps()} />
                  <img className='' src='/image.svg' alt='image' />
                  {
                    isDragActive
                      ? <p>Drop your image here...</p>
                      : <p>Drag your image here</p>
                  }
                </div>
                <p>Or</p>
                <div className='center'>
                  <label htmlFor='file-input'>Choose a image</label>
                </div>
              </form>
            </>
            )
      }
      {acceptedFiles[0] && url && (
        <>
          <img className='checkmark' src='/checkmark.png' alt='checkmark' />
          <h1 className='pb-0'>Uploaded Successfully!</h1>
          <img className='link-img' src={URL.createObjectURL(acceptedFiles[0])} alt={acceptedFiles[0].name} />
          <CopyToClipboardButton url={url} />
          <button className='mt-5' onClick={reset}>upload another image</button>
        </>
      )}

    </main>
  )
}

export default App
