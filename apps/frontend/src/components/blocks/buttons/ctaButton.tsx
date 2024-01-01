export const CtaLink = ({
  text,
  href,
  size = "base",
  inverse = false,
  withIcon = true,
}: {
  text: string
  href: string
  inverse?: boolean
  withIcon?: boolean
  size?: "compact" | "base"
}) => {
  return (
    <a
      href={href}
      className={
        `
        ${
          inverse ? "bg-white hover:opacity-90 text-brand" : "bg-brand hover:bg-brand-CTAHover text-white "
        }
        ${
          size === "compact"
            ? "text-base"
            : "text-xl font-medium"
        }
        px-6 py-2 rounded-lg max-w-[fit-content] text-center transition-colors flex item-center justify-center no-underline
        `
      }>
      {text}
      {withIcon && (
        <svg
          className={"my-auto ml-2"}
          width='15'
          height='12'
          viewBox='0 0 15 12'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M8.95346 0L7.07695 1.86205L9.9183 4.6815H0V7.31483H9.92186L7.07695 10.1378L8.95346 11.9999L15 5.99993L8.95346 0Z'
            fill='white'
          />
        </svg>
      )}
    </a>
  )
}

export const CtaButton = ({
  text,
  type,
  disabled,
}: {
  text: string
  type?: "submit"
  disabled?: boolean
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`bg-brand max-w-[fit-content] font-medium transition-colors hover:bg-brand-CTAHover rounded-lg px-6 py-2 flex text-white text-xl item-center justify-center no-underline ${
        disabled && "cursor-not-allowed"
      }`}>
      {text}
      <svg
        className={"my-auto ml-2"}
        width='15'
        height='12'
        viewBox='0 0 15 12'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M8.95346 0L7.07695 1.86205L9.9183 4.6815H0V7.31483H9.92186L7.07695 10.1378L8.95346 11.9999L15 5.99993L8.95346 0Z'
          fill='white'
        />
      </svg>
    </button>
  )
}
