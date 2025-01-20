import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LinkIcon, LogOut } from 'lucide-react'
import { UrlState } from '@/Context'
import customUseFetch from '@/hooks/Use-Fetch'
import { logout } from '@/db/apiAuth'
import { BarLoader } from 'react-spinners'

const Header = () => {
  const navigate = useNavigate()

  const { user, fetchUser } = UrlState()

  const { loading, fn: fnLogout } = customUseFetch(logout)

  return (
    <>
      <nav className='py-4 flex items-center justify-between'>
        <Link to='/'>
          <img src='/logo.webp' alt='Logo' className='h-16' />
        </Link>

        <div>
          {!user ? (
            <Button onClick={() => navigate('/auth')}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className='outline-0 overflow-hidden rounded-full'>
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.profile_pic} className='object-contain' />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='hover:cursor-pointer'>
                  <LinkIcon /> My Links
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-400 hover:cursor-pointer'>
                  <LogOut />
                  <span
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser()
                        navigate('/')
                      })
                    }}>
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />}
    </>
  )
}

export default Header
