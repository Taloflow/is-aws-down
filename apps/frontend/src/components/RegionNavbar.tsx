import clsx from "clsx";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { visibleSectionAtom } from "./RegionPageObserver";

type NavLinkProps = {
    href: string | URL;
    children: ReactNode
    isActive?: boolean
}

const NavLink = ({ children, href, isActive = false }: NavLinkProps) => (
    <div
        className="relative hidden md:inline-block"
    >
        <Link
            href={href}
            className={clsx(
                "no-underline font-medium hover:bg-brand-accent hover:bg-opacity-60 px-4 py-2 rounded-lg transition-colors"
            )}
        >
            {children}
        <div
            className={clsx('h-2 w-full bg-brand-accent absolute transition-opacity -bottom-4', {
                'opacity-100': isActive,
                'opacity-0': !isActive
            })}
        />
        </Link>
    </div>
)

const navItems = [
    {
        label: 'Stats',
        id: 'stats',
    },
    {
        label: 'SQS + EC2',
        id: 'is-sqs-down'
    },
    {
        label: 'S3',
        id: 'is-s3-down'
    },
    {
        label: 'EC2',
        id: 'is-ec2-down'
    },
    {
        label: 'Lambda',
        id: 'is-lambda-down',
    },
    {
        label: 'DynamoDB',
        id: 'is-dynamodb-down',
    },
    {
        label: 'API Gateway',
        id: 'is-api-gateway-down'
    }
] as const

export const RegionNavbar = () => {
    const router = useRouter()
    const regionSlug = router.query.slug as string | undefined
    const visibleSection = useAtomValue(visibleSectionAtom)
    return (
        <nav className={"mb-24"}>
            <div
                className={
                    " bg-[#0A0C24] py-4 px-6 text-white no-underline text-lg  fixed top-0 w-full z-40"
                }
            >
                <div className={"max-w-7xl mx-auto justify-between flex"}>
                    <div>
                        <a href={"https://www.taloflow.ai"} className={"inline-block mr-4"}>
                            <svg
                                width="40"
                                height="100%"
                                viewBox="0 0 84 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20.759 5.43103L26.2633 0L44 17.5L26.2633 35L20.759 29.569L29.1041 21.3352H0V13.6546H29.0938L20.759 5.43103Z"
                                    fill="white"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M84 17.5C84 27.165 76.1651 35 66.5001 35C56.8351 35 49 27.165 49 17.5C49 7.83503 56.8351 0 66.5001 0C76.1651 0 84 7.83503 84 17.5ZM76.7068 17.5C76.7068 22.9209 72.2723 27.5626 66.5001 27.5626C60.7279 27.5626 56.2934 22.9209 56.2934 17.5C56.2934 12.0792 60.7279 7.43752 66.5001 7.43752C72.2723 7.43752 76.7068 12.0792 76.7068 17.5Z"
                                    fill="white"
                                />
                            </svg>
                        </a>
                        {typeof regionSlug !== 'undefined' && navItems.map(navItem => (
                            <NavLink
                                key={navItem.id}
                                href={`/${regionSlug}#${navItem.id}`}
                                isActive={visibleSection === navItem.id}
                            >
                                {navItem.label}
                            </NavLink>
                        ))}
                    </div>
                    <div>
                        <a
                            className={
                                "no-underline bg-white rounded-lg text-brand-accent text-sm md:text-lg font-bold px-4 py-2"
                            }
                            href={"https://github.com/Taloflow/is-aws-down/discussions"}
                            target={"_blank"}
                            rel="noopener noreferrer"
                        >
                            Github Discussion Page
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}