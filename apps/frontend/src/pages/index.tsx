import Router from "next/router";
import { useEffect } from "react";

export default function HomePage() {
    useEffect(() => {
        Router.push('/is-aws-down')
    }, [])
    return null
}