export const BlankNavbar = () => {
  return (
    <nav className={"sm:mb-16"}>
      <div
        className={
          " bg-[#0A0C24] py-4 px-2 text-white no-underline text-lg  w-full z-40"
        }
      >
        <div className={"max-w-7xl mx-auto justify-between items-center flex"}>
          <a
            href={"https://www.taloflow.ai"}
            className={"inline-block w-[100px]  sm:w-[160px] mr-4 my-auto"}
          >
            <svg
              height="100%"
              viewBox="0 0 247 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.759 6.43103L26.2633 1L44 18.5L26.2633 36L20.759 30.569L29.1041 22.3352H0V14.6546H29.0938L20.759 6.43103Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M84 18.5C84 28.165 76.1651 36 66.5001 36C56.8351 36 49 28.165 49 18.5C49 8.83503 56.8351 1 66.5001 1C76.1651 1 84 8.83503 84 18.5ZM76.7068 18.5C76.7068 23.9209 72.2723 28.5626 66.5001 28.5626C60.7279 28.5626 56.2934 23.9209 56.2934 18.5C56.2934 13.0792 60.7279 8.43752 66.5001 8.43752C72.2723 8.43752 76.7068 13.0792 76.7068 18.5Z"
                fill="white"
              />
              <path
                d="M99 9.61805H102.128V4H107.247V9.61805H111.634V13.8945H107.247V23.3695C107.247 24.4317 107.477 25.1865 107.937 25.6337C108.398 26.0808 109.021 26.3045 109.806 26.3045C110.185 26.3045 110.51 26.2765 110.781 26.2205C111.052 26.1645 111.296 26.1088 111.512 26.0528L112 30.4132C111.539 30.5809 110.998 30.7206 110.375 30.8323C109.779 30.9443 109.183 31 108.587 31C107.721 31 106.895 30.8883 106.109 30.6646C105.324 30.4691 104.633 30.1197 104.037 29.6164C103.442 29.1135 102.968 28.4427 102.615 27.6041C102.291 26.7376 102.128 25.6617 102.128 24.376V13.8945H99V9.61805Z"
                fill="white"
              />
              <path
                d="M128.722 30.4121C128.557 30.1883 128.351 29.8105 128.103 29.2786C127.856 28.7189 127.732 27.9911 127.732 27.0955C127.017 28.4109 126.069 29.3907 124.887 30.0345C123.705 30.6782 122.371 31 120.887 31C119.869 31 118.935 30.846 118.082 30.5383C117.258 30.2305 116.543 29.7966 115.938 29.2367C115.334 28.6769 114.852 27.9911 114.495 27.1794C114.165 26.3677 114 25.4721 114 24.4926C114 23.4288 114.193 22.5051 114.577 21.7215C114.99 20.9097 115.526 20.2239 116.186 19.6641C116.873 19.1043 117.656 18.6565 118.536 18.3207C119.416 17.9847 120.337 17.7468 121.299 17.6069L127.443 16.6413V15.8436C127.443 14.8359 127.127 14.0662 126.495 13.5343C125.89 12.9745 124.955 12.6947 123.691 12.6947C122.481 12.6947 121.56 12.9325 120.928 13.4084C120.323 13.8562 120.021 14.4021 120.021 15.0458C120.021 15.1298 120.021 15.1998 120.021 15.2557C120.021 15.3118 120.048 15.4097 120.103 15.5497L115.443 17.145C115.196 16.6133 115.072 16.0255 115.072 15.3817C115.072 14.57 115.265 13.7863 115.65 13.0306C116.035 12.2468 116.584 11.5611 117.299 10.9733C118.041 10.3855 118.949 9.90968 120.021 9.54581C121.093 9.18194 122.316 9 123.691 9C126.577 9 128.79 9.62979 130.33 10.8893C131.869 12.1209 132.639 14.0102 132.639 16.5573V25.2482C132.639 26.4519 132.735 27.4314 132.928 28.1871C133.148 28.943 133.505 29.6846 134 30.4121H128.722ZM122.124 26.7176C123.636 26.7176 124.9 26.2139 125.917 25.2063C126.935 24.1985 127.443 22.6871 127.443 20.6717V20.294L122.495 21.1336C120.213 21.5255 119.072 22.5471 119.072 24.1985C119.072 25.0382 119.347 25.668 119.897 26.0878C120.474 26.5076 121.217 26.7176 122.124 26.7176Z"
                fill="white"
              />
              <path d="M138 1H143V31H138V1Z" fill="white" />
              <path
                d="M169 20.0001C169 21.8194 168.69 23.4148 168.067 24.7862C167.445 26.1579 166.606 27.3055 165.55 28.229C164.522 29.1528 163.345 29.8524 162.019 30.3282C160.72 30.7762 159.38 31 158.001 31C156.62 31 155.266 30.7762 153.942 30.3282C152.643 29.8524 151.464 29.1528 150.41 28.229C149.382 27.3055 148.556 26.1579 147.933 24.7862C147.311 23.4148 147 21.8194 147 20.0001C147 18.1807 147.311 16.5852 147.933 15.2137C148.556 13.8423 149.382 12.6947 150.41 11.771C151.464 10.8473 152.643 10.1616 153.942 9.71375C155.266 9.23791 156.62 9 158.001 9C159.38 9 160.72 9.23791 162.019 9.71375C163.345 10.1616 164.522 10.8473 165.55 11.771C166.606 12.6947 167.445 13.8423 168.067 15.2137C168.69 16.5852 169 18.1807 169 20.0001ZM158.001 26.0459C158.758 26.0459 159.475 25.9198 160.151 25.668C160.855 25.3882 161.477 24.9963 162.019 24.4926C162.56 23.9606 162.993 23.3168 163.318 22.5612C163.643 21.8054 163.805 20.9517 163.805 20.0001C163.805 19.0484 163.643 18.1948 163.318 17.439C162.993 16.6832 162.56 16.0534 162.019 15.5497C161.477 15.0178 160.855 14.626 160.151 14.374C159.475 14.0941 158.758 13.9543 158.001 13.9543C157.243 13.9543 156.512 14.0941 155.808 14.374C155.132 14.626 154.522 15.0178 153.981 15.5497C153.441 16.0534 153.007 16.6832 152.683 17.439C152.358 18.1948 152.195 19.0484 152.195 20.0001C152.195 20.9517 152.358 21.8054 152.683 22.5612C153.007 23.3168 153.441 23.9606 153.981 24.4926C154.522 24.9963 155.132 25.3882 155.808 25.668C156.512 25.9198 157.243 26.0459 158.001 26.0459Z"
                fill="white"
              />
              <path
                d="M171 10.4987H173.96V7.60536C173.96 6.33781 174.137 5.23558 174.494 4.29867C174.849 3.33423 175.343 2.53513 175.973 1.90135C176.631 1.26756 177.398 0.799115 178.274 0.496003C179.179 0.165334 180.151 0 181.192 0C181.603 0 182.028 0.0413342 182.466 0.124002C182.904 0.179112 183.343 0.289333 183.781 0.45467L182.876 5.0427C182.575 4.93247 182.315 4.86357 182.096 4.83601C181.904 4.80847 181.685 4.79469 181.439 4.79469C179.905 4.79469 179.137 5.69025 179.137 7.48136V10.4987H183.576V14.7148H179.137V31H173.96V14.7148H171V10.4987ZM186.822 2.06668H192V31H186.822V2.06668Z"
                fill="white"
              />
              <path
                d="M218 20.0001C218 21.8194 217.674 23.4148 217.024 24.7862C216.373 26.1579 215.497 27.3055 214.394 28.229C213.318 29.1528 212.087 29.8524 210.702 30.3282C209.344 30.7762 207.943 31 206.499 31C205.057 31 203.642 30.7762 202.256 30.3282C200.898 29.8524 199.667 29.1528 198.564 28.229C197.489 27.3055 196.625 26.1579 195.976 24.7862C195.324 23.4148 195 21.8194 195 20.0001C195 18.1807 195.324 16.5852 195.976 15.2137C196.625 13.8423 197.489 12.6947 198.564 11.771C199.667 10.8473 200.898 10.1616 202.256 9.71375C203.642 9.23791 205.057 9 206.499 9C207.943 9 209.344 9.23791 210.702 9.71375C212.087 10.1616 213.318 10.8473 214.394 11.771C215.497 12.6947 216.373 13.8423 217.024 15.2137C217.674 16.5852 218 18.1807 218 20.0001ZM206.499 26.0459C207.291 26.0459 208.042 25.9198 208.749 25.668C209.484 25.3882 210.136 24.9963 210.702 24.4926C211.266 23.9606 211.72 23.3168 212.058 22.5612C212.398 21.8054 212.569 20.9517 212.569 20.0001C212.569 19.0484 212.398 18.1948 212.058 17.439C211.72 16.6832 211.266 16.0534 210.702 15.5497C210.136 15.0178 209.484 14.626 208.749 14.374C208.042 14.0941 207.291 13.9543 206.499 13.9543C205.707 13.9543 204.943 14.0941 204.208 14.374C203.501 14.626 202.864 15.0178 202.298 15.5497C201.732 16.0534 201.28 16.6832 200.94 17.439C200.6 18.1948 200.431 19.0484 200.431 20.0001C200.431 20.9517 200.6 21.8054 200.94 22.5612C201.28 23.3168 201.732 23.9606 202.298 24.4926C202.864 24.9963 203.501 25.3882 204.208 25.668C204.943 25.9198 205.707 26.0459 206.499 26.0459Z"
                fill="white"
              />
              <path
                d="M238.943 24.0566L242.133 10H247L241.496 31H236.629L233 16.5625L229.37 31H224.504L219 10H223.865L227.057 24.0566L230.608 10H235.393L238.943 24.0566Z"
                fill="white"
              />
            </svg>
          </a>
          <div>
            <a
              className={
                "no-underline bg-white rounded-lg text-brand-accent text-sm md:text-lg font-bold px-4 py-2"
              }
              href={"https://github.com/Taloflow/is-aws-down/discussions"}
              target={"_blank"}
            >
              Github Discussion Page
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
