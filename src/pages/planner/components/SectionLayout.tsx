import React from 'react'

interface SectionLayoutProps {
    title: string
    children: React.ReactNode
}

const SectionLayout = ({ title, children }: SectionLayoutProps) => {
    return (
        <section>
            <div className='flex items-center gap-2 mb-4'>
                <h2 className='text-xl font-semibold tracking-widest uppercase'>{title}</h2>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {children}
            </div>
        </section>
    )
}

export default SectionLayout