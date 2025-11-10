import type { MouseEvent, ReactNode } from "react";

export enum BUTTON_VARIANTS {
  PRIMARY = "primary",
  DEFAULT = "default",
}

export enum BUTTON_SIZES {
  LARGE = "large",
  DEFAULT = "default",
}

const ButtonVariantStyling: Record<BUTTON_VARIANTS, string> = {
  [BUTTON_VARIANTS.PRIMARY]: "bg-orange-700 hover:bg-orange-500 text-white",
  [BUTTON_VARIANTS.DEFAULT]: "bg-gray-700 hover:bg-gray-800 text-white",
};

const ButtonSizeStyling: Record<BUTTON_SIZES, string> = {
  [BUTTON_SIZES.DEFAULT]: "",
  [BUTTON_SIZES.LARGE]: "text-lg",
};

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: BUTTON_VARIANTS;
  size?: BUTTON_SIZES;
  updateModel?: any;
  useState?: any;
  useEffect?:any;
}

const Button = ({
  children,
  onClick,
  variant = BUTTON_VARIANTS.DEFAULT,
  size = BUTTON_SIZES.DEFAULT,
  updateModel = () => null,
  useState= () => null,
  useEffect= () => null,
}: ButtonProps): ReactNode => {
  const [counter, setCounter] = useState(0);
  const className = `rounded p-2 ${ButtonVariantStyling[variant]} ${ButtonSizeStyling[size]}`;

  console.log("hello from CDN", counter);
  useEffect(() => {
    updateModel({ data: [{ id: "hello", data: "smurfs" }] });
    setCounter((prev: number) => prev + 1);
  }, []);

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
