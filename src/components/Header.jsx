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

const Header = () => {
  const navigate = useNavigate()
  const user = true

  return (
    <nav className='py-4 flex items-center justify-between'>
      <Link to='/'>
        <img src='/logo.png' alt='Logo' className='h-16' />
      </Link>

      <div>
        {!user ? (
          <Button onClick={() => navigate('/auth')}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className='outline-0 overflow-hidden rounded-full'>
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Moazzam Ali</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LinkIcon /> My Links
              </DropdownMenuItem>
              <DropdownMenuItem className='text-red-400'>
                <LogOut />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}

export default Header
