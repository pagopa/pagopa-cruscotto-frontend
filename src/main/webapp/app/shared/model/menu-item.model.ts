export interface MenuItem {
  label: string;
  route?: string;
  permission?: string;
  xSmall: boolean;
  small: boolean;
  medium: boolean;
  large: boolean;
  children?: MenuItem[];
}
