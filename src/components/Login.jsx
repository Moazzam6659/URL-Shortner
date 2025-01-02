import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './Error'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import useFetch from '@/hooks/Use-Fetch'
import { login } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/Context'

const Login = () => {
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const longLink = searchParams.get('createNew')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const { data, error, loading, fn: fnLogin } = useFetch(login, formData)

  const { fetchUser } = UrlState()

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`)
      fetchUser()
    }
  }, [data, error])

  const handleLogin = async () => {
    setErrors([])
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      })

      await schema.validate(formData, { abortEarly: false })
      // api call
      await fnLogin()
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
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign-in to your account if you already have one.</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='space-y-1'>
          <Input name='email' type='email' placeholder='Enter Email' onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className='space-y-1'>
          <Input name='password' type='password' placeholder='Enter Password' onChange={handleInputChange} />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {loading ? <BeatLoader color='#18989a' size={6} speedMultiplier={0.7} /> : 'Login'}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Login
