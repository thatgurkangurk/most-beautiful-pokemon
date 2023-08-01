import Link from "next/link";
import { NextPage } from "next";

const About: NextPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center my-4">
            <h1 className="text-4xl font-bold">about</h1>
            <p>this project was made by <Link className="underline" href="https://gurkz.me">gurkan</Link> to learn the t3 stack</p>
            <p>inspired by <Link href="https://t3.gg" className="underline">theo&apos;s</Link> <Link href="https://roundest.t3.gg/" className="underline">roundest project</Link></p>
        </div>
    )
}

export default About