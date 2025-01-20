import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './Error'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import useFetch from '@/hooks/Use-Fetch'
import { signup } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/Context'

const Signup = () => {
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: null,
  })

  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const longLink = searchParams.get('createNew')

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }))
  }

  const { data, error, loading, fn: fnSignup } = useFetch(signup, formData)

  const { fetchUser } = UrlState()

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`)
      fetchUser()
    }
  }, [error, loading])

  const handleSignup = async () => {
    setErrors([])
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        profile_pic: Yup.mixed().required('Profile picture is required'),
      })

      await schema.validate(formData, { abortEarly: false })
      // api call
      await fnSignup()
    } catch (e) {
      const newErrors = {}

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message
      })

      setErrors(newErrors)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create a new account if you haven't already</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='space-y-1'>
          <Input name='name' type='text' placeholder='Enter Name' onChange={handleInputChange} />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className='space-y-1'>
          <Input name='email' type='email' placeholder='Enter Email' onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className='space-y-1'>
          <Input name='password' type='password' placeholder='Enter Password' onChange={handleInputChange} />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className='space-y-1'>
          <Input
            name='profile_pic'
            type='file'
            accept='image/jpeg, image/png, image/webp'
            onChange={handleInputChange}
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? <BeatLoader color='#18989a' size={6} speedMultiplier={0.7} /> : 'Create Account'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Signup
