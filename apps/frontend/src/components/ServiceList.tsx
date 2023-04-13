export type ServiceListItem = Readonly<{
    name: string;
    url?: string;
}>

type ServiceListProps = {
    services: Readonly<ServiceListItem[]>
}

export const ServiceList = ({ services }: ServiceListProps) => (
    <ul
        className={
            "list-disc pl-6 !-mt-0 text-lg sm:text-xl font-medium leading-relaxed"
        }
    >
        {services.map(service => (
            <li key={service.name}>
                {service.url ? <a href={service.url}>{service.name}</a> : <p>{service.name}</p>}
            </li>
        ))}
    </ul>
)