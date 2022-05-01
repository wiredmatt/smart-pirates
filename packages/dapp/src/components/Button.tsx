import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

interface IProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  bgColor?: string;
  textColor?: string;
}

const Button: FC<IProps> = (props) => {
  return (
    <button
      className={`text-xl rounded-2xl ${props.bgColor} ${props.textColor} p-3 hover:scale-105 transition-transform flex flex-row space-x-2 opacity-90 hover:opacity-100`}
      onClick={props.onClick}
    >
      {props.leftIcon}
      <div className="px-1">{props.children}</div>
      {props.rightIcon}
    </button>
  );
};

export default Button;
