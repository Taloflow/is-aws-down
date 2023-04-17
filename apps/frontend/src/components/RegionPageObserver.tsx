import { atom, useSetAtom } from "jotai"
import { type ReactNode, useEffect } from "react"

type RegionPageObserverProps = {
    children?: ReactNode
}

export const visibleSectionAtom = atom<string>('')

export const RegionPageObserver = ({ children }: RegionPageObserverProps) => {
    const setVisibleSection = useSetAtom(visibleSectionAtom)
    useEffect(() => {
        const onChange = (entries: IntersectionObserverEntry[]) => {
            const visibleSection = entries.find(entry => entry.isIntersecting)?.target
            if (visibleSection) {
                setVisibleSection(visibleSection.id)
            }
        }
        const pageObserver = new IntersectionObserver(onChange, {
            threshold: 0.5
        })

        const sections = document.querySelectorAll('[data-section]')

        sections.forEach(section => {
            pageObserver.observe(section)
        })

        return () => {
            pageObserver.disconnect()
        }
    }, [])

    return (
        <>{children}</>
    )
}