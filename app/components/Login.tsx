"use client";

import { useContext, useEffect, useRef } from "react";
import Account from "./Account";
import { ToastContext } from "@/context/toast-context";
import { UserContext } from "@/context/user-context";
import { useModal, Modal } from "@/components/Modal";
import Image from "next/image";
import Button from "./Button";

const Login = () => {
  const { createToast } = useContext(ToastContext);
  const { loginUser, keys } = useContext(UserContext);
  const loginModal = useModal();

  const loginHandler = async () => {
    try {
      if (await loginUser()) {
        // console.log("Connected");
        createToast({ message: "Connected successfully", type: "success" });
      } else {
        createToast({ message: "Error connecting", type: "error" });
      }
    } finally {
      loginModal.hide();
    }
  };

  return (
    <>
      {keys?.publicKey ? (
        <Account pubkey={keys.publicKey} />
      ) : (
        <div className="w-full min-h-[100dvh] min-w-[100dvw] flex flex-col p-4 sm:p-6 gap-8 justify-center items-center">
          <div
            id="hero"
            className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center"
          >
            <div className="">
              <div className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px]">
                <Image
                  className="object-contain"
                  src="/bss-splash.jpg"
                  width={1023}
                  height={1023}
                  alt="Bitcoin Street Store"
                  priority={false}
                  // objectFit="contain"
                />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start md:w-[400px] xl:w-[500px] text-center md:text-left">
              <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4">
                Welcome to the Bitcoin Street Store Online
              </h1>
              <p className="mb-8 text-md md:text-xl lg:text-2xl">
                Digital commerce tools for economic empowerment of African
                merchants, accessible without Internet.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => loginModal.show()}>
                  Login with Nostr
                </Button>
                <p className="text-sm">
                  You don&apos;t need to register. You simply need to connect
                  your Nostr npub to use the platform.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-1 sm:gap-2 items-center">
            <div className="min-w-fit text-xs sm:text-sm">Powered by</div>
            <div className="min-w-fit">
              <Image
                src="/bitcoincowries.png"
                className="w-12 sm:w-16 text-black object-contain"
                width={300}
                height={300}
                alt="Bitcoin Cowries"
                // objectFit="contain"
              />
            </div>
            <div className="min-w-fit text-xs sm:text-sm">and</div>
            <div className="min-w-fit">
              <svg
                className="w-16 sm:w-20 text-black"
                viewBox="0 0 864 473"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M401.546 296.565C392.86 296.912 384.215 295.196 376.321 291.557C370.756 288.985 365.962 285.002 362.415 280.006C360.042 276.825 358.588 273.054 358.211 269.105C358.208 268.58 358.322 268.061 358.546 267.585C358.77 267.11 359.098 266.691 359.505 266.359C360.299 265.631 361.338 265.228 362.415 265.228H384.083C385.009 265.178 385.926 265.434 386.691 265.958C387.479 266.634 388.089 267.493 388.469 268.459C389.387 270.636 390.823 272.557 392.653 274.055C395.056 275.589 397.894 276.299 400.738 276.077C402.608 276.227 404.49 275.996 406.268 275.399C408.047 274.801 409.686 273.85 411.086 272.601C413.671 269.326 414.888 265.179 414.482 261.029V250.206C411.407 253.235 407.734 255.589 403.697 257.119C399.66 258.649 395.347 259.32 391.036 259.09C386.436 259.396 381.825 258.71 377.514 257.079C373.203 255.449 369.294 252.911 366.051 249.638C359.711 241.755 356.361 231.887 356.594 221.777L356.432 217.416C355.788 206.432 358.896 195.554 365.248 186.564C368.358 182.802 372.317 179.831 376.8 177.894C381.283 175.956 386.161 175.108 391.036 175.419C396.065 175.309 401.049 176.379 405.588 178.545C409.682 180.558 413.273 183.46 416.099 187.038V181.223C416.068 180.117 416.475 179.042 417.231 178.233C417.601 177.835 418.053 177.521 418.555 177.313C419.057 177.104 419.598 177.006 420.141 177.024H439.868C440.423 177.011 440.974 177.111 441.488 177.319C442.002 177.527 442.468 177.838 442.857 178.233C443.254 178.622 443.566 179.088 443.775 179.602C443.984 180.117 444.085 180.668 444.072 181.223V258.606C444.428 263.849 443.611 269.106 441.681 273.995C439.751 278.884 436.757 283.283 432.915 286.873C423.995 293.824 412.837 297.271 401.546 296.565ZM400.252 237.284C402.185 237.432 404.126 237.13 405.922 236.401C407.717 235.672 409.319 234.537 410.601 233.084C412.965 230.016 414.321 226.292 414.482 222.423C414.624 220.812 414.678 219.195 414.643 217.578C414.684 215.961 414.63 214.343 414.482 212.732C414.349 208.834 412.991 205.077 410.601 201.993C409.306 200.561 407.7 199.445 405.906 198.73C404.112 198.016 402.178 197.722 400.252 197.871C398.315 197.705 396.365 198.007 394.568 198.752C392.772 199.496 391.181 200.661 389.93 202.149C387.567 205.654 386.326 209.794 386.373 214.019L386.211 217.572C385.955 222.576 387.014 227.559 389.283 232.027C390.449 233.827 392.091 235.271 394.026 236.199C395.962 237.127 398.117 237.502 400.252 237.284ZM466.71 261.029C466.181 261.029 465.657 260.922 465.171 260.713C464.685 260.505 464.246 260.199 463.883 259.815C463.498 259.451 463.191 259.012 462.982 258.526C462.773 258.039 462.666 257.515 462.668 256.985V181.234C462.637 180.127 463.044 179.053 463.799 178.243C464.17 177.845 464.621 177.532 465.123 177.323C465.625 177.115 466.166 177.016 466.71 177.034H486.427C486.981 177.021 487.532 177.122 488.046 177.33C488.56 177.538 489.026 177.848 489.415 178.243C489.812 178.632 490.124 179.098 490.333 179.613C490.542 180.127 490.644 180.679 490.631 181.234V187.372C493.572 184.09 497.183 181.475 501.219 179.702C505.485 177.881 510.085 176.974 514.724 177.039H522.026C522.563 177.02 523.098 177.11 523.598 177.304C524.099 177.499 524.554 177.793 524.937 178.17C525.314 178.552 525.609 179.007 525.803 179.507C525.998 180.007 526.088 180.541 526.068 181.078V198.684C526.078 199.739 525.672 200.756 524.937 201.513C524.567 201.912 524.115 202.227 523.613 202.436C523.111 202.646 522.57 202.745 522.026 202.728H505.679C503.866 202.608 502.047 202.862 500.336 203.473C498.625 204.085 497.058 205.04 495.732 206.281C494.518 207.637 493.585 209.221 492.989 210.94C492.392 212.659 492.144 214.48 492.258 216.296V256.99C492.276 257.534 492.176 258.074 491.966 258.576C491.757 259.078 491.442 259.528 491.043 259.898C490.233 260.652 489.16 261.058 488.054 261.029H466.71ZM576.987 262.644C565.753 263.394 554.63 260.036 545.691 253.197C541.954 249.782 538.968 245.627 536.922 240.998C534.877 236.369 533.817 231.366 533.809 226.305C533.701 224.916 533.647 222.493 533.647 219.037C533.647 215.58 533.701 213.149 533.809 211.742C533.858 206.681 534.97 201.687 537.073 197.083C539.175 192.479 542.221 188.366 546.015 185.012C554.83 178.169 565.832 174.755 576.977 175.403C588.132 174.756 599.142 178.177 607.96 185.032C611.753 188.387 614.8 192.5 616.902 197.104C619.004 201.708 620.116 206.702 620.166 211.763C620.381 214.562 620.489 216.994 620.489 219.057C620.489 221.121 620.381 223.544 620.166 226.326C620.157 231.386 619.096 236.388 617.049 241.017C615.003 245.645 612.016 249.798 608.278 253.213C599.339 260.045 588.218 263.397 576.987 262.644ZM576.987 242.291C578.84 242.432 580.7 242.133 582.414 241.417C584.129 240.702 585.649 239.591 586.851 238.175C589.329 234.413 590.624 229.996 590.57 225.493C590.678 224.416 590.732 222.262 590.732 219.031C590.732 215.801 590.678 213.647 590.57 212.57C590.599 208.096 589.305 203.713 586.851 199.971C585.663 198.534 584.148 197.402 582.431 196.671C580.715 195.94 578.848 195.632 576.987 195.771C575.127 195.632 573.26 195.94 571.544 196.671C569.827 197.402 568.312 198.534 567.124 199.971C564.669 203.713 563.376 208.096 563.405 212.57L563.243 219.031L563.405 225.493C563.351 229.996 564.646 234.413 567.124 238.175C568.328 239.587 569.849 240.694 571.563 241.406C573.278 242.118 575.136 242.414 576.987 242.271V242.291ZM656.866 261.029C655.618 261.115 654.381 260.744 653.387 259.986C652.509 259.175 651.867 258.142 651.53 256.996L628.245 182.203L627.922 180.749C627.909 180.25 628.003 179.754 628.198 179.295C628.393 178.836 628.685 178.424 629.054 178.087C629.752 177.41 630.689 177.035 631.662 177.045H649.287C650.454 177.001 651.599 177.37 652.521 178.087C653.303 178.668 653.871 179.49 654.138 180.426L667.397 225.169L681.48 180.749C681.719 179.728 682.287 178.812 683.097 178.144C684.049 177.359 685.26 176.956 686.493 177.013H697.65C698.883 176.956 700.094 177.359 701.046 178.144C701.864 178.835 702.479 179.736 702.824 180.749L716.908 225.169L730.005 180.426C730.365 179.516 730.95 178.711 731.706 178.087C732.586 177.368 733.699 176.998 734.835 177.045H752.444C752.937 177.027 753.428 177.111 753.888 177.29C754.347 177.469 754.765 177.74 755.115 178.087C755.461 178.436 755.732 178.853 755.912 179.31C756.091 179.768 756.175 180.258 756.158 180.749C756.164 181.239 756.11 181.727 755.997 182.203L732.54 256.99C732.321 258.179 731.673 259.246 730.72 259.99C729.766 260.734 728.573 261.103 727.366 261.029H712.005C710.765 261.08 709.545 260.708 708.546 259.974C707.546 259.24 706.827 258.188 706.507 256.99L692.116 214.024L677.563 256.99C677.321 258.198 676.644 259.276 675.661 260.02C674.678 260.764 673.457 261.123 672.227 261.029H656.866ZM773.309 261.029C772.779 261.03 772.254 260.923 771.767 260.714C771.28 260.506 770.84 260.199 770.476 259.815C770.092 259.45 769.786 259.012 769.578 258.525C769.37 258.038 769.264 257.514 769.266 256.985V181.234C769.236 180.127 769.642 179.053 770.398 178.243C770.768 177.845 771.22 177.532 771.722 177.323C772.224 177.115 772.765 177.016 773.309 177.034H793.036C793.591 177.021 794.143 177.121 794.658 177.329C795.173 177.537 795.64 177.848 796.03 178.243C796.425 178.632 796.737 179.099 796.945 179.613C797.153 180.128 797.253 180.679 797.24 181.234V187.372C800.183 184.09 803.795 181.474 807.834 179.702C812.086 177.885 816.672 176.976 821.296 177.034H828.599C829.135 177.014 829.67 177.105 830.171 177.299C830.671 177.493 831.127 177.788 831.509 178.165C831.886 178.547 832.181 179.002 832.376 179.502C832.571 180.002 832.661 180.536 832.641 181.072V198.679C832.651 199.734 832.244 200.751 831.509 201.508C831.139 201.907 830.688 202.222 830.186 202.431C829.684 202.64 829.142 202.74 828.599 202.722H812.257C810.444 202.603 808.625 202.857 806.914 203.468C805.203 204.079 803.636 205.035 802.31 206.276C801.095 207.632 800.163 209.216 799.566 210.935C798.97 212.654 798.722 214.475 798.836 216.291V256.99C798.853 257.534 798.754 258.074 798.544 258.576C798.335 259.078 798.02 259.528 797.621 259.898C796.811 260.652 795.738 261.058 794.632 261.029H773.309ZM838.613 261.029C837.505 261.059 836.43 260.653 835.619 259.898C835.221 259.528 834.907 259.077 834.699 258.575C834.49 258.074 834.391 257.533 834.409 256.99V235.669C834.396 235.114 834.496 234.562 834.704 234.048C834.912 233.534 835.224 233.067 835.619 232.678C836.009 232.283 836.476 231.971 836.991 231.764C837.506 231.556 838.058 231.455 838.613 231.469H859.957C860.501 231.451 861.042 231.549 861.544 231.758C862.046 231.967 862.498 232.28 862.868 232.678C863.624 233.488 864.03 234.562 864 235.669V256.99C864.01 258.046 863.603 259.062 862.868 259.82C862.498 260.217 862.046 260.531 861.544 260.74C861.042 260.948 860.501 261.047 859.957 261.029H838.613Z"
                    fill="currentColor"
                  />
                  <path
                    d="M126.708 286.462C196.687 286.462 253.416 229.792 253.416 159.886C253.416 89.9808 196.687 33.3112 126.708 33.3112C56.7291 33.3112 0 89.9808 0 159.886C0 229.792 56.7291 286.462 126.708 286.462Z"
                    fill="#6AE7DA"
                  />
                  <path
                    d="M242.415 79.9406C264.513 79.9406 282.428 62.0453 282.428 39.9703C282.428 17.8953 264.513 0 242.415 0C220.317 0 202.403 17.8953 202.403 39.9703C202.403 62.0453 220.317 79.9406 242.415 79.9406Z"
                    fill="#A9F3EA"
                  />
                  <path
                    d="M126.713 473.005C178.278 473.005 220.08 431.247 220.08 379.736C220.08 328.225 178.278 286.467 126.713 286.467C75.1481 286.467 33.3462 328.225 33.3462 379.736C33.3462 431.247 75.1481 473.005 126.713 473.005Z"
                    fill="#18D0BA"
                  />
                </g>
                <defs>
                  <clipPath>
                    <rect width="864" height="473" fill="currentColor" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Login with Nostr"
        isVisible={loginModal.isVisible}
        hide={loginModal.hide}
      >
        {typeof window !== "undefined" &&
        typeof window.nostr === "undefined" ? (
          <>
            <div className="mb-8">
              Install Alby or another Nostr extension and setup keys to login.{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://guides.getalby.com/overall-guide/alby-browser-extension/features/nostr"
                className="text-orange-800"
              >
                Learn more
              </a>
            </div>
            <a
              href="https://getalby.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded px-4 py-2 bg-orange-600 text-white"
            >
              Get Alby Extension
            </a>
          </>
        ) : (
          <>
            <div className="mb-8">
              You will be requested to confirm that you want to connect your
              Nostr identity with Bitcoin Street Store, and you will sign a
              message to enable access to the Bitcoin Street Store API.
            </div>
            <Button onClick={loginHandler}>Connect</Button>
          </>
        )}
      </Modal>
    </>
  );
};

export default Login;
