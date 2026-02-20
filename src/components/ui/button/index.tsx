// 共通props
interface BaseProps {
  label: string;
  className?: string;
}

// buttonタグ用のprops
interface ButtonProps extends BaseProps {
  href?: never;
  target?: never;
  rel?: never;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

// aタグ用のprops
interface AnchorProps extends BaseProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  disabled?: never;
  type?: never;
}

type Props = ButtonProps | AnchorProps;

export default function Button({ label, href, className, ...rest }: Props) {
  const classes = `c-button ${className ?? ''}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {label}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {label}
    </button>
  );
}
