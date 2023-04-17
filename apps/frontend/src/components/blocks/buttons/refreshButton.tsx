import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children?: ReactNode
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
};

export const RefreshButton = ({ children, disabled = false }: ButtonProps) => {
  return (
    <button
      type='button'
      className={
        "flex rounded-lg w-[fit-content] items-center text-lg border-2 border-brand px-4 py-2 text-brand"
      }
      disabled={disabled}
    >
      <svg
        className={"mr-2"}
        width="24"
        height="21"
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 0C7.879 0 3.289 4.443 3.025 10H0L5 16.625L10 10H7.025C7.282 6.649 10.085 4 13.5 4C17.084 4 20 6.916 20 10.5C20 14.084 17.084 17 13.5 17C11.637 17 9.958 16.207 8.772 14.947L6.345 18.163C8.222 19.917 10.734 21 13.5 21C19.29 21 24 16.29 24 10.5C24 4.71 19.29 0 13.5 0Z"
          fill="#2464F6"
        />
      </svg>
      {children}
    </button>
  );
};
