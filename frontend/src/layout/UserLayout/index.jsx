import NavbarComponant from '@/Componant/Navbar'
import React from 'react'

export default function UserLayout({children}) {
  return (
    <>
        <NavbarComponant/>
        {children}
    </>
  )
}
