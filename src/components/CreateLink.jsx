import { UrlState } from '@/Context'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Error from './Error'
import { Card } from './ui/card'
import { useEffect, useRef, useState } from 'react'
import * as yup from 'yup'
import { QRCode } from 'react-qrcode-logo'
import customUseFetch from '@/hooks/Use-Fetch'
import { createUrl } from '@/db/apiUrls'
import { BeatLoader } from 'react-spinners'

const CreateLink = () => {
  const { user } = UrlState()
  const navigate = useNavigate()
  const ref = useRef()

  let [searhParams, setSearchParams] = useSearchParams()
  const longLink = searhParams.get('createNew')

  const [errors, setErrors] = useState({})
  const [formValues, setFormValues] = useState({
    title: '',
    longUrl: longLink ? longLink : '',
    customUrl: '',
  })

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    longUrl: yup.string().url('Must be a valid URL').required('Long URL is required'),
    customUrl: yup.string(),
  })

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    })
  }

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = customUseFetch(createUrl, { ...formValues, user_id: user.id })

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`)
    }
  }, [error, data])

  const createNewLink = async () => {
    setErrors([])
    try {
      await schema.validate(formValues, { abortEarly: false })
      const canvas = ref.current.canvasRef.current
      const blob = await new Promise((resolve) => canvas.toBlob(resolve))

      await fnCreateUrl(blob)
    } catch (e) {
      const newErrors = {}

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message
      })

      setErrors(newErrors)
    }
  }

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({})
      }}>
      <DialogTrigger>
        <Button variant='destructive'>Create New Link</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>Create New</DialogTitle>
        </DialogHeader>

        {formValues?.longUrl && <QRCode value={formValues?.longUrl} size={150} ref={ref} />}

        <Input
          id='title'
          placeholder='Enter Short Link Title'
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id='longUrl'
          placeholder='Enter Original Link'
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className='flex items-center gap-2'>
          <Card className='p-2'>sniplink.netlify.app</Card> /
          <Input
            id='customUrl'
            placeholder='Custom Link (Optional)'
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <Error message={error.message} />}

        <DialogFooter>
          <Button disabled={loading} variant='destructive' onClick={createNewLink}>
            {loading ? <BeatLoader size={10} color='white' /> : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLink
