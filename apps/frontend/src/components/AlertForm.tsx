import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CtaButton } from './blocks/buttons/ctaButton'
import { BodyText } from './blocks/text/bodyText'
import { Field } from './Field'
import { useState } from 'react'
import clsx from 'clsx'

const alertCadences = ['fiveInARow', 'every'] as const
const futureServices = ['actionsLaunch', 'taloflowLaunch'] as const
const serviceAlerts = [
    'IAM',
    'EC2',
    'SQS',
    'S3',
    'DynamoDB',
    'Lambda'
] as const
const serviceRegions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'eu-west-1',
    'eu-west-2',
    'sa-east-1',
    'ap-south-1',
    'ap-southeast-2',
    'ca-central-1'
] as const
const communicationPreferences = ['email'] as const

const formSchema = z.object({
    'alert-cadence': z.enum(alertCadences),
    'communication-preference': z.enum(communicationPreferences),
    email: z.string().email(),
    'signup-for': z.array(z.enum(futureServices)),
    'service-alerts': z.object({
        DynamoDB: z.boolean().default(false),
        EC2: z.boolean().default(false),
        IAM: z.boolean().default(false),
        Lambda: z.boolean().default(false),
        S3: z.boolean().default(false),
        SQS: z.boolean().default(false),
    }),
    'service-regions': z.object({
        'us-east-1': z.boolean().default(false),
        'us-east-2': z.boolean().default(false),
        'us-west-1': z.boolean().default(false),
        'us-west-2': z.boolean().default(false),
        'eu-west-1': z.boolean().default(false),
        'eu-west-2': z.boolean().default(false),
        'sa-east-1': z.boolean().default(false),
        'ap-south-1': z.boolean().default(false),
        'ap-southeast-2': z.boolean().default(false),
        'ca-central-1': z.boolean().default(false)
    })
})

type FormSchema = z.infer<typeof formSchema>

const messageSchema = z.object({
    type: z.enum(['success', 'error']),
    text: z.string()
})

type Message = z.infer<typeof messageSchema>

export const AlertForm = () => {
    const [message, setMessage] = useState<Message | null>(null)
    const { control, formState: { errors, isSubmitting }, handleSubmit, register } = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "signup-for": ["actionsLaunch", "taloflowLaunch"],
            "alert-cadence": "fiveInARow",
            "service-alerts": {},
            "service-regions": {},
            email: "",
            "communication-preference": "email",
        }
    })
    const onSubmit = async (data: FormSchema) => {
        const objToArray = (obj: any) => Object.entries(obj).filter(([, state]) => state === true).map(([key]) => key)
        const payload = {
            signup_for: data['signup-for'],
            service_alerts: objToArray(data['service-alerts']),
            service_regions: objToArray(data['service-regions']),
            alert_cadence: data['alert-cadence'],
            email: data.email,
        }
        let response = await fetch(
            "https://aws-health-check-api-gmoizr7c4q-uc.a.run.app/users",
            {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "content-type": "application/json",
                },
            }
        );
        if (![201, 400].includes(response.status)) {
            setMessage({
                type: 'error',
                text: 'Something went wrong submitting your form, mind alerting us on Github?'
            })
            return undefined;
        }
        let body = await response.json();
        if (response.status === 400) {
            setMessage({
                type: 'error',
                text: body.detail,
            })
            return undefined;
        }
        if (response.status === 201) {
            setMessage({
                type: 'success',
                text: 'Successfully registered'
            })
            return undefined;
        }
    }
    return (
        <form
            className={"sm:px-8"}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className={"flex flex-col space-y-8"}>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-2xl font-bold"}>Future Services</div>
                    <label className='flex flex-row items-center' htmlFor='actionsLaunch'>
                        <input className='mr-2' id="actionsLaunch" type="checkbox" {...register("signup-for")} value="actionsLaunch" />
                        <span className='text-xl font-medium'>Sign up for future “actions” alerts launch</span>
                    </label>
                    <label className='flex flex-row items-center' htmlFor='taloflowLaunch'>
                        <input className='mr-2' id="taloflowLaunch" type="checkbox" {...register("signup-for")} value="taloflowLaunch" />
                        <span className='text-xl font-medium'>Alert me when Taloflow launches similar free tools</span>
                    </label>
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-2xl font-bold"}>Available Services to monitor</div>
                    {serviceAlerts.map(service => (
                        <Field
                            key={service}
                            id={service}
                            label={service}
                            type='checkbox'
                            control={control}
                            defaultValue={false}
                            name={`service-alerts.${service}`}
                        />
                    ))}
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-2xl font-bold"}>Available Regions</div>
                    {serviceRegions.map(region => (
                        <Field
                            key={region}
                            id={region}
                            label={region}
                            type='checkbox'
                            control={control}
                            defaultValue={false}
                            name={`service-regions.${region}`}
                        />
                    ))}
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"text-2xl font-bold"}>Threshold</div>
                    <label
                        htmlFor="every"
                        className='flex flex-row items-center'
                    >
                        <input className='mr-2' id="every" type="radio" {...register("alert-cadence")} value="every" />
                        <span className='text-xl font-medium'>Every failed health check</span>
                    </label>
                    <label
                        htmlFor="fiveInARow"
                        className='flex flex-row items-center'
                    >
                        <input className='mr-2' id="fiveInARow" type="radio" {...register("alert-cadence")} value="fiveInARow" />
                        <span className='text-xl font-medium'>5 fails in a row</span>
                    </label>
                </div>
                <div>
                    <h3 className={"text-2xl font-bold"}>Send VIA</h3>

                    <div
                        className={
                            "flex flex-col border-2 mt-4 border-brand rounded-lg p-4 max-w-[fit-content]"
                        }
                    >
                        {/*This is a dummy field. All users are signed up via email*/}
                        <div className={"text-xl font-medium flex items-center"}>
                            <input
                                id="comm-pref-email"
                                readOnly={true}
                                {...register('communication-preference')}
                                type={"radio"}
                                value="email"
                            />
                            <label htmlFor='comm-pref-email' className={"text-xl pl-4"}>{"Email"}</label>
                        </div>
                    </div>
                    <p className={"text-2xl font-light pt-4"}>
                        Other methods coming soon
                    </p>
                </div>
                <div>
                    <label htmlFor="email" className={"text-2xl font-bold"}>Your Email</label>
                    <div
                        className={
                            "text-xl max-w-lg font-medium flex flex-col cursor-pointer pt-2"
                        }
                    >
                        <div className={"flex flex-col"}>

                            <input
                                id="email"
                                {...register('email')}
                                className={
                                    "border-none bg-neutral-light py-3 rounded-lg text-xl mt-2"
                                }
                                placeholder={"keep-big-cloud-honest@taloflow.ai"}
                                autoComplete={"email"}
                                type={"email"}
                            />
                            {errors.email && (
                                <span className='pt-2 text-danger'>{errors.email.message}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <CtaButton
                        text={"Sign up for alerts"}
                        disabled={isSubmitting}
                        type={"submit"}
                    />
                    {message !== null && (
                        <div className={"mt-2"}>
                            <BodyText extraClasses={clsx("font-bold", {
                                'text-danger': message.type === 'error',
                                'text-success': message.type === 'success'
                            })}>
                                {message.text}
                            </BodyText>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}