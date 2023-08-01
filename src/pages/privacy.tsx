import { NextPage } from "next";

const Privacy: NextPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center my-4">
            <h1 className="text-4xl font-bold">privacy policy</h1>
            <p>we use analytics to improve our services and for our best interest</p>
            <p>when you visit this page, we collect:</p>
            <p>your general location (i.e state/region)</p>
            <p className="italic">this is also collected when you vote for a pokémon</p>
        </div>
    )
}

export default Privacy