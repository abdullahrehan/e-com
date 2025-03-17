"use client"
import React from 'react'
import Authentication from '../../../components/others/authentication'
export default function ProductsLayout({ children }) {


  return (
    <Authentication> 
      {children}
    </Authentication>
  )
}