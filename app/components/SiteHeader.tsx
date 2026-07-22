import { AppNavigation } from "./AppNavigation";

type SiteHeaderProps = {
  activePath?: string;
};

export function SiteHeader({ activePath = "/" }: SiteHeaderProps) {
  return <AppNavigation activePath={activePath} />;
}
