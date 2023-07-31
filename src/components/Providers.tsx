import { FC, ReactNode } from "react";
import PlausibleProvider from 'next-plausible'

interface ProvidersProps {
    children: ReactNode
}

const Providers: FC<ProvidersProps> = ({ children }) => {
    return (
        <PlausibleProvider selfHosted domain="pokemon.gurkz.me" customDomain="https://analytics.gurkz.me/">
            {children}
        </PlausibleProvider>
    )
}

export { Providers }