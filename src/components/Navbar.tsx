import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
    return (
        <nav className='p-2 w-full flex flex-row gap-4 bg-slate-700'>
            <Link href="/">home</Link>
            <Link href="/prettiest">leaderboard</Link>
            <Link href="/privacy">privacy policy</Link>
            <></>
            <Link href="https://gurkz.me">more projects by gurkan</Link>
        </nav>
    )
}