import { Center } from "App/components/layout";
import { ComponentProps } from "react";

type PageLayoutProps = ComponentProps<typeof Center>;

export default function PageLayout({ children, ...props }: PageLayoutProps): JSX.Element {
  return (
    <Center tag="main" {...props}>
      {children}
    </Center>
  );
}
